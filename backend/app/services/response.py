"""Response generation using OpenAI Responses API with tool calling."""

from openai import OpenAI
from sqlalchemy.orm import Session

from app.core.config import settings
from app.tools import search as search_tools

client = OpenAI(api_key=settings.openai_api_key)


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
    *, db: Session, conversation_id: str, input: str, reasoning_effort: str = "low"
):
    """Generate response using OpenAI Conversations API with tool calling.

    Args:
        db: Database session for tool functions
        conversation_id: OpenAI conversation ID
        input: User input message
        reasoning_effort: Reasoning effort level

    Yields:
        Raw OpenAI streaming events
    """
    import json

    stream = client.responses.create(
        input=[{"role": "user", "content": input}],
        conversation=conversation_id,
        model=settings.openai_response_model,
        reasoning={"effort": reasoning_effort, "summary": "auto"},
        tools=TOOLS,
        stream=True,
    )

    tool_calls = {}

    for event in stream:
        # Yield raw OpenAI events
        yield event

        # Track tool calls for execution
        if event.type == "response.output_item.added":
            if event.item.type == "function_call":
                tool_calls[event.output_index] = event.item

        elif event.type == "response.function_call_arguments.done":
            if event.output_index in tool_calls:
                tool_calls[event.output_index].arguments = event.arguments

    # Execute tools if any were called
    if tool_calls:
        for tool_call in tool_calls.values():
            args = json.loads(tool_call.arguments)
            result = call_function(tool_call.name, args, db)

            # Add tool result to conversation
            client.conversations.items.create(
                conversation_id,
                {
                    "type": "function_call_output",
                    "call_id": tool_call.call_id,
                    "output": result.model_dump_json(),
                },
            )

        # Continue streaming with tool results
        continuation_stream = client.responses.create(
            conversation=conversation_id,
            model=settings.openai_response_model,
            reasoning={"effort": reasoning_effort, "summary": "auto"},
            tools=TOOLS,
            stream=True,
        )

        for event in continuation_stream:
            yield event
