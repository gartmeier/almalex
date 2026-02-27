from concurrent.futures import ThreadPoolExecutor, as_completed

import click
import openai
from sqlalchemy import func, select
from sqlalchemy.orm import Session, defer
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core.clients import bulk_embedding_client as client
from app.core.config import settings
from app.db.models import Chunk

embedding_model = settings.bulk_embedding_model
batch_size = settings.bulk_embedding_batch_size
max_workers = settings.bulk_embedding_max_workers


def embed_missing_chunks(db: Session):
    page_size = batch_size * max_workers
    total = 0

    while True:
        remaining = db.scalar(
            select(func.count()).select_from(Chunk).where(Chunk.embedding.is_(None))
        )
        if not remaining:
            if total == 0:
                click.echo("  No chunks to embed")
            else:
                click.echo(f"    done — {total} chunks embedded")
            return

        click.echo(
            f"    {remaining} remaining, embedding next {min(remaining, page_size)}..."
        )
        chunks = db.scalars(
            select(Chunk)
            .where(Chunk.embedding.is_(None))
            .options(defer(Chunk.search_vector))
            .order_by(Chunk.id)
            .limit(page_size)
        ).all()

        batches = _batch(chunks, batch_size)
        with ThreadPoolExecutor(max_workers=max_workers) as pool:
            for window in _batch(batches, max_workers):
                _embed_parallel(pool, window)
        total += len(chunks)
        db.commit()
        db.expire_all()


def _embed_parallel(pool, batches):
    futures = {
        pool.submit(_call_api, [c.embedding_input for c in batch]): batch
        for batch in batches
    }
    for future in as_completed(futures):
        batch = futures[future]
        try:
            response = future.result()
        except openai.InternalServerError as e:
            _log_failure(batch, e)
        else:
            for chunk, data in zip(batch, response.data):
                chunk.embedding = data.embedding


def _log_failure(batch, error):
    chunk_ids = [c.id for c in batch]
    click.secho(f"Embedding failed for chunks {chunk_ids}: {error}", fg="red")


def _batch(items, size):
    return [items[i : i + size] for i in range(0, len(items), size)]


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
def _call_api(input_: list[str]):
    return client.embeddings.create(
        model=embedding_model,
        input=input_,
    )
