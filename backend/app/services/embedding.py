"""Text embedding using OpenAI API."""

from openai import OpenAI

from app.core.config import settings

client = OpenAI(api_key=settings.openai_api_key)


def embed_text(input: str) -> list[float]:
    """Embed text using OpenAI API.

    Args:
        input: Text to embed

    Returns:
        Embedding vector
    """
    response = client.embeddings.create(
        input=input,
        model=settings.openai_embedding_model,
    )
    return response.data[0].embedding
