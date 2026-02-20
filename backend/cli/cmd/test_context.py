import click
import requests
from bs4 import BeautifulSoup

from app.db.models import Document, DocumentChunk
from app.db.session import SessionLocal
from cli.utils.embeddings import generate_context


@click.command("test-context")
@click.option("--sr-number", default="311.0", show_default=True)
@click.option("--limit", default=3, show_default=True)
def test_context(sr_number: str, limit: int):
    with SessionLocal() as db:
        chunks = (
            db.query(DocumentChunk)
            .join(Document)
            .filter(Document.metadata_["sr_number"].astext == sr_number)
            .order_by(DocumentChunk.document_id, DocumentChunk.order)
            .limit(limit)
            .all()
        )

        if not chunks:
            click.secho(f"No chunks found for SR {sr_number}", fg="red")
            return

        html_url = db.get(Document, chunks[0].document_id).metadata_.get("html_url")
        if not html_url:
            click.secho("No html_url in metadata — re-import to populate it", fg="red")
            return

        click.echo(f"Fetching law HTML from {html_url}")
        resp = requests.get(html_url)
        resp.raise_for_status()
        resp.encoding = resp.apparent_encoding
        document_text = BeautifulSoup(resp.text, "html.parser").get_text(
            separator="\n", strip=True
        )
        click.echo(f"Law text: {len(document_text)} chars\n")

        for chunk in chunks:
            doc = db.get(Document, chunk.document_id)
            context = generate_context(document_text, chunk.text)

            click.secho(f"--- {doc.title} ---", fg="cyan", bold=True)
            click.echo(f"Chunk: {chunk.text[:200]}...")
            click.secho(f"Context: {context}\n", fg="yellow")
