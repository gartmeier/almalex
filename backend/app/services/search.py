"""Legal document search with hybrid ranking and citation lookup."""

import re

from sqlalchemy import func, literal, or_, select, union_all
from sqlalchemy.orm import Session, selectinload

from app.db.models import Article, ArticleChunk, Document, DocumentChunk
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
) -> list:
    internal_source = SOURCE_MAPPING.get(source, source)
    chunks = _hybrid_search(db=db, query=query, source=internal_source, top_k=limit * 2)
    return ranking.rerank(query, chunks, top_k=limit)


def lookup_article(*, db: Session, article_reference: str) -> list[ArticleChunk]:
    ref = article_reference.strip()
    if not ref.lower().startswith("art"):
        ref = f"Art. {ref}"

    articles = db.scalars(
        select(Article)
        .where(Article.num.ilike(ref))
        .options(selectinload(Article.chunks), selectinload(Article.act))
        .order_by(Article.sort_order)
    ).all()

    result = []
    for article in articles:
        result.extend(article.chunks)
    return result


def lookup_decision(*, db: Session, citation: str) -> list[DocumentChunk]:
    pattern = r"(?:BGE\s+)?(\d+)\s+([IVX]+)\s+(\d+)"
    match = re.search(pattern, citation, re.IGNORECASE)

    if not match:
        return []

    volume, part, page = match.groups()
    search_citation = f"BGE {volume} {part.upper()} {page}"

    chunks = db.scalars(
        select(DocumentChunk)
        .join(DocumentChunk.document)
        .where(Document.source == "bge")
        .where(Document.metadata_["Num"].astext.contains(search_citation))
        .options(selectinload(DocumentChunk.document))
        .order_by(DocumentChunk.order)
        .limit(10)
    ).all()

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
    *, db: Session, query: str, source: str, top_k: int = 100, rrf_k: int = 60
) -> list:
    if source == "fedlex_article":
        return _hybrid_search_fedlex(db, query, top_k, rrf_k)
    return _hybrid_search_bge(db, query, source, top_k, rrf_k)


def _hybrid_search_fedlex(
    db: Session, query: str, top_k: int, rrf_k: int
) -> list[ArticleChunk]:
    query_embedding = embedding.embed_text(query)
    fts_query = func.plainto_tsquery("simple", query)

    vector_cte = (
        select(
            ArticleChunk.id.label("emb_id"),
            func.row_number()
            .over(order_by=ArticleChunk.embedding.l2_distance(query_embedding))
            .label("rank"),
        )
        .where(ArticleChunk.embedding.isnot(None))
        .order_by(ArticleChunk.embedding.l2_distance(query_embedding))
        .limit(top_k * 2)
        .cte("fedlex_vector_ranks")
    )

    fts_cte = (
        select(
            ArticleChunk.id.label("emb_id"),
            func.row_number()
            .over(
                order_by=func.ts_rank(ArticleChunk.text_search_vector, fts_query).desc()
            )
            .label("rank"),
        )
        .where(ArticleChunk.text_search_vector.op("@@")(fts_query))
        .order_by(func.ts_rank(ArticleChunk.text_search_vector, fts_query).desc())
        .limit(top_k * 2)
        .cte("fedlex_fts_ranks")
    )

    combined = union_all(
        select(fts_cte.c.emb_id, fts_cte.c.rank),
        select(vector_cte.c.emb_id, vector_cte.c.rank),
    ).subquery()

    rrf_scores = (
        select(
            combined.c.emb_id,
            func.sum(1.0 / (rrf_k + combined.c.rank)).label("rrf_score"),
        )
        .group_by(combined.c.emb_id)
        .order_by(func.sum(1.0 / (rrf_k + combined.c.rank)).desc())
        .limit(top_k)
        .subquery()
    )

    return db.scalars(
        select(ArticleChunk)
        .join(rrf_scores, ArticleChunk.id == rrf_scores.c.emb_id)
        .options(selectinload(ArticleChunk.article).selectinload(Article.act))
        .order_by(rrf_scores.c.rrf_score.desc())
    ).all()


def _hybrid_search_bge(
    db: Session, query: str, source: str, top_k: int, rrf_k: int
) -> list[DocumentChunk]:
    query_embedding = embedding.embed_text(query)
    source_filter = Document.source == source
    fts_query = func.plainto_tsquery("simple", query)

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

    combined = union_all(
        select(fts_cte.c.chunk_id, fts_cte.c.rank, fts_cte.c.source),
        select(vector_cte.c.chunk_id, vector_cte.c.rank, vector_cte.c.source),
    ).subquery()

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

    return db.scalars(
        select(DocumentChunk)
        .join(rrf_scores, DocumentChunk.id == rrf_scores.c.chunk_id)
        .options(selectinload(DocumentChunk.document))
        .order_by(rrf_scores.c.rrf_score.desc())
    ).all()
