from datetime import datetime
from typing import cast

import click
import requests
from bs4 import BeautifulSoup, Tag
from sqlalchemy import update

from app.db.models import Document, DocumentChunk
from app.db.session import SessionLocal
from cli.utils.akn import akn_to_text
from cli.utils.text import normalize_text, split_text

SPARQL_ENDPOINT = "https://fedlex.data.admin.ch/sparqlendpoint"

# noinspection HttpUrlsUsage
SPARQL_QUERY = """
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT ?srNumber ?language ?title ?abbreviation ?htmlUrl ?xmlUrl
WHERE {{
  # Define language filter
  BIND(<{language_uri}> AS ?languageUri)

  # Get consolidation that is currently applicable
  ?consolidation a jolux:Consolidation ;
                jolux:dateApplicability ?applicabilityDate ;
                jolux:isRealizedBy ?consoExpr ;
                jolux:isMemberOf ?collection .

  FILTER(xsd:date(?applicabilityDate) <= xsd:date(NOW()))

  # Check if consolidation is still applicable
  OPTIONAL {{ ?consolidation jolux:dateEndApplicability ?endApplicabilityDate }}
  FILTER(!BOUND(?endApplicabilityDate) || xsd:date(?endApplicabilityDate) >= xsd:date(NOW()))

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

  # Check if collection is still in force
  OPTIONAL {{ ?collection jolux:dateNoLongerInForce ?collectionEndForceDate }}
  OPTIONAL {{ ?collection jolux:dateEndApplicability ?collectionEndApplicabilityDate }}
  FILTER(!BOUND(?collectionEndForceDate) || xsd:date(?collectionEndForceDate) > xsd:date(NOW()))
  FILTER(!BOUND(?collectionEndApplicabilityDate) || xsd:date(?collectionEndApplicabilityDate) >= xsd:date(NOW()))

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

# noinspection HttpUrlsUsage
LANGUAGE_URI_MAPPING = {
    "de": "http://publications.europa.eu/resource/authority/language/DEU",
    "fr": "http://publications.europa.eu/resource/authority/language/FRA",
    "it": "http://publications.europa.eu/resource/authority/language/ITA",
    "en": "http://publications.europa.eu/resource/authority/language/ENG",
}


@click.command(help="Import legal documents from Fedlex (Swiss federal law)")
@click.option("--language", default="de", help="Language of documents to import")
def load_fedlex(language):
    db = SessionLocal()
    import_start_time = datetime.utcnow()

    click.secho("Starting Fedlex import...", fg="green")

    language_uri = LANGUAGE_URI_MAPPING[language]

    sparql_query = SPARQL_QUERY.format(language_uri=language_uri)
    sparql_response = requests.post(
        SPARQL_ENDPOINT,
        data={"query": sparql_query},
        headers={"accept": "application/sparql-results+json"},
    )
    sparql_response.raise_for_status()

    for row in sparql_response.json()["results"]["bindings"]:
        sr_number = row["srNumber"]["value"]
        law_title = row["title"]["value"]
        law_abbr = row.get("abbreviation", {}).get("value")

        if law_abbr:
            click.echo(f"Processing document: {law_abbr} ({sr_number})")
        else:
            click.echo(f"Processing document: {law_title} ({sr_number})")

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

            search_document = Document(
                title=article_title,
                source="fedlex_article",
                language=language,
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

    db.execute(
        update(Document)
        .where(
            Document.source == "fedlex_article",
            Document.language == language,
            Document.updated_at < import_start_time,
        )
        .values(is_active=False)
    )
    db.commit()
