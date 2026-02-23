from app.core.clients import openai_client
from app.core.config import settings


def embed_text(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        input=text,
        model=settings.openai_embedding_model,
    )
    return response.data[0].embedding


def embed_texts(texts: list[str]) -> list[list[float]]:
    response = openai_client.embeddings.create(
        input=texts,
        model=settings.openai_embedding_model,
    )
    return [d.embedding for d in response.data]
