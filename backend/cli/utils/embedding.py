import click
import openai
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core.clients import openai_client
from app.core.config import settings
from app.db.models import Chunk


def embed_chunks(chunks: list[Chunk]):
    batch_size = 99  # Infomaniak requires less than 100
    batches = [chunks[i : i + batch_size] for i in range(0, len(chunks), batch_size)]
    with click.progressbar(batches, label="    embed") as bar:
        for batch in bar:
            response = _create_embedding([c.embedding_input for c in batch])
            for chunk, data in zip(batch, response.data):
                chunk.embedding = data.embedding


@retry(
    retry=retry_if_exception_type(openai.RateLimitError),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(6),
)
def _create_embedding(input_: list[str]):
    return openai_client.embeddings.create(
        model=settings.openai_embedding_model,
        input=input_,
    )
