"""Legal document search with hybrid ranking and citation lookup."""

import re

from sqlalchemy import func, literal, or_, select, union_all
from sqlalchemy.orm import Session, selectinload

from app.db.models import Document, DocumentChunk
from app.services import embedding, ranking

SOURCE_MAPPING = {
    "federal_law": "fedlex_article",
    "federal_court": "bge",
}


def search(
    *,
    db: Session,
    query: str,
    source: str,
    limit: int = 20,
) -> list[DocumentChunk]:
    """Search documents using hybrid RRF + Cohere reranking.

    Args:
        db: Database session
        query: Search query
        source: Source type ("federal_law" or "federal_court")
        limit: Max results to return

    Returns:
        Ranked document chunks with document preloaded
    """
    # Map friendly name to internal source
    internal_source = SOURCE_MAPPING.get(source, source)

    # Hybrid search with RRF
    chunks = _hybrid_search(
        db=db,
        query=query,
        source=internal_source,
        top_k=limit * 2,
    )

    # Cohere reranking
    return ranking.rerank(query, chunks, top_k=limit)


def lookup_article(*, db: Session, article_reference: str) -> list[DocumentChunk]:
    """Lookup law article by reference (e.g., 'Art. 334 OR').

    Args:
        db: Database session
        article_reference: Article reference like "Art. 334 OR" or "334 OR"

    Returns:
        Matching article chunks
    """
    # Parse article reference
    pattern = r"(?:Art\.?\s*)?(\d+)(?:\s+Abs\.?\s+\d+)?\s+([A-Z]+)"
    match = re.search(pattern, article_reference, re.IGNORECASE)

    if not match:
        return []

    article_num, law_abbr = match.groups()

    # Exact metadata match
    chunks = db.scalars(
        select(DocumentChunk)
        .join(DocumentChunk.document)
        .where(Document.source == "fedlex_article")
        .where(Document.metadata_["article_num"].astext == article_num)
        .where(Document.metadata_["law_abbr"].astext == law_abbr.upper())
        .options(selectinload(DocumentChunk.document))
        .order_by(DocumentChunk.order)
    ).all()

    # Fallback to title/text search
    if not chunks:
        search_term = f"Art. {article_num} {law_abbr.upper()}"
        chunks = db.scalars(
            select(DocumentChunk)
            .join(DocumentChunk.document)
            .where(Document.source == "fedlex_article")
            .where(
                or_(
                    Document.title.ilike(f"%{search_term}%"),
                    DocumentChunk.text.ilike(f"%{search_term}%"),
                )
            )
            .options(selectinload(DocumentChunk.document))
            .order_by(DocumentChunk.order)
            .limit(5)
        ).all()

    return chunks


def lookup_decision(*, db: Session, citation: str) -> list[DocumentChunk]:
    """Lookup court decision by BGE citation (e.g., '146 V 240').

    Args:
        db: Database session
        citation: BGE citation like "146 V 240" or "BGE 146 V 240"

    Returns:
        Matching court decision chunks
    """
    # Parse BGE citation
    pattern = r"(?:BGE\s+)?(\d+)\s+([IVX]+)\s+(\d+)"
    match = re.search(pattern, citation, re.IGNORECASE)

    if not match:
        return []

    volume, part, page = match.groups()
    search_citation = f"BGE {volume} {part.upper()} {page}"

    # Exact metadata match
    chunks = db.scalars(
        select(DocumentChunk)
        .join(DocumentChunk.document)
        .where(Document.source == "bge")
        .where(Document.metadata_["Num"].astext.contains(search_citation))
        .options(selectinload(DocumentChunk.document))
        .order_by(DocumentChunk.order)
        .limit(10)
    ).all()

    # Fallback to title/text search
    if not chunks:
        chunks = db.scalars(
            select(DocumentChunk)
            .join(DocumentChunk.document)
            .where(Document.source == "bge")
            .where(
                or_(
                    Document.title.ilike(f"%{search_citation}%"),
                    DocumentChunk.text.ilike(f"%{search_citation}%"),
                )
            )
            .options(selectinload(DocumentChunk.document))
            .order_by(DocumentChunk.order)
            .limit(10)
        ).all()

    return chunks


def _hybrid_search(
    *,
    db: Session,
    query: str,
    source: str,
    top_k: int = 100,
    rrf_k: int = 60,
) -> list[DocumentChunk]:
    """Hybrid full-text + vector search with RRF ranking.

    Args:
        db: Database session
        query: Search query
        source: Document source filter
        top_k: Number of results to return
        rrf_k: RRF constant (default 60)

    Returns:
        Document chunks ordered by RRF score with document preloaded
    """
    query_embedding = embedding.embed_text(query)
    source_filter = Document.source == source

    # Vector search CTE
    vector_cte = (
        select(
            DocumentChunk.id.label("chunk_id"),
            func.row_number()
            .over(order_by=DocumentChunk.embedding.l2_distance(query_embedding))
            .label("rank"),
            literal("vector").label("source"),
        )
        .join(DocumentChunk.document)
        .where(DocumentChunk.embedding.isnot(None))
        .where(source_filter)
        .order_by(DocumentChunk.embedding.l2_distance(query_embedding))
        .limit(top_k * 2)
        .cte("vector_ranks")
    )

    # Full-text search CTE
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

    # Calculate RRF scores
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
