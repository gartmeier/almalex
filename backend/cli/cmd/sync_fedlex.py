from datetime import datetime, timedelta
from typing import cast

import click
import requests
from bs4 import BeautifulSoup, Tag
from sqlalchemy import and_

from app.db.models import Document, DocumentChunk
from app.db.session import SessionLocal
from cli.utils.akn import akn_to_text
from cli.utils.text import normalize_text, split_text

SPARQL_ENDPOINT = "https://fedlex.data.admin.ch/sparqlendpoint"

# Query for consolidations with applicability changes since a given date
SPARQL_QUERY_INCREMENTAL = """
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT ?srNumber ?language ?title ?abbreviation ?htmlUrl ?xmlUrl ?applicabilityDate ?endApplicabilityDate
WHERE {{
  # Define language filter
  BIND(<{language_uri}> AS ?languageUri)

  # Get consolidation with applicability changes since last sync
  ?consolidation a jolux:Consolidation ;
                jolux:dateApplicability ?applicabilityDate ;
                jolux:isRealizedBy ?consoExpr ;
                jolux:isMemberOf ?collection .

  # Filter for consolidations that became applicable or expired since last sync
  FILTER(
    (xsd:date(?applicabilityDate) >= xsd:date("{since_date}")) ||
    (EXISTS {{ ?consolidation jolux:dateEndApplicability ?endDate .
              FILTER(xsd:date(?endDate) >= xsd:date("{since_date}")) }})
  )

  # Get language-specific expression
  ?consoExpr jolux:language ?languageUri .

  # Get HTML format
  ?consoExpr jolux:isEmbodiedBy ?htmlManif .
  ?htmlManif jolux:userFormat <https://fedlex.data.admin.ch/vocabulary/user-format/html> ;
             jolux:isExemplifiedBy ?htmlUrl .

  # Get XML format
  ?consoExpr jolux:isEmbodiedBy ?xmlManif .
  ?xmlManif jolux:userFormat <https://fedlex.data.admin.ch/vocabulary/user-format/xml> ;
            jolux:isExemplifiedBy ?xmlUrl .

  # Get SR Number from collection
  ?collection jolux:classifiedByTaxonomyEntry/skos:notation ?srNotationRaw .
  FILTER(datatype(?srNotationRaw) = <https://fedlex.data.admin.ch/vocabulary/notation-type/id-systematique>)

  # Get end applicability date if it exists
  OPTIONAL {{ ?consolidation jolux:dateEndApplicability ?endApplicabilityDate }}

  # Get title and abbreviation
  OPTIONAL {{
    ?collection jolux:isRealizedBy ?collectionExpr .
    ?collectionExpr jolux:language ?languageUri ;
                    jolux:title ?title .
    OPTIONAL {{ ?collectionExpr jolux:titleShort ?abbreviation }}
  }}

  # Reformat output values
  BIND(STR(?srNotationRaw) AS ?srNumber)
}}
ORDER BY ?srNumber
"""

LANGUAGE_URI_MAPPING = {
    "de": "http://publications.europa.eu/resource/authority/language/DEU",
    "fr": "http://publications.europa.eu/resource/authority/language/FRA",
    "it": "http://publications.europa.eu/resource/authority/language/ITA",
    "en": "http://publications.europa.eu/resource/authority/language/ENG",
}


