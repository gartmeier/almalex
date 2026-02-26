from sqlalchemy import func, select, union_all
from sqlalchemy.orm import Session, selectinload

from app.db.models import Article, Chunk
from app.services import embedding


def search_chunks(
    db: Session,
    query: str,
    *,
    source_type: str = None,
    top_k: int = 20,
    rrf_k: int = 60,
) -> list[Chunk]:
    query_embedding = embedding.embed_text(query)
    vector_distance = Chunk.embedding.l2_distance(query_embedding)

    vector_q = (
        select(
            Chunk.id.label("chunk_id"),
            func.row_number().over(order_by=vector_distance).label("rank"),
        )
        .where(Chunk.embedding.isnot(None))
        .order_by(vector_distance)
        .limit(top_k * 2)
    )

    if source_type:
        vector_q = vector_q.where(Chunk.source_type == source_type)

    vector_cte = vector_q.cte("fedlex_vector_ranks")

    fts_query = func.plainto_tsquery("simple", query)
    text_rank = func.ts_rank(Chunk.search_vector, fts_query).desc()

    fts_q = (
        select(
            Chunk.id.label("chunk_id"),
            func.row_number().over(order_by=text_rank).label("rank"),
        )
        .where(Chunk.search_vector.op("@@")(fts_query))
        .order_by(text_rank)
        .limit(top_k * 2)
    )

    if source_type:
        fts_q = fts_q.where(Chunk.source_type == source_type)

    fts_cte = fts_q.cte("fedlex_fts_ranks")

    combined = union_all(
        select(fts_cte.c.chunk_id, fts_cte.c.rank),
        select(vector_cte.c.chunk_id, vector_cte.c.rank),
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

    return list(
        db.scalars(
            select(Chunk)
            .join(rrf_scores, Chunk.id == rrf_scores.c.chunk_id)
            .options(
                selectinload(Chunk.article).selectinload(Article.act),
                selectinload(Chunk.decision),
            )
            .order_by(rrf_scores.c.rrf_score.desc())
        ).all()
    )
