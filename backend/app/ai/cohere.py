from typing import Sequence

import cohere

from app.core.config import settings
from app.db.models import DocumentChunk

client = cohere.ClientV2(api_key=settings.cohere_api_key)


def rerank_chunks(
    query: str, chunks: Sequence[DocumentChunk], top_k: int = 20
) -> list[DocumentChunk]:
    """Rerank chunks using Cohere rerank-multilingual-v3.0."""
    if not chunks:
        return []

    documents = [chunk.text for chunk in chunks]

    response = client.rerank(
        model="rerank-multilingual-v3.0",
        query=query,
        documents=documents,
        top_n=top_k,
    )

    reranked = [chunks[result.index] for result in response.results]
    return reranked
