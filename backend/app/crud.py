from typing import Sequence

from sqlalchemy import ScalarResult, delete, select, update
from sqlalchemy.orm import Session, selectinload

from app.ai.service import create_embedding
from app.api import schemas
from app.db.models import Chat, ChatMessage, Document, DocumentChunk


def get_chat(*, db: Session, chat_id: str) -> Chat | None:
    return db.scalar(select(Chat).where(Chat.id == chat_id))


def create_user_chat(*, db: Session, chat_id: str, user_id: str) -> Chat:
    db_chat = Chat(id=chat_id, user_id=user_id)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat


def get_user_chat(*, db: Session, chat_id: str, user_id: str) -> Chat | None:
    return db.scalar(select(Chat).where(Chat.id == chat_id, Chat.user_id == user_id))


def get_user_chats(*, db: Session, user_id: str) -> Sequence[Chat]:
    return db.scalars(
        select(Chat).where(Chat.user_id == user_id).order_by(Chat.updated_at.desc())
    ).all()


def update_user_chat(
    *, db: Session, chat_id: str, user_id: str, chat_update: schemas.ChatUpdate
) -> bool:
    result = db.execute(
        update(Chat)
        .where(Chat.id == chat_id, Chat.user_id == user_id)
        .values(title=chat_update.title)
    )
    db.commit()
    return result.rowcount == 1


def delete_user_chat(*, db: Session, chat_id: str, user_id: str) -> bool:
    result = db.execute(delete(Chat).where(Chat.id == chat_id, Chat.user_id == user_id))
    db.commit()
    return result.rowcount == 1


# Message operations
def create_user_message(
    *, db: Session, message_in: schemas.MessageCreate, chat_id: str
) -> ChatMessage:
    db_message = ChatMessage(
        id=message_in.id,
        chat_id=chat_id,
        role="user",
        content=message_in.content,
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
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def search(*, db: Session, query: str, top_k: int = 10) -> ScalarResult[DocumentChunk]:
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
