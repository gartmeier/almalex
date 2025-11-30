"""Legal document search tools for LLM tool calling."""

from openai.types.responses import FunctionToolParam
from sqlalchemy.orm import Session

from app.db.models import DocumentChunk
from app.services import search as search_service

SEARCH_TOOLS = [
    FunctionToolParam(
        type="function",
        name="legal_search",
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
        name="article_lookup",
        description="Lookup specific law article by reference (e.g., 'Art. 334 OR', 'Art. 8 ZGB'). Use when a law or court decision mentions another article.",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "reference": {
                    "type": "string",
                    "description": "Article reference like 'Art. 334 OR', 'Art. 8 ZGB', or '334 OR'",
                }
            },
            "required": ["reference"],
            "additionalProperties": False,
        },
    ),
    FunctionToolParam(
        type="function",
        name="decision_lookup",
        description="Lookup court decision by BGE citation (e.g., '146 V 240', 'BGE 91 I 374'). Use when a court decision or law mentions another court decision.",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "reference": {
                    "type": "string",
                    "description": "BGE citation like '146 V 240' or 'BGE 146 V 240'. Format: volume part page (e.g., '91 I 374')",
                }
            },
            "required": ["reference"],
            "additionalProperties": False,
        },
    ),
]


def legal_search(
    *,
    db: Session,
    query: str,
    source: str,
    limit: int = 20,
) -> list[dict]:
    """Search Swiss legal database using hybrid vector + full-text search.

    Args:
        db: Database session
        query: Search query
        source: Source type ("federal_law" or "federal_court")
        limit: Max results to return

    Returns:
        List of document chunk dicts
    """
    chunks = search_service.search(db=db, query=query, source=source, limit=limit)
    return _chunks_to_dicts(chunks)


def article_lookup(*, db: Session, reference: str) -> list[dict]:
    """Lookup specific law article by reference (e.g., 'Art. 334 OR')."""
    chunks = search_service.lookup_article(db=db, article_reference=reference)
    return _chunks_to_dicts(chunks)


def decision_lookup(*, db: Session, reference: str) -> list[dict]:
    """Lookup court decision by BGE citation (e.g., '146 V 240' or 'BGE 146 V 240')."""
    chunks = search_service.lookup_decision(db=db, citation=reference)
    return _chunks_to_dicts(chunks)


def _chunks_to_dicts(chunks: list[DocumentChunk]) -> list[dict]:
    """Convert DocumentChunk list to dict list for tool results.

    Args:
        chunks: Document chunks to convert

    Returns:
        List of chunk dicts with id, source, title, text, url
    """
    return [
        {
            "id": chunk.id,
            "source": chunk.document.source,
            "title": chunk.document.title,
            "text": chunk.text,
            "url": chunk.document.url or "",
        }
        for chunk in chunks
    ]
