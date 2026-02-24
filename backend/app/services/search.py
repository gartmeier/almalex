from sqlalchemy import func, select, union_all
from sqlalchemy.orm import Session, selectinload

from app.db.models import Article, Chunk
from app.services import embedding


def search_articles(
    db: Session, query: str, *, top_k: int = 20, rrf_k: int = 60
) -> list[Article]:
    query_embedding = embedding.embed_text(query)
    vector_distance = Chunk.embedding.l2_distance(query_embedding)

    vector_cte = (
        select(
            Chunk.article_id.label("article_id"),
            func.row_number().over(order_by=vector_distance).label("rank"),
        )
        .where(Chunk.embedding.isnot(None), Chunk.source_type == "article")
        .order_by(vector_distance)
        .limit(top_k * 2)
        .cte("fedlex_vector_ranks")
    )

    fts_query = func.plainto_tsquery("simple", query)
    text_rank = func.ts_rank(Chunk.search_vector, fts_query).desc()

    fts_cte = (
        select(
            Chunk.article_id.label("article_id"),
            func.row_number().over(order_by=text_rank).label("rank"),
        )
        .where(Chunk.search_vector.op("@@")(fts_query), Chunk.source_type == "article")
        .order_by(text_rank)
        .limit(top_k * 2)
        .cte("fedlex_fts_ranks")
    )

    combined = union_all(
        select(fts_cte.c.article_id, fts_cte.c.rank),
        select(vector_cte.c.article_id, vector_cte.c.rank),
    ).subquery()

    rrf_scores = (
        select(
            combined.c.article_id,
            func.sum(1.0 / (rrf_k + combined.c.rank)).label("rrf_score"),
        )
        .group_by(combined.c.article_id)
        .order_by(func.sum(1.0 / (rrf_k + combined.c.rank)).desc())
        .limit(top_k)
        .subquery()
    )

    return list(
        db.scalars(
            select(Article)
            .join(rrf_scores, Article.id == rrf_scores.c.article_id)
            .options(selectinload(Article.act))
            .order_by(rrf_scores.c.rrf_score.desc())
        ).all()
    )
