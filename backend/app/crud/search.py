from sqlalchemy import func, literal, select, union_all
from sqlalchemy.orm import Session, selectinload

from app.ai.embeddings import create_embedding
from app.db.models import DocumentChunk


def diversify_chunks(
    chunks: list[DocumentChunk],
    target_distribution: dict[str, float] = {"fedlex_article": 0.6, "bge": 0.4},
    top_k: int = 100,
) -> list[DocumentChunk]:
    """Diversify chunks by document source to balance laws and court decisions.

    Args:
        chunks: Ordered chunks from retrieval
        target_distribution: Target distribution by source (default 60% laws, 40% BGE)
        top_k: Number of chunks to return

    Returns:
        Diversified list maintaining relevance order within source groups
    """
    if not chunks:
        return chunks

    # Group by source
    by_source: dict[str, list[DocumentChunk]] = {}
    for chunk in chunks:
        source = chunk.document.source
        if source not in by_source:
            by_source[source] = []
        by_source[source].append(chunk)

    # Calculate target counts
    diversified = []
    for source, ratio in target_distribution.items():
        n = int(top_k * ratio)
        diversified.extend(by_source.get(source, [])[:n])

    return diversified[:top_k]


def retrieve(
    *,
    db: Session,
    query: str,
    source: str,
    top_k: int = 100,
    rrf_k: int = 60,
) -> list[DocumentChunk]:
    """Retrieve document chunks using hybrid full-text + vector ranking.

    Args:
        db: Database session
        query: Search query string
        source: Filter by document source (e.g., "fedlex_article", "bge")
        top_k: Number of results to return
        rrf_k: RRF constant for ranking (default 60)

    Returns:
        List of DocumentChunk ordered by RRF score with document preloaded
    """
    embedding = create_embedding(query)

    # Filter by source
    from app.db.models import Document

    source_filter = Document.source == source

    # CTE for vector search with ranks
    vector_cte = (
        select(
            DocumentChunk.id.label("chunk_id"),
            func.row_number()
            .over(order_by=DocumentChunk.embedding.l2_distance(embedding))
            .label("rank"),
            literal("vector").label("source"),
        )
        .join(DocumentChunk.document)
        .where(DocumentChunk.embedding.isnot(None))
        .where(source_filter)
        .order_by(DocumentChunk.embedding.l2_distance(embedding))
        .limit(top_k * 2)
        .cte("vector_ranks")
    )

    # CTE for full-text search with ranks
    fts_query = func.plainto_tsquery("simple", query)
    fts_cte = (
        select(
            DocumentChunk.id.label("chunk_id"),
            func.row_number()
            .over(
                order_by=func.ts_rank(
                    DocumentChunk.text_search_vector, fts_query
                ).desc()
            )
            .label("rank"),
            literal("fts").label("source"),
        )
        .join(DocumentChunk.document)
        .where(DocumentChunk.text_search_vector.op("@@")(fts_query))
        .where(source_filter)
        .order_by(func.ts_rank(DocumentChunk.text_search_vector, fts_query).desc())
        .limit(top_k * 2)
        .cte("fts_ranks")
    )

    # Union both search methods
    combined = union_all(
        select(fts_cte.c.chunk_id, fts_cte.c.rank, fts_cte.c.source),
        select(vector_cte.c.chunk_id, vector_cte.c.rank, vector_cte.c.source),
    ).subquery()

    # Calculate RRF scores in database
    rrf_scores = (
        select(
            combined.c.chunk_id,
            func.sum(1.0 / (rrf_k + combined.c.rank)).label("rrf_score"),
        )
        .group_by(combined.c.chunk_id)
        .order_by(func.sum(1.0 / (rrf_k + combined.c.rank)).desc())
        .limit(top_k)
        .subquery()
    )

    # Fetch chunks in RRF order with documents preloaded
    return db.scalars(
        select(DocumentChunk)
        .join(rrf_scores, DocumentChunk.id == rrf_scores.c.chunk_id)
        .options(selectinload(DocumentChunk.document))
        .order_by(rrf_scores.c.rrf_score.desc())
    ).all()
