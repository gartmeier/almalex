"""Legal document search tools for LLM tool calling."""

import re

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Document, DocumentChunk
from app.schemas.search import DocumentChunkResult, SearchResults
from app.services import retrieval

SOURCE_MAPPING = {
    "federal_law": "fedlex_article",
    "federal_court": "bge",
}


def search_legal_documents(
    *,
    db: Session,
    query: str,
    sources: list[str],
    limit: int = 5,
) -> SearchResults:
    """Search Swiss legal database using hybrid vector + full-text search.

    Args:
        db: Database session
        query: Search query
        sources: Filter by source types (["federal_law", "federal_court"])
        limit: Max results to return

    Returns:
        SearchResults with document chunks and citation metadata
    """
    # Map friendly names to internal source identifiers
    internal_sources = [SOURCE_MAPPING.get(s, s) for s in sources]

    # Retrieve chunks from each source
    all_chunks = []
    for source in internal_sources:
        chunks = retrieval.retrieve(
            db=db,
            query=query,
            source=source,
            top_k=limit * 2,  # Get more for reranking
        )
        all_chunks.extend(chunks)

    # Always apply Cohere reranking
    reranked_chunks = retrieval.rerank(query, all_chunks, top_k=limit * 2)

    # Apply diversification only when searching multiple sources
    if len(sources) > 1:
        final_chunks = retrieval.diversify_chunks(reranked_chunks, top_k=limit)
    else:
        final_chunks = reranked_chunks[:limit]

    # Convert to result schema
    results = []
    for chunk in final_chunks:
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


def lookup_law_article(*, db: Session, article_reference: str) -> SearchResults:
    """Lookup specific law article by reference (e.g., 'Art. 334 OR').

    Args:
        db: Database session
        article_reference: Article reference like "Art. 334 OR" or "334 OR"

    Returns:
        SearchResults with matching article chunks
    """
    # Parse article reference
    # Patterns: "Art. 334 OR", "Art 334 OR", "334 OR", "Art. 334 Abs. 1 OR"
    pattern = r"(?:Art\.?\s*)?(\d+)(?:\s+Abs\.?\s+\d+)?\s+([A-Z]+)"
    match = re.search(pattern, article_reference, re.IGNORECASE)

    if not match:
        return SearchResults(results=[])

    article_num, law_abbr = match.groups()

    # Try exact metadata match first
    chunks = db.scalars(
        select(DocumentChunk)
        .join(DocumentChunk.document)
        .where(Document.source == "fedlex_article")
        .where(Document.metadata_["article_num"].astext == article_num)
        .where(Document.metadata_["law_abbr"].astext == law_abbr.upper())
        .options(selectinload(DocumentChunk.document))
        .order_by(DocumentChunk.order)
    ).all()

    # Fallback to title/text search if not found
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

    # Convert to result schema
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


def lookup_court_decision(*, db: Session, citation: str) -> SearchResults:
    """Lookup court decision by BGE citation (e.g., '146 V 240' or 'BGE 146 V 240').

    Args:
        db: Database session
        citation: BGE citation like "146 V 240" or "BGE 146 V 240"

    Returns:
        SearchResults with matching court decision chunks
    """
    # Parse BGE citation
    # Patterns: "146 V 240", "BGE 146 V 240", "91 I 374"
    # Format: {volume} {part (Roman numeral)} {page}
    pattern = r"(?:BGE\s+)?(\d+)\s+([IVX]+)\s+(\d+)"
    match = re.search(pattern, citation, re.IGNORECASE)

    if not match:
        return SearchResults(results=[])

    volume, part, page = match.groups()
    search_citation = f"BGE {volume} {part.upper()} {page}"

    # Try exact metadata match on Num field
    chunks = db.scalars(
        select(DocumentChunk)
        .join(DocumentChunk.document)
        .where(Document.source == "bge")
        .where(Document.metadata_["Num"].astext.contains(search_citation))
        .options(selectinload(DocumentChunk.document))
        .order_by(DocumentChunk.order)
        .limit(10)
    ).all()

    # Fallback to title/text search if not found
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

    # Convert to result schema
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
