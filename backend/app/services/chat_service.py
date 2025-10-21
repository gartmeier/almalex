import json

from app.ai.chat import generate_answer, generate_query
from app.ai.reranking import rerank_chunks
from app.core.types import Language
from app.crud.chat import create_assistant_message, get_chat
from app.crud.search import retrieve
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

        # Retrieve and rerank separately by source for diversity
        fedlex_chunks = retrieve(db=db, query=search_query, source="fedlex_article", top_k=100)
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
                search_results.append({
                    "id": chunk.document.id,
                    "title": chunk.document.title,
                    "url": chunk.document.url,
                })

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