@click.command(help="Incrementally sync legal documents from Fedlex")
@click.option("--language", default="de", help="Language of documents to sync")
@click.option("--days-back", default=1, help="Number of days to look back for changes")
@click.option(
    "--dry-run", is_flag=True, help="Show what would be synced without applying changes"
)
def sync_fedlex(language, days_back, dry_run):
    db = SessionLocal()
    sync_start_time = datetime.utcnow()
    since_date = (sync_start_time - timedelta(days=days_back)).date().isoformat()

    if dry_run:
        click.secho(
            f"DRY RUN: Checking for Fedlex changes since {since_date}...", fg="yellow"
        )
    else:
        click.secho(
            f"Starting Fedlex incremental sync since {since_date}...", fg="green"
        )

    language_uri = LANGUAGE_URI_MAPPING[language]
    sparql_query = SPARQL_QUERY_INCREMENTAL.format(
        language_uri=language_uri, since_date=since_date
    )

    sparql_response = requests.post(
        SPARQL_ENDPOINT,
        data={"query": sparql_query},
        headers={"accept": "application/sparql-results+json"},
    )
    sparql_response.raise_for_status()

    results = sparql_response.json()["results"]["bindings"]

    if not results:
        click.secho("No changes found since last sync.", fg="green")
        return

    click.echo(f"Found {len(results)} consolidations with changes")

    stats = {"updated": 0, "deactivated": 0, "new": 0, "skipped": 0}

    for row in results:
        sr_number = row["srNumber"]["value"]
        law_title = row["title"]["value"]
        law_abbr = row.get("abbreviation", {}).get("value")

        # Parse applicability dates
        valid_from = datetime.fromisoformat(
            row["applicabilityDate"]["value"].replace("Z", "+00:00")
        )
        valid_to = None
        if "endApplicabilityDate" in row:
            valid_to = datetime.fromisoformat(
                row["endApplicabilityDate"]["value"].replace("Z", "+00:00")
            )

        # Check if this consolidation is currently applicable
        now = datetime.utcnow().replace(tzinfo=valid_from.tzinfo)
        is_currently_applicable = valid_from <= now and (
            valid_to is None or valid_to >= now
        )

        if law_abbr:
            click.echo(
                f"Checking: {law_abbr} ({sr_number}) - {'active' if is_currently_applicable else 'expired'}"
            )
        else:
            click.echo(
                f"Checking: {law_title} ({sr_number}) - {'active' if is_currently_applicable else 'expired'}"
            )

        # Check if we already have articles for this consolidation version (using dateApplicability as version)
        pattern = f"{sr_number}/{language}/%"
        existing_articles = (
            db.query(Document)
            .filter(
                and_(
                    Document.source == "fedlex_article",
                    Document.external_id.like(pattern),
                    Document.valid_from == valid_from,
                )
            )
            .first()
        )

        if existing_articles:
            click.echo(
                f"  Skipping - consolidation version already exists (dateApplicability: {valid_from})"
            )
            stats["skipped"] += 1
            continue

        click.echo(
            f"  Processing - new consolidation version (dateApplicability: {valid_from})"
        )

        # Process articles for this consolidation version
        if not dry_run:
            articles_added = _process_consolidation_articles(
                db, row, sr_number, law_title, law_abbr, language, valid_from, valid_to
            )
            stats["new"] += articles_added
            click.echo(f"  Added {articles_added} articles for version {valid_from}")
        else:
            click.echo(
                f"  Would process articles for consolidation version {valid_from}"
            )

    if not dry_run:
        db.commit()
        click.secho(
            f"Sync completed: {stats['new']} new articles, {stats['skipped']} versions skipped",
            fg="green",
        )
    else:
        click.secho(
            f"DRY RUN completed - no changes made: {stats['skipped']} versions would be skipped",
            fg="yellow",
        )


def _process_consolidation_articles(
    db, row, sr_number, law_title, law_abbr, language, valid_from, valid_to
):
    """Process all articles for a consolidation"""
    html_response = requests.get(row["htmlUrl"]["value"])
    html_response.raise_for_status()
    html_response.encoding = html_response.apparent_encoding
    html_content = html_response.text
    html_root = BeautifulSoup(html_content, "html.parser")

    xml_response = requests.get(row["xmlUrl"]["value"])
    xml_response.raise_for_status()
    xml_response.encoding = xml_response.apparent_encoding
    xml_content = xml_response.text
    xml_root = BeautifulSoup(xml_content, "xml")

    frbr_work_tag = cast(Tag, xml_root.find("FRBRWork"))
    frbr_url_tag = cast(Tag, frbr_work_tag.find("FRBRuri"))
    frbr_url_value = frbr_url_tag["value"]

    article_tags = cast(list[Tag], xml_root.find_all("article"))
    articles_added = 0

    for article_index, article_tag in enumerate(article_tags):
        article_id = article_tag["eId"]
        article_num_el = cast(Tag, article_tag.find("num", recursive=False))

        # Drop authorial notes
        for note_el in article_num_el.find_all("authorialNote"):
            note_el.extract()

        article_num = normalize_text(article_num_el.get_text())

        if law_abbr:
            article_title = f"{article_num} {law_abbr}"
        else:
            article_title = f"{article_num} {law_title}"

        article_html_el = html_root.find(id=article_id)

        # Create composite external_id: sr_number/language/article_num
        external_id = f"{sr_number}/{language}/{article_num}"

        search_document = Document(
            title=article_title,
            source="fedlex_article",
            language=language,
            external_id=external_id,
            valid_from=valid_from,
            valid_to=valid_to,
            metadata={
                "sr_number": sr_number,
                "law_title": law_title,
                "law_abbr": law_abbr,
                "law_url": frbr_url_value,
                "article_index": article_index,
                "article_id": article_id,
                "article_num": article_num,
                "article_html": str(article_html_el),
                "article_xml": str(article_tag),
            },
        )
        db.add(search_document)
        db.flush()

        text = akn_to_text(article_tag)
        text = normalize_text(text)
        text_chunks = split_text(text)

        for chunk_index, chunk_text in enumerate(text_chunks):
            chunk = DocumentChunk(
                document_id=search_document.id,
                text=chunk_text.strip(),
                order=chunk_index,
            )
            db.add(chunk)

        articles_added += 1

    return articles_added
