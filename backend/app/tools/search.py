"""Legal document search tools for LLM tool calling."""

from sqlalchemy.orm import Session

from app.db.models import DocumentChunk
from app.schemas.search import DocumentChunkResult, SearchResults
from app.services import search as search_service


def search_legal_documents(
    *,
    db: Session,
    query: str,
    source: str,
    limit: int = 20,
) -> SearchResults:
    """Search Swiss legal database using hybrid vector + full-text search.

    Args:
        db: Database session
        query: Search query
        source: Source type ("federal_law" or "federal_court")
        limit: Max results to return

    Returns:
        SearchResults with document chunks and citation metadata
    """
    chunks = search_service.search(db=db, query=query, source=source, limit=limit)
    return _to_search_results(chunks)


def lookup_law_article(*, db: Session, article_reference: str) -> SearchResults:
    """Lookup specific law article by reference (e.g., 'Art. 334 OR').

    Args:
        db: Database session
        article_reference: Article reference like "Art. 334 OR" or "334 OR"

    Returns:
        SearchResults with matching article chunks
    """
    chunks = search_service.lookup_article(db=db, article_reference=article_reference)
    return _to_search_results(chunks)


def lookup_court_decision(*, db: Session, citation: str) -> SearchResults:
    """Lookup court decision by BGE citation (e.g., '146 V 240' or 'BGE 146 V 240').

    Args:
        db: Database session
        citation: BGE citation like "146 V 240" or "BGE 146 V 240"

    Returns:
        SearchResults with matching court decision chunks
    """
    chunks = search_service.lookup_decision(db=db, citation=citation)
    return _to_search_results(chunks)


def _to_search_results(chunks: list[DocumentChunk]) -> SearchResults:
    """Convert DocumentChunk list to SearchResults schema.

    Args:
        chunks: Document chunks to convert

    Returns:
        SearchResults with formatted chunk data
    """
    results = []
    for chunk in chunks:
        doc = chunk.document
        result = DocumentChunkResult(
            id=chunk.id,
            source=doc.source,
            title=doc.title,
            text=chunk.text,
            url=doc.url or "",
        )
        results.append(result)
    return SearchResults(results=results)
