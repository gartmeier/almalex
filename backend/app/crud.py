from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.ai.service import create_embedding
from app.db.models import Chat, ChatMessage, Document, DocumentChunk
from app.utils.helpers import nanoid


def get_chat(*, db: Session, chat_id: str) -> Chat | None:
    return db.scalar(
        select(Chat).where(Chat.id == chat_id).options(selectinload(Chat.messages))
    )


def create_chat(*, db: Session, chat_id: str, message: str) -> tuple[Chat, ChatMessage]:
    # Create chat
    db_chat = Chat(id=chat_id)
    db.add(db_chat)
    db.flush()  # Get the chat ID without committing

    # Create the initial user message
    db_message = ChatMessage(
        id=nanoid(),
        chat_id=chat_id,
        role="user",
        content=message,
        content_blocks=[{"type": "text", "text": message}],
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_chat)
    return db_chat, db_message


# Message operations
def create_user_message(
    *, db: Session, message_content: str, chat_id: str
) -> ChatMessage:
    from app.utils.helpers import nanoid

    db_message = ChatMessage(
        id=nanoid(),
        chat_id=chat_id,
        role="user",
        content=message_content,
        content_blocks=[{"type": "text", "text": message_content}],
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def create_assistant_message(*, db: Session, chat_id: str) -> ChatMessage:
    db_message = ChatMessage(
        chat_id=chat_id,
        role="assistant",
        content="",
        content_blocks=[],
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def search(*, db: Session, query: str, top_k: int = 10):
    embedding = create_embedding(query)
    return db.scalars(
        select(DocumentChunk)
        .order_by(DocumentChunk.embedding.l2_distance(embedding))
        .limit(top_k)
    )


def search_similar(
    *, db: Session, embedding: list[float], top_k: int = 10
) -> tuple[list[DocumentChunk], list[Document]]:
    """Return document chunks and unique documents from similarity search."""
    result = db.execute(
        select(
            DocumentChunk,
            DocumentChunk.embedding.l2_distance(embedding).label("distance"),
        )
        .options(selectinload(DocumentChunk.document))
        .order_by(DocumentChunk.embedding.l2_distance(embedding))
        .limit(top_k)
    ).all()

    chunks = [chunk for chunk, _ in result]

    # Extract unique documents in order of first appearance
    seen_docs = set()
    documents = []
    for chunk in chunks:
        doc_id = chunk.document.id
        if doc_id not in seen_docs:
            seen_docs.add(doc_id)
            documents.append(chunk.document)

    return chunks, documents


def get_document(db: Session, document_id: int):
    return db.scalar(select(Document).where(Document.id == document_id))


def hybrid_search(
    *, db: Session, query: str, top_k: int = 10, rrf_k: int = 60
) -> tuple[list[DocumentChunk], list[Document]]:
    """Hybrid search combining full-text and vector similarity using RRF.

    Args:
        db: Database session
        query: Search query string
        top_k: Number of results to return
        rrf_k: RRF constant (default 60, standard value)

    Returns:
        Tuple of (chunks, unique_documents) ordered by combined RRF score
    """
    embedding = create_embedding(query)

    # Full-text search using simple config
    fts_query = func.plainto_tsquery("simple", query)

    # Subquery: compute ts_rank once
    fts_subquery = (
        select(
            DocumentChunk.id,
            func.ts_rank(DocumentChunk.text_search_vector, fts_query).label("score"),
        )
        .where(DocumentChunk.text_search_vector.op("@@")(fts_query))
        .subquery()
    )

    # Outer query: use computed score for window function and ORDER BY
    fts_results = db.execute(
        select(
            fts_subquery.c.id,
            func.row_number().over(order_by=fts_subquery.c.score.desc()).label("rank"),
        )
        .order_by(fts_subquery.c.score.desc())
        .limit(top_k * 2)  # Fetch more for better fusion
    ).all()

    # Vector similarity search
    # Subquery: compute l2_distance once
    vector_subquery = (
        select(
            DocumentChunk.id,
            DocumentChunk.embedding.l2_distance(embedding).label("distance"),
        )
        .where(DocumentChunk.embedding.isnot(None))
        .subquery()
    )

    # Outer query: use computed distance for window function and ORDER BY
    vector_results = db.execute(
        select(
            vector_subquery.c.id,
            func.row_number().over(order_by=vector_subquery.c.distance).label("rank"),
        )
        .order_by(vector_subquery.c.distance)
        .limit(top_k * 2)  # Fetch more for better fusion
    ).all()

    # Calculate RRF scores
    rrf_scores = {}
    for chunk_id, rank in fts_results:
        rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0) + 1 / (rrf_k + rank)
    for chunk_id, rank in vector_results:
        rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0) + 1 / (rrf_k + rank)

    # Sort by RRF score and get top_k chunk IDs
    top_chunk_ids = sorted(
        rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True
    )[:top_k]

    if not top_chunk_ids:
        return [], []

    # Fetch full chunk objects with documents
    chunks = db.scalars(
        select(DocumentChunk)
        .where(DocumentChunk.id.in_(top_chunk_ids))
        .options(selectinload(DocumentChunk.document))
    ).all()

    # Preserve RRF order
    chunks_dict = {chunk.id: chunk for chunk in chunks}
    ordered_chunks = [
        chunks_dict[chunk_id] for chunk_id in top_chunk_ids if chunk_id in chunks_dict
    ]

    # Extract unique documents in order
    seen_docs = set()
    documents = []
    for chunk in ordered_chunks:
        doc_id = chunk.document.id
        if doc_id not in seen_docs:
            seen_docs.add(doc_id)
            documents.append(chunk.document)

    return ordered_chunks, documents
