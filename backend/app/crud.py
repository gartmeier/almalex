from sqlalchemy import select
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
