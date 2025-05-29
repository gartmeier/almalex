from typing import Sequence

from sqlalchemy import ScalarResult, select
from sqlalchemy.orm import Session, selectinload

from app.ai.service import create_embedding
from app.api import schemas
from app.db.models import Chat, ChatMessage, DocumentChunk


def create_chat(*, session: Session, chat_id: str, user_id: str) -> Chat:
    db_chat = Chat(id=chat_id, user_id=user_id)
    session.add(db_chat)
    session.commit()
    session.refresh(db_chat)
    return db_chat


def get_chat(*, session: Session, chat_id: str) -> Chat | None:
    return session.scalar(select(Chat).where(Chat.id == chat_id))


def get_user_chat(*, session: Session, chat_id: str, user_id: str) -> Chat | None:
    return session.scalar(
        select(Chat).where(Chat.id == chat_id, Chat.user_id == user_id)
    )


def get_user_chats(*, session: Session, user_id: str) -> Sequence[Chat]:
    return session.scalars(
        select(Chat).where(Chat.user_id == user_id).order_by(Chat.updated_at.desc())
    ).all()


# Message operations
def create_user_message(
    *, session: Session, message_in: schemas.MessageRequest, chat_id: str
) -> ChatMessage:
    db_message = ChatMessage(
        id=message_in.id,
        chat_id=chat_id,
        role="user",
        content=message_in.content,
    )
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message


def create_assistant_message(*, session: Session, chat_id: str) -> ChatMessage:
    db_message = ChatMessage(
        chat_id=chat_id,
        role="assistant",
        content="",
    )
    session.add(db_message)
    session.commit()
    session.refresh(db_message)
    return db_message


def search(
    *, session: Session, query: str, top_k: int = 10
) -> ScalarResult[DocumentChunk]:
    embedding = create_embedding(query)
    return session.scalars(
        select(DocumentChunk)
        .order_by(DocumentChunk.embedding.l2_distance(embedding))
        .limit(top_k)
    )


def get_similar_chunks(
    *, session: Session, query_embedding: list[float], top_k: int = 10
) -> Sequence[DocumentChunk]:
    return session.scalars(
        select(DocumentChunk)
        .options(selectinload(DocumentChunk.document))
        .order_by(DocumentChunk.embedding.l2_distance(query_embedding))
        .limit(top_k)
    ).all()
