from sqlalchemy import desc, select
from sqlalchemy.orm import Session, selectinload

from app.core.types import Language
from app.db.models import Chat, ChatMessage, DocumentChunk
from app.services import chat as chat_service
from app.services import llm
from app.services import search as search_service

_SOURCE_LABELS = {"fedlex_article": "federal_law", "bge": "federal_court"}


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


def _format_context(chunks: list[DocumentChunk]) -> str:
    parts = []
    for i, chunk in enumerate(chunks, 1):
        source = _SOURCE_LABELS.get(chunk.document.source, chunk.document.source)
        parts.append(
            f"[{i}] {source} | {chunk.document.title} (ID: {chunk.document.id})\n{chunk.text}"
        )
    return "\n\n".join(parts)


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

    law_chunks = search_service.search(
        db=db, query=message, source="federal_law", limit=5
    )
    court_chunks = search_service.search(
        db=db, query=message, source="federal_court", limit=5
    )
    context = _format_context(law_chunks + court_chunks)

    for event in llm.generate(history=history, context=context, lang=lang):
        if event.type == "done":
            assistant_msg = ChatMessage(
                chat_id=chat_id,
                role="assistant",
                content=event.content,
                content_blocks=[block.model_dump() for block in event.content_blocks],
            )
            db.add(assistant_msg)
            db.commit()
        else:
            yield f"data: {event.model_dump_json()}\n\n"
