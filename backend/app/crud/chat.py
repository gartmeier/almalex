from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.schemas.chat import MessageCreate
from app.db.models import Chat, ChatMessage


def get_chat(*, db: Session, chat_id: str) -> Chat | None:
    return db.scalar(
        select(Chat).where(Chat.id == chat_id).options(selectinload(Chat.messages))
    )


def create_chat(*, db: Session, chat_id: str) -> Chat:
    db_chat = Chat(id=chat_id)
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat


def create_user_message(*, db: Session, message_in: MessageCreate) -> ChatMessage:
    db_message = ChatMessage(
        chat_id=message_in.chat_id,
        role="user",
        content=message_in.content,
        content_blocks=[{"type": "text", "text": message_in.content}],
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
