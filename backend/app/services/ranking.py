import cohere

from app.core.config import settings
from app.db.models import DocumentChunk

client = cohere.ClientV2(
    api_key=settings.infomaniak_api_key,
    base_url=f"https://api.infomaniak.com/2/ai/{settings.infomaniak_rerank_product_id}/cohere",
)


def rerank(
    query: str, chunks: list[DocumentChunk], top_k: int | None = None
) -> list[DocumentChunk]:
    if not chunks:
        return chunks

    response = client.rerank(
        model=settings.infomaniak_rerank_model,
        query=query,
        documents=[c.text for c in chunks],
        top_n=top_k or len(chunks),
    )

    return [chunks[r.index] for r in response.results]
