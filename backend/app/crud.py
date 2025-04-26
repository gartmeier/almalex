from sqlalchemy.orm import Session

from app.api import schemas
from app.db.models import Chat, ChatMessage


def create_chat(*, session: Session, chat_id: str, user_id: str) -> Chat:
    db_chat = Chat(id=chat_id, user_id=user_id)
    session.add(db_chat)
    session.commit()
    session.refresh(db_chat)
    return db_chat


def create_message(
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
