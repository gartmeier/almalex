import json
from typing import Sequence

from openai import OpenAI
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.core.types import Language
from app.db.models import Chat, ChatMessage, DocumentChunk
from app.db.session import SessionLocal
from app.prompts import render
from app.schemas.chat import MessageCreate
from app.services.retrieval import rerank_chunks, retrieve
from app.utils.formatters import format_chunks

openai_client = OpenAI(api_key=settings.openai_api_key)


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


# LLM operations
def generate_title(user_message: str) -> str:
    prompt = render("title.md", user_message=user_message)

    response = openai_client.responses.create(
        model=settings.openai_title_model,
        input=prompt,
    )
    return clean_title(response.output_text)


def clean_title(title: str) -> str:
    return title.replace('"', "").replace("'", "")


def generate_answer(
    *,
    messages: list[ChatMessage],
    search_results: Sequence[DocumentChunk],
    lang: Language = "de",
):
    question = messages[-1].content
    context = format_chunks(search_results)

    # Map language code to template file
    template_map = {
        "de": "response_de.md",
        "fr": "response_fr.md",
        "en": "response_en.md",
    }
    template = template_map[lang]

    prompt = render(
        template,
        question=question,
        context=context,
    )

    openai_messages: list = [
        {"role": "system", "content": "You are a helpful AI assistant"},
        *[{"role": m.role, "content": m.content} for m in messages[:-1]],
        {"role": "user", "content": prompt},
    ]

    stream = openai_client.responses.create(
        input=openai_messages,
        model=settings.openai_response_model,
        stream=True,
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            yield event.delta


def generate_query(messages: list[ChatMessage]):
    prompt = render("query.md", messages=messages)

    response = openai_client.responses.create(
        input=prompt,
        model=settings.openai_query_model,
    )
    return response.output_text


def generate_text(messages: list[dict]):
    """Generate text from chat messages (used by CLI)."""
    stream = openai_client.responses.create(
        input=messages,
        model=settings.openai_response_model,
        stream=True,
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            yield event.delta


# Service operations
def stream_completion(chat_id: str, lang: Language = "de"):
    with SessionLocal() as db:
        chat = get_chat(db=db, chat_id=chat_id)
        if chat is None:
            raise ValueError(f"Chat not found: {chat_id}")

        existing_messages = list(chat.messages)

        assistant_message = create_assistant_message(db=db, chat_id=chat.id)
        yield format_event("message_id", assistant_message.id)

        search_query = generate_query(existing_messages)
        yield format_event("search_query", search_query)

        # Retrieve and rerank separately by source for diversity
        fedlex_chunks = retrieve(
            db=db, query=search_query, source="fedlex_article", top_k=100
        )
        fedlex_chunks = rerank_chunks(search_query, fedlex_chunks, top_k=12)

        bge_chunks = retrieve(db=db, query=search_query, source="bge", top_k=100)
        bge_chunks = rerank_chunks(search_query, bge_chunks, top_k=8)

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

        response_stream = generate_answer(
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
