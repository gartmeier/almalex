import cohere

from app.core.config import settings

client = cohere.ClientV2(
    api_key=settings.cohere_api_key,
    base_url=settings.cohere_base_url,
)


def rerank(query: str, chunks: list, top_k: int | None = None) -> list:
    if not chunks:
        return chunks

    response = client.rerank(
        model=settings.cohere_rerank_model,
        query=query,
        documents=[c.text for c in chunks],
        top_n=top_k or len(chunks),
    )

    return [chunks[r.index] for r in response.results]
