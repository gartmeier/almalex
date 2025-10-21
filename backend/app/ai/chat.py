from typing import Sequence

from openai import OpenAI

from app.ai.formatters import format_chunks
from app.ai.prompts import render
from app.core.config import settings
from app.core.types import Language
from app.db.models import ChatMessage, DocumentChunk

client = OpenAI(api_key=settings.openai_api_key)


def generate_title(user_message: str) -> str:
    prompt = render("title.md", user_message=user_message)

    response = client.responses.create(
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

    stream = client.responses.create(
        input=openai_messages,
        model=settings.openai_response_model,
        stream=True,
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            yield event.delta


def generate_query(messages: list[ChatMessage]):
    prompt = render("query.md", messages=messages)

    response = client.responses.create(
        input=prompt,
        model=settings.openai_query_model,
    )
    return response.output_text


def generate_text(messages: list[dict]):
    """Generate text from chat messages (used by CLI)."""
    stream = client.responses.create(
        input=messages,
        model=settings.openai_response_model,
        stream=True,
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            yield event.delta


def generate_with_tools(
    *,
    messages: list[ChatMessage],
    tools: list[dict],
    tool_results: list[dict] | None = None,
    lang: Language = "de",
):
    """Generate answer using OpenAI function calling with search tools.

    This is a two-phase process:
    1. First call: AI decides which tools to use → yields tool_call events
    2. After tool execution: Call again with results → yields text_delta

    Args:
        messages: Chat message history
        tools: Tool definitions (from app.services.tools.TOOL_DEFINITIONS)
        tool_results: Results from executed tools (for second phase)
        lang: Response language

    Yields:
        Dict with type and content for each event:
        - {"type": "tool_call", "id": str, "name": str, "arguments": str}
        - {"type": "needs_tool_results"} (signals service to execute and call again)
        - {"type": "text_delta", "delta": str}
    """
    # Build messages for OpenAI
    openai_messages: list = [
        {"role": "system", "content": "You are a helpful AI assistant specialized in Swiss law. Use the search tools to find relevant legal text and court decisions to answer user questions accurately."},
        *[{"role": m.role, "content": m.content} for m in messages],
    ]

    if tool_results is None:
        # Phase 1: Let AI decide which tools to use
        response = client.chat.completions.create(
            model=settings.openai_response_model,
            messages=openai_messages,
            tools=tools,
            tool_choice="auto",
        )

        message = response.choices[0].message

        if message.tool_calls:
            # Yield each tool call for execution
            for tool_call in message.tool_calls:
                yield {
                    "type": "tool_call",
                    "id": tool_call.id,
                    "name": tool_call.function.name,
                    "arguments": tool_call.function.arguments,
                }
            # Signal that service needs to execute tools and call us again
            yield {"type": "needs_tool_results"}
        else:
            # No tools needed, generate answer directly
            stream = client.responses.create(
                input=openai_messages,
                model=settings.openai_response_model,
                stream=True,
            )

            for event in stream:
                if event.type == "response.output_text.delta":
                    yield {"type": "text_delta", "delta": event.delta}

    else:
        # Phase 2: Generate final answer with tool results
        # Add assistant message with tool calls and tool responses
        openai_messages.append(
            {
                "role": "assistant",
                "tool_calls": [
                    {
                        "id": tr["id"],
                        "type": "function",
                        "function": {
                            "name": tr["name"],
                            "arguments": tr["arguments"],
                        },
                    }
                    for tr in tool_results
                ],
            }
        )

        # Add tool result messages
        for tr in tool_results:
            openai_messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tr["id"],
                    "content": tr["content"],
                }
            )

        # Stream final answer
        stream = client.chat.completions.create(
            model=settings.openai_response_model,
            messages=openai_messages,
            stream=True,
        )

        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield {"type": "text_delta", "delta": chunk.choices[0].delta.content}
