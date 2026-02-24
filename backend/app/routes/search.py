from fastapi import APIRouter, Query

from app.core.deps import SessionDep
from app.schemas.search import DocumentChunkResult, SearchResults
from app.services.search import search_articles

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=SearchResults)
def search(
    db: SessionDep,
    q: str = Query(..., description="Search query"),
    limit: int = Query(10, ge=1, le=50),
):
    articles = search_articles(db=db, query=q, top_k=limit)
    return [
        DocumentChunkResult(
            id=article.id,
            source="fedlex_article",
            title=article.breadcrumb or article.eid,
            text=article.text,
            url=article.act.html_url,
        )
        for article in articles
    ]
