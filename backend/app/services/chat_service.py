import json

from app.ai.service import create_embedding, generate_answer, generate_query
from app.core.types import Language
from app.crud.chat import create_assistant_message, get_chat
from app.crud.search import search_similar
from app.db.session import SessionLocal


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

        query_embedding = create_embedding(search_query)
        document_chunks, documents = search_similar(db=db, embedding=query_embedding)

        search_results = [
            {"id": doc.id, "title": doc.title, "url": doc.url} for doc in documents
        ]
        yield format_event("search_results", search_results)

        response_stream = generate_answer(
            messages=existing_messages, search_results=document_chunks, lang=lang
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
