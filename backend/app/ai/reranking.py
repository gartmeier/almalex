import cohere

from app.core.config import settings
from app.db.models import DocumentChunk

client = cohere.ClientV2(api_key=settings.cohere_api_key)


def rerank_chunks(
    query: str, chunks: list[DocumentChunk], top_k: int | None = None
) -> list[DocumentChunk]:
    """Rerank chunks using Cohere's reranking model.

    Args:
        query: Search query
        chunks: Chunks to rerank
        top_k: Number of top results to return (None = return all reranked)

    Returns:
        Reranked chunks
    """
    if not chunks:
        return chunks

    documents = [chunk.text for chunk in chunks]

    response = client.rerank(
        model=settings.cohere_rerank_model,
        query=query,
        documents=documents,
        top_n=top_k or len(chunks),
    )

    # Reorder chunks by Cohere's ranking
    reranked = [chunks[result.index] for result in response.results]
    return reranked
