"""LLM text generation using OpenAI API."""

from typing import Iterator

from openai import OpenAI
from openai.types.responses import FunctionToolParam
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import ChatMessage
from app.schemas.chat import (
    DoneEvent,
    ReasoningEvent,
    StreamEvent,
    TextEvent,
    ToolCallEvent,
    ToolResultEvent,
)
from app.tools import search as search_tools

TOOLS = [
    FunctionToolParam(
        type="function",
        name="search_legal_documents",
        description="Search Swiss legal database using semantic search. Returns document chunks with citation metadata. Call multiple times to search different sources.",
        strict=True,
        parameters={
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
    ),
    FunctionToolParam(
        type="function",
        name="lookup_law_article",
        description="Lookup specific law article by reference (e.g., 'Art. 334 OR', 'Art. 8 ZGB'). Use when a law or court decision mentions another article.",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "article_reference": {
                    "type": "string",
                    "description": "Article reference like 'Art. 334 OR', 'Art. 8 ZGB', or '334 OR'",
                }
            },
            "required": ["article_reference"],
        },
    ),
    FunctionToolParam(
        type="function",
        name="lookup_court_decision",
        description="Lookup court decision by BGE citation (e.g., '146 V 240', 'BGE 91 I 374'). Use when a court decision or law mentions another court decision.",
        strict=True,
        parameters={
            "type": "object",
            "properties": {
                "citation": {
                    "type": "string",
                    "description": "BGE citation like '146 V 240' or 'BGE 146 V 240'. Format: volume part page (e.g., '91 I 374')",
                }
            },
            "required": ["citation"],
        },
    ),
]

client = OpenAI(api_key=settings.openai_api_key)


def generate_with_tools(
    *, db: Session, history: list[ChatMessage]
) -> Iterator[StreamEvent]:
    """Generate response with automatic tool calling loop.

    Args:
        db: Database session for tool functions
        history: Chat conversation history
        effort: Reasoning effort level

    Yields:
        Typed streaming events
    """
    import json

    input_list = _messages_to_openai_format(history)

    while True:
        stream = client.responses.create(
            input=input_list,
            model=settings.openai_response_model,
            reasoning={"effort": "medium", "summary": "auto"},
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

            result = _call_function(tool_call.name, args, db)

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


def _messages_to_openai_format(messages: list[ChatMessage]):
    return []


def _call_function(name: str, args: dict, db: Session):
    if name == "search_legal_documents":
        return search_tools.search_legal_documents(db=db, **args)
    elif name == "lookup_law_article":
        return search_tools.lookup_law_article(db=db, **args)
    elif name == "lookup_court_decision":
        return search_tools.lookup_court_decision(db=db, **args)
    raise ValueError(f"Unknown function: {name}")
