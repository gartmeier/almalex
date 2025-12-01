"""Legal document search tools for LLM tool calling."""

from openai.types.responses import FunctionToolParam
from sqlalchemy.orm import Session

from app.db.models import DocumentChunk
from app.services import search as search_service

SEARCH_TOOLS = [
    FunctionToolParam(
        type="function",
        name="legal_search",
        description="Search Swiss legal database using semantic search. Use short queries (3-5 keywords).",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Short search query (3-5 keywords), e.g. 'Pflichtteil Erbrecht'",
                },
                "source": {
                    "type": "string",
                    "enum": ["federal_law", "federal_court"],
                    "description": "Source type: 'federal_law' for laws, 'federal_court' for court decisions.",
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of results",
                },
            },
            "required": ["query", "source", "limit"],
            "additionalProperties": False,
        },
    ),
    FunctionToolParam(
        type="function",
        name="article_lookup",
        description="Lookup specific law article by reference.",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "reference": {
                    "type": "string",
                    "description": "Article reference like 'Art. 334 OR', 'Art. 8 ZGB'",
                }
            },
            "required": ["reference"],
            "additionalProperties": False,
        },
    ),
    FunctionToolParam(
        type="function",
        name="decision_lookup",
        description="Lookup court decision by BGE citation.",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "reference": {
                    "type": "string",
                    "description": "BGE citation like '146 V 240', 'BGE 91 I 374'",
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
    limit: int = 5,
) -> list[dict]:
    """Search Swiss legal database."""
    chunks = search_service.search(db=db, query=query, source=source, limit=limit)
    return [_chunk_to_dict(chunk) for chunk in chunks]


def article_lookup(*, db: Session, reference: str) -> list[dict]:
    """Lookup law article by reference."""
    chunks = search_service.lookup_article(db=db, article_reference=reference)
    return [_chunk_to_dict(chunk) for chunk in chunks]


def decision_lookup(*, db: Session, reference: str) -> list[dict]:
    """Lookup court decision by BGE citation."""
    chunks = search_service.lookup_decision(db=db, citation=reference)
    return [_chunk_to_dict(chunk) for chunk in chunks]


def _chunk_to_dict(chunk: DocumentChunk) -> dict:
    """Convert DocumentChunk to dict for tool results."""
    return {
        "id": chunk.id,
        "source": chunk.document.source,
        "title": chunk.document.title,
        "text": chunk.text,
        "url": chunk.document.url or "",
    }
