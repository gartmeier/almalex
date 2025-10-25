from openai import OpenAI
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import Chat
from app.services import llm

client = OpenAI(api_key=settings.openai_api_key)


def create_chat(*, db: Session, chat_id: str) -> Chat:
    """Create chat and OpenAI conversation."""
    conversation = client.conversations.create()

    chat = Chat(id=chat_id, openai_conversation_id=conversation.id)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def get_chat(*, db: Session, chat_id: str):
    """Get chat and conversation items from OpenAI."""
    chat = db.scalar(select(Chat).where(Chat.id == chat_id))
    if not chat:
        return None

    # Fetch conversation items from OpenAI
    items = client.conversations.items.list(chat.openai_conversation_id)

    return {
        "id": chat.id,
        "title": chat.title,
        "items": list(items),
    }


def process_message(*, db: Session, chat_id: str, message: str):
    """Process message with OpenAI conversation."""
    chat = db.scalar(select(Chat).where(Chat.id == chat_id))
    if not chat:
        chat = create_chat(db=db, chat_id=chat_id)

    # Stream raw OpenAI events
    for event in llm.generate_with_tools(
        db=db,
        conversation_id=chat.openai_conversation_id,
        message=message,
    ):
        yield f"data: {event.model_dump_json()}\n\n"
