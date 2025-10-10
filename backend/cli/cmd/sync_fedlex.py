from datetime import datetime, timedelta, timezone

import click
from openai import OpenAI
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import Document, DocumentChunk
from app.db.session import SessionLocal
from cli.utils.fedlex import process_fedlex_articles
from cli.utils.sparql import exec_sparql


@click.command()
@click.option("--since", help="Start date for sync (YYYY-MM-DD)")
@click.option("--embed", is_flag=True, help="Create embeddings for new documents")
def sync_fedlex(since, embed):
    with SessionLocal() as db:
        if since:
            since = datetime.strptime(since, "%Y-%m-%d")
        else:
            since = datetime.now(timezone.utc) - timedelta(days=1)

        since = since.date().isoformat()

        delete_expired(db, since)
        import_latest(db, since)

        if embed:
            create_embeddings(db)


EXPIRED_QUERY = """
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT ?srNumber ?dateEndApplicability
WHERE {{
  BIND(xsd:date("{since}") as ?since)

  # Get ConsolidationAbstract (the collection/law)
  ?cc a jolux:ConsolidationAbstract .

  # Get SR Number from collection
  ?cc jolux:classifiedByTaxonomyEntry/skos:notation ?srNotation .
  FILTER(datatype(?srNotation) = <https://fedlex.data.admin.ch/vocabulary/notation-type/id-systematique>)
  BIND(STR(?srNotation) AS ?srNumber)

  # Get consolidation that belongs to this collection
  ?conso jolux:isMemberOf ?cc ;
         a jolux:Consolidation ;
         jolux:dateApplicability ?dateApplicability .

  # Check if consolidation has expired since last sync date
  OPTIONAL {{ ?conso jolux:dateEndApplicability ?dateEndApplicability }}
  FILTER(BOUND(?dateEndApplicability) &&
         xsd:date(?dateEndApplicability) >= ?since &&
         xsd:date(?dateEndApplicability) < xsd:date(NOW()))
}}
ORDER BY ?srNumber
"""


def delete_expired(db: Session, since: str):
    sr_numbers = [
        row["srNumber"]["value"]
        for row in exec_sparql(EXPIRED_QUERY.format(since=since))
    ]

    if not sr_numbers:
        click.echo("No expired documents found")
        return

    docs = (
        db.query(Document)
        .filter(Document.metadata_["sr_number"].astext.in_(sr_numbers))
        .order_by(Document.metadata_["sr_number"], Document.metadata_["article_index"])
        .all()
    )

    click.echo(
        f"Deleting {len(docs)} documents for {len(sr_numbers)} expired SR numbers"
    )
    for doc in docs:
        click.echo(f"  - {doc.title} (SR {doc.metadata_.get('sr_number')})")

    for doc in docs:
        db.delete(doc)
    db.commit()


LATEST_QUERY = """
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT
  (str(?srNotation) as ?srNumber)
  (str(?dateApplicabilityNode) as ?applicabilityDate)
  (str(?dateEndApplicabilityNode) as ?endApplicabilityDate)
  ?title
  ?abbreviation
  ?htmlUrl
  ?xmlUrl
WHERE {{
  # Configuration: language and since date
  BIND(<http://publications.europa.eu/resource/authority/language/{language}> AS ?languageUri)
  BIND(xsd:date("{since}") AS ?sinceDate)

  # Get consolidations
  ?consolidation a jolux:Consolidation ;
                jolux:dateApplicability ?dateApplicabilityNode ;
                jolux:isMemberOf ?cc .

  # Filter for consolidations that expired after the since date
  ?consolidation jolux:dateEndApplicability ?dateEndApplicabilityNode .
  FILTER(xsd:date(?dateEndApplicabilityNode) > ?sinceDate && xsd:date(?dateEndApplicabilityNode) <= xsd:date(NOW()))

  # Get ConsolidationAbstract details
  ?cc jolux:classifiedByTaxonomyEntry/skos:notation ?srNotation .
  FILTER(datatype(?srNotation) = <https://fedlex.data.admin.ch/vocabulary/notation-type/id-systematique>)

  # Get language-specific expression from consolidation
  ?consolidation jolux:isRealizedBy ?consoExpr .
  ?consoExpr jolux:language ?languageUri .

  # Get ConsolidationAbstract metadata (title and abbreviation)
  OPTIONAL {{
    ?cc jolux:isRealizedBy ?ccExpr .
    ?ccExpr jolux:language ?languageUri ;
            jolux:title ?title .
    OPTIONAL {{ ?ccExpr jolux:titleShort ?abbreviation }}
  }}

  # Get file URLs in HTML format
  ?consoExpr jolux:isEmbodiedBy ?htmlManif .
  ?htmlManif jolux:userFormat <https://fedlex.data.admin.ch/vocabulary/user-format/html> ;
             jolux:isExemplifiedBy ?htmlUrl .

  # Get file URLs in XML format
  ?consoExpr jolux:isEmbodiedBy ?xmlManif .
  ?xmlManif jolux:userFormat <https://fedlex.data.admin.ch/vocabulary/user-format/xml> ;
            jolux:isExemplifiedBy ?xmlUrl .
}}
ORDER BY ?srNotation ?dateEndApplicabilityNode
"""


def import_latest(db: Session, since: str):
    results = exec_sparql(LATEST_QUERY.format(language="DEU", since=since))

    if not results:
        click.echo("No new or updated documents found")
        return

    click.echo(f"Found {len(results)} laws to import")

    total_articles = 0
    for row in results:
        sr_number = row["srNumber"]["value"]
        law_title = row["title"]["value"]
        law_abbr = row.get("abbreviation", {}).get("value")

        if law_abbr:
            click.echo(f"Processing: {law_abbr} ({sr_number})")
        else:
            click.echo(f"Processing: {law_title} ({sr_number})")

        articles_added = process_fedlex_articles(
            db=db,
            html_url=row["htmlUrl"]["value"],
            xml_url=row["xmlUrl"]["value"],
            sr_number=sr_number,
            law_title=law_title,
            law_abbr=law_abbr,
        )
        total_articles += articles_added
        click.echo(f"  Added {articles_added} articles")

    db.commit()

    click.secho(
        f"Import completed: {total_articles} articles from {len(results)} laws",
        fg="green",
    )


def create_embeddings(db: Session):
    chunks = (
        db.query(DocumentChunk)
        .join(Document)
        .filter(
            Document.source == "fedlex_article",
            DocumentChunk.embedding.is_(None),
        )
        .order_by(DocumentChunk.id)
        .all()
    )

    if not chunks:
        click.echo("No chunks without embeddings found")
        return

    click.echo(f"Creating embeddings for {len(chunks)} chunks")

    client = OpenAI(api_key=settings.openai_api_key)
    batch_size = 100

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        texts = [chunk.text for chunk in batch]

        response = client.embeddings.create(
            input=texts,
            model=settings.openai_embedding_model,
        )

        for chunk, embedding_data in zip(batch, response.data):
            chunk.embedding = embedding_data.embedding

        db.commit()
        click.echo(f"  Processed {i + len(batch)}/{len(chunks)} chunks")

    click.secho(f"Created {len(chunks)} embeddings", fg="green")
