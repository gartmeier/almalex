import json

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.types import Language
from app.db.models import Chat, ChatMessage
from app.db.session import SessionLocal
from app.schemas.chat import MessageCreate
from app.services import llm, retrieval


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


# Service operations
def stream_completion(chat_id: str, lang: Language = "de"):
    with SessionLocal() as db:
        chat = get_chat(db=db, chat_id=chat_id)
        if chat is None:
            raise ValueError(f"Chat not found: {chat_id}")

        existing_messages = list(chat.messages)

        assistant_message = create_assistant_message(db=db, chat_id=chat.id)
        yield format_event("message_id", assistant_message.id)

        search_query = llm.generate_search_query(existing_messages)
        yield format_event("search_query", search_query)

        # Retrieve and rerank separately by source for diversity
        fedlex_chunks = retrieval.retrieve(
            db=db, query=search_query, source="fedlex_article", top_k=100
        )
        fedlex_chunks = retrieval.rerank(search_query, fedlex_chunks, top_k=12)

        bge_chunks = retrieval.retrieve(
            db=db, query=search_query, source="bge", top_k=100
        )
        bge_chunks = retrieval.rerank(search_query, bge_chunks, top_k=8)

        # Combine: 60% laws, 40% court decisions (total 20)
        chunks = fedlex_chunks + bge_chunks

        # Extract unique documents for display
        seen_doc_ids = set()
        search_results = []
        for chunk in chunks:
            if chunk.document.id not in seen_doc_ids:
                seen_doc_ids.add(chunk.document.id)
                search_results.append(
                    {
                        "id": chunk.document.id,
                        "title": chunk.document.title,
                        "url": chunk.document.url,
                    }
                )

        yield format_event("search_results", search_results)

        response_stream = llm.generate_answer(
            messages=existing_messages, search_results=chunks, lang=lang
        )
        complete_text = ""

        for text_delta in response_stream:
            complete_text += text_delta
            yield format_event("message_delta", text_delta)

        assistant_message.content = complete_text
        assistant_message.content_blocks = [
            {
                "type": "search",
                "status": "completed",
                "query": search_query,
                "results": search_results,
            },
            {"type": "text", "text": complete_text},
        ]

        db.commit()


def format_event(event_type: str, data: str | dict | list[dict]):
    return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"
