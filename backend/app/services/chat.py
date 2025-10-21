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


def stream_completion_with_tools(chat_id: str, lang: Language = "de"):
    """Stream chat completion using AI-driven tool calling.

    The AI autonomously decides:
    - Which sources to search (federal laws, court decisions, or both)
    - What search queries to use
    - How many results to retrieve

    Events streamed:
    - message_id: Assistant message ID
    - tool_call: Tool being executed
    - tool_result: Tool execution result
    - message_delta: Response text chunks
    """
    from app.ai.chat import generate_with_tools
    from app.ai.formatters import format_chunks
    from app.services.tools import TOOL_DEFINITIONS, execute_tool, format_tool_result

    with SessionLocal() as db:
        chat = get_chat(db=db, chat_id=chat_id)
        if chat is None:
            raise ValueError(f"Chat not found: {chat_id}")

        existing_messages = list(chat.messages)

        assistant_message = create_assistant_message(db=db, chat_id=chat.id)
        yield format_event("message_id", assistant_message.id)

        # Phase 1: Let AI decide which tools to use
        tool_results_for_ai = []
        tool_calls_metadata = []

        for event in generate_with_tools(
            messages=existing_messages, tools=TOOL_DEFINITIONS, lang=lang
        ):
            if event["type"] == "tool_call":
                # AI requested a tool call
                tool_id = event["id"]
                tool_name = event["name"]
                arguments = json.loads(event["arguments"])

                # Yield tool call event
                yield format_event(
                    "tool_call",
                    {"name": tool_name, "arguments": arguments},
                )

                # Execute tool
                chunks = execute_tool(tool_name, arguments, db)

                # Format and yield result
                result_formatted = format_tool_result(chunks)
                yield format_event(
                    "tool_result",
                    {"name": tool_name, "result": result_formatted},
                )

                # Prepare for Phase 2: AI needs formatted chunks as context
                tool_results_for_ai.append(
                    {
                        "id": tool_id,
                        "name": tool_name,
                        "arguments": event["arguments"],
                        "content": format_chunks(chunks),  # Format for AI context
                    }
                )

                # Track for content_blocks
                tool_calls_metadata.append(
                    {
                        "type": "tool_call",
                        "name": tool_name,
                        "arguments": arguments,
                        "result": result_formatted,
                    }
                )

            elif event["type"] == "needs_tool_results":
                # Tools executed, now generate final answer
                break

        # Phase 2: Generate final answer with tool results
        complete_text = ""
        for event in generate_with_tools(
            messages=existing_messages,
            tools=TOOL_DEFINITIONS,
            tool_results=tool_results_for_ai,
            lang=lang,
        ):
            if event["type"] == "text_delta":
                complete_text += event["delta"]
                yield format_event("message_delta", event["delta"])

        # Save complete response
        assistant_message.content = complete_text
        assistant_message.content_blocks = [
            *tool_calls_metadata,
            {"type": "text", "text": complete_text},
        ]

        db.commit()
