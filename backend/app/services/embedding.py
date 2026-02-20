"""Text embedding using Infomaniak AI API."""

from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    api_key=settings.infomaniak_api_key,
    base_url=f"https://api.infomaniak.com/1/ai/{settings.infomaniak_embedding_product_id}/openai/v1",
)


def embed_text(input: str) -> list[float]:
    response = client.embeddings.create(
        input=input,
        model=settings.infomaniak_embedding_model,
    )
    return response.data[0].embedding
