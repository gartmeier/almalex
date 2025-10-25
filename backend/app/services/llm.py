"""LLM text generation using OpenAI API."""

from typing import Iterator, Sequence

from openai import OpenAI
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.types import Language
from app.db.models import ChatMessage, DocumentChunk
from app.prompts.query import build_search_query_prompt
from app.prompts.system import build_response_prompt
from app.prompts.title import build_title_prompt
from app.schemas.chat import (
    DoneEvent,
    ReasoningEvent,
    StreamEvent,
    TextEvent,
    ToolCallEvent,
    ToolResultEvent,
)
from app.tools import search as search_tools
from app.utils.formatters import format_chunks

client = OpenAI(api_key=settings.openai_api_key)


def generate_title(user_message: str) -> str:
    """Generate chat title from first user message.

    Args:
        user_message: First message in conversation

    Returns:
        Clean title string (3-7 words)
    """
    prompt = build_title_prompt(user_message)

    response = client.responses.create(
        model=settings.openai_title_model,
        input=prompt,
    )
    return _clean_title(response.output_text)


def _clean_title(title: str) -> str:
    """Remove quotes from generated title."""
    return title.replace('"', "").replace("'", "")


def generate_answer(
    *,
    messages: list[ChatMessage],
    search_results: Sequence[DocumentChunk],
    lang: Language = "de",
):
    """Generate streaming answer based on legal context.

    Args:
        messages: Chat conversation history
        search_results: Retrieved legal document chunks
        lang: Response language (de, en, fr)

    Yields:
        Text deltas as they're generated
    """
    question = messages[-1].content
    context = format_chunks(search_results)

    prompt = build_response_prompt(context, question, lang)

    openai_messages: list = [
        {"role": "system", "content": "You are a helpful AI assistant"},
        *[{"role": m.role, "content": m.content} for m in messages[:-1]],
        {"role": "user", "content": prompt},
    ]

    stream = client.responses.create(
        input=openai_messages,
        model=settings.openai_response_model,
        stream=True,
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            yield event.delta


def generate_search_query(messages: list[ChatMessage]) -> str:
    """Generate search query from conversation.

    Args:
        messages: Chat conversation history

    Returns:
        Optimized search query string
    """
    prompt = build_search_query_prompt(messages)

    response = client.responses.create(
        input=prompt,
        model=settings.openai_query_model,
    )
    return response.output_text


def generate_text(messages: list[dict]):
    """Generate text from raw messages (used by CLI).

    Args:
        messages: List of message dicts with role and content

    Yields:
        Text deltas as they're generated
    """
    stream = client.responses.create(
        input=messages,
        model=settings.openai_response_model,
        stream=True,
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            yield event.delta


def call_function(name: str, args: dict, db: Session):
    if name == "search_legal_documents":
        return search_tools.search_legal_documents(db=db, **args)
    elif name == "lookup_law_article":
        return search_tools.lookup_law_article(db=db, **args)
    elif name == "lookup_court_decision":
        return search_tools.lookup_court_decision(db=db, **args)
    raise ValueError(f"Unknown function: {name}")


TOOLS = [
    {
        "type": "function",
        "name": "search_legal_documents",
        "description": "Search Swiss legal database using semantic search. Returns document chunks with citation metadata. Call multiple times to search different sources.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Natural language search query (e.g., 'Wertrechte Register Eintragung', 'Bucheffekten Entstehung')",
                },
                "source": {
                    "type": "string",
                    "enum": ["federal_law", "federal_court"],
                    "description": "Source type to search. Use 'federal_law' for laws or 'federal_court' for court decisions.",
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of results to return (default: 20)",
                    "default": 20,
                },
            },
            "required": ["query", "source"],
        },
    },
    {
        "type": "function",
        "name": "lookup_law_article",
        "description": "Lookup specific law article by reference (e.g., 'Art. 334 OR', 'Art. 8 ZGB'). Use when a law or court decision mentions another article.",
        "parameters": {
            "type": "object",
            "properties": {
                "article_reference": {
                    "type": "string",
                    "description": "Article reference like 'Art. 334 OR', 'Art. 8 ZGB', or '334 OR'",
                }
            },
            "required": ["article_reference"],
        },
    },
    {
        "type": "function",
        "name": "lookup_court_decision",
        "description": "Lookup court decision by BGE citation (e.g., '146 V 240', 'BGE 91 I 374'). Use when a court decision or law mentions another court decision.",
        "parameters": {
            "type": "object",
            "properties": {
                "citation": {
                    "type": "string",
                    "description": "BGE citation like '146 V 240' or 'BGE 146 V 240'. Format: volume part page (e.g., '91 I 374')",
                }
            },
            "required": ["citation"],
        },
    },
]


def generate_with_tools(
    messages: list[dict], db: Session, effort: str = "low"
) -> Iterator[StreamEvent]:
    """Generate response with automatic tool calling loop.

    Args:
        messages: List of message dicts with role and content
        db: Database session for tool functions
        effort: Reasoning effort level

    Yields:
        Typed streaming events
    """
    import json

    input_list = messages.copy()

    while True:
        stream = client.responses.create(
            input=input_list,
            model=settings.openai_response_model,
            reasoning={"effort": effort, "summary": "auto"},
            tools=TOOLS,
            stream=True,
        )

        tool_calls = {}
        output_items = []

        for event in stream:
            if event.type == "response.reasoning.delta":
                yield ReasoningEvent(type="reasoning", delta=event.delta)

            elif event.type == "response.output_text.delta":
                yield TextEvent(type="text", delta=event.delta)

            elif event.type == "response.output_item.added":
                if event.item.type == "function_call":
                    tool_calls[event.output_index] = event.item

            elif event.type == "response.function_call_arguments.done":
                if event.output_index in tool_calls:
                    tool_calls[event.output_index].arguments = event.arguments

            elif event.type == "response.output_item.done":
                output_items.append(event.item)

        input_list += output_items

        if not tool_calls:
            break

        for tool_call in tool_calls.values():
            args = json.loads(tool_call.arguments)

            yield ToolCallEvent(
                type="tool_call",
                id=tool_call.call_id,
                name=tool_call.name,
                arguments=args,
            )

            result = call_function(tool_call.name, args, db)

            yield ToolResultEvent(
                type="tool_result",
                id=tool_call.call_id,
                result=result,
            )

            input_list.append(
                {
                    "type": "function_call_output",
                    "call_id": tool_call.call_id,
                    "output": result.model_dump_json(),
                }
            )

    yield DoneEvent(type="done")
