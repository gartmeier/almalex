from sqlalchemy import desc, select
from sqlalchemy.orm import Session, selectinload

from app.core.types import Language
from app.db.models import Chat, ChatMessage
from app.services import chat as chat_service
from app.services import llm


# Database operations
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


def get_or_create_chat(*, db: Session, chat_id: str) -> Chat:
    chat = db.scalar(select(Chat).where(Chat.id == chat_id))
    if chat is None:
        chat = create_chat(db=db, chat_id=chat_id)
    return chat


def create_user_message(*, db: Session, chat_id: str, content: str) -> ChatMessage:
    db_message = ChatMessage(
        chat_id=chat_id,
        role="user",
        content=content,
        content_blocks=[{"type": "text", "text": content}],
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def process_message(*, db: Session, chat_id: str, message: str, lang: Language):
    chat_service.get_or_create_chat(db=db, chat_id=chat_id)

    user_msg = ChatMessage(
        chat_id=chat_id,
        role="user",
        content=message,
        content_blocks=[{"type": "text", "text": message}],
    )
    db.add(user_msg)
    db.commit()

    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.chat_id == chat_id)
        .order_by(desc(ChatMessage.created_at))
        .limit(10)
        .all()
    )

    history = list(reversed(history))

    complete_text = ""
    output_items = []

    for event in llm.generate_with_tools(db=db, history=history, effort="low"):
        if event.type == "text":
            complete_text += event.delta
        elif event.type == "done":
            output_items = event.output_items

        yield f"data: {event.model_dump_json()}\n\n"

    assistant_msg = ChatMessage(
        chat_id=chat_id,
        role="assistant",
        content=complete_text,
        content_blocks=output_items,
    )
    db.add(assistant_msg)
    db.commit()
