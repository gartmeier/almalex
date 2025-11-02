"""Legal document search tools for LLM tool calling."""

from openai.types.responses import FunctionToolParam
from sqlalchemy.orm import Session

from app.db.models import DocumentChunk
from app.schemas.search import DocumentChunkResult, SearchResults
from app.services import search as search_service

SEARCH_TOOLS = [
    FunctionToolParam(
        type="function",
        name="search_legal_documents",
        description="Search Swiss legal database using semantic search. Returns document chunks with citation metadata. Call multiple times to search different sources.",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Natural language search query (e.g., 'Wertrechte Register Eintragung', 'Bucheffekten Entstehung')",
                },
                "source": {
                    "type": "string",
                    "enum": ["federal_law", "federal_court"],
                    "description": "Source type to search. Use 'federal_law' for laws or 'federal_court' for court decisions.",
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of results to return",
                },
            },
            "required": ["query", "source", "limit"],
            "additionalProperties": False,
        },
    ),
    FunctionToolParam(
        type="function",
        name="lookup_law_article",
        description="Lookup specific law article by reference (e.g., 'Art. 334 OR', 'Art. 8 ZGB'). Use when a law or court decision mentions another article.",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "article_reference": {
                    "type": "string",
                    "description": "Article reference like 'Art. 334 OR', 'Art. 8 ZGB', or '334 OR'",
                }
            },
            "required": ["article_reference"],
            "additionalProperties": False,
        },
    ),
    FunctionToolParam(
        type="function",
        name="lookup_court_decision",
        description="Lookup court decision by BGE citation (e.g., '146 V 240', 'BGE 91 I 374'). Use when a court decision or law mentions another court decision.",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "citation": {
                    "type": "string",
                    "description": "BGE citation like '146 V 240' or 'BGE 146 V 240'. Format: volume part page (e.g., '91 I 374')",
                }
            },
            "required": ["citation"],
            "additionalProperties": False,
        },
    ),
]


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
