from fastapi import APIRouter, Query

from app.core.deps import SessionDep
from app.schemas.search import DocumentChunkResult, SearchResults
from app.services import search as search_service

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=SearchResults)
def search(
    db: SessionDep,
    q: str = Query(..., description="Search query"),
    source: str = Query("federal_law", description='"federal_law" or "federal_court"'),
    limit: int = Query(10, ge=1, le=50),
):
    chunks = search_service.search(db=db, query=q, source=source, limit=limit)
    return [
        DocumentChunkResult(
            id=chunk.id,
            source="fedlex_article"
            if hasattr(chunk, "article")
            else chunk.document.source,
            title=chunk.article.breadcrumb
            if hasattr(chunk, "article")
            else chunk.document.title,
            text=chunk.text,
            url=chunk.article.act.html_url
            if hasattr(chunk, "article")
            else chunk.document.url,
        )
        for chunk in chunks
    ]
