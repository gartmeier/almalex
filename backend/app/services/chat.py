from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Chat, ChatMessage, Chunk
from app.services import llm
from app.services.search import search_chunks

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


def process_message(*, db: Session, chat_id: str, message: str, lang: str):
    get_or_create_chat(db=db, chat_id=chat_id)

    user_msg = ChatMessage(
        chat_id=chat_id,
        role="user",
        content=message,
        content_blocks=[{"type": "text", "text": message}],
    )
    db.add(user_msg)
    db.commit()

    history = db.scalars(
        select(ChatMessage)
        .where(ChatMessage.chat_id == chat_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(10)
    ).all()
    history = list(reversed(history))

    article_chunks = search_chunks(db, message, source_type="article", top_k=12)
    decision_chunks = search_chunks(db, message, source_type="decision", top_k=8)
    all_chunks = article_chunks + decision_chunks

    context = _format_context(all_chunks)

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


def _format_context(chunks: list[Chunk]) -> str:
    parts = []
    for chunk in chunks:
        parts.append(f"ID: {chunk.id}\n\n{chunk.text}")
    return "\n---\n".join(parts)
