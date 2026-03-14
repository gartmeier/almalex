from openai import OpenAI

from app.core.config import settings


class EmbeddingService:
    def __init__(self, client: OpenAI):
        self.client = client

    def embed_text(self, text: str) -> list[float]:
        response = self.client.embeddings.create(
            input=text, model=settings.openai_embedding_model
        )
        return response.data[0].embedding

    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        response = self.client.embeddings.create(
            input=texts, model=settings.openai_embedding_model
        )
        return [d.embedding for d in response.data]
