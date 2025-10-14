import click
from openai import OpenAI
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import Document, DocumentChunk


def create_embeddings(db: Session):
    chunks = (
        db.query(DocumentChunk)
        .join(Document)
        .filter(DocumentChunk.embedding.is_(None))
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
