import click
import openai
from sqlalchemy import select
from sqlalchemy.orm import Session
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core.clients import bulk_embedding_client as client
from app.core.config import settings
from app.db.models import Chunk


def embed_missing_chunks(db: Session):
    chunks = db.scalars(select(Chunk).where(Chunk.embedding.is_(None))).all()
    if not chunks:
        click.echo("  No chunks to embed")
        return

    batch_size = settings.bulk_embedding_batch_size
    batches = [chunks[i : i + batch_size] for i in range(0, len(chunks), batch_size)]

    with click.progressbar(batches, label="    embed") as bar:
        for batch in bar:
            input_ = [c.embedding_input for c in batch]

            try:
                response = _create_embedding(input_)
            except openai.InternalServerError as e:
                # Skip batch on server error to avoid blocking the entire job.
                # Chunk IDs are logged for manual inspection.
                lengths = [len(s) for s in input_]
                chunk_ids = [c.id for c in batch]
                click.secho(
                    f"Embedding failed: {e}. Batch size: {len(input_)}, input lengths: {lengths}, chunk IDs: {chunk_ids}",
                    fg="red",
                )
                continue

            for chunk, data in zip(batch, response.data):
                chunk.embedding = data.embedding

            db.commit()


@retry(
    retry=retry_if_exception_type(
        (
            openai.RateLimitError,
            openai.APITimeoutError,
            openai.APIConnectionError,
        )
    ),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(6),
)
def _create_embedding(input_: list[str]):
    return client.embeddings.create(
        model=settings.bulk_embedding_model,
        input=input_,
    )
