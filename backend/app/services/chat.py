from sqlalchemy import desc, select
from sqlalchemy.orm import Session, selectinload

from app.db.models import Article, Chat, ChatMessage
from app.services import llm
from app.services.search import search_articles

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

    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.chat_id == chat_id)
        .order_by(desc(ChatMessage.created_at))
        .limit(10)
        .all()
    )
    history = list(reversed(history))

    articles = search_articles(db, message, top_k=5)
    context = _format_context(articles)

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


def _format_context(articles: list[Article]) -> str:
    parts = []
    for article in articles:
        parts.append(f"[ID:article_{article.id}] {article.act.label}\n{article.text}")
    return "\n\n".join(parts)
