"""LLM text generation using Infomaniak chat completions API."""

import json
from typing import Iterator

from openai import OpenAI
from sqlalchemy.orm import Session

from app import tools
from app.core.config import settings
from app.core.types import Language
from app.db.models import ChatMessage
from app.prompts.instructions import build_instructions
from app.schemas.chat import (
    DoneEvent,
    TextContentBlock,
    TextEvent,
    ToolCallContentBlock,
    ToolCallEvent,
    ToolResultContentBlock,
    ToolResultEvent,
)

client = OpenAI(
    api_key=settings.infomaniak_api_key,
    base_url=f"https://api.infomaniak.com/1/ai/{settings.infomaniak_chat_product_id}/openai/v1",
)


def generate_with_tools(
    *, db: Session, history: list[ChatMessage], lang: Language
) -> Iterator[TextEvent | ToolCallEvent | ToolResultEvent | DoneEvent]:
    messages: list[dict] = [
        {"role": "system", "content": build_instructions(lang)},
        *[{"role": msg.role, "content": msg.content} for msg in history],
    ]

    output_texts: list[str] = []
    content_blocks: list[
        TextContentBlock | ToolCallContentBlock | ToolResultContentBlock
    ] = []

    while True:
        stream = client.chat.completions.create(
            model=settings.infomaniak_chat_model,
            messages=messages,  # type: ignore
            tools=tools.ALL_TOOLS,
            stream=True,
        )

        tool_calls_acc: dict[int, dict] = {}
        text_parts: list[str] = []
        finish_reason = None

        for chunk in stream:
            choice = chunk.choices[0]
            delta = choice.delta

            if delta.content:
                text_parts.append(delta.content)
                yield TextEvent(type="text", delta=delta.content)

            if delta.tool_calls:
                for tc in delta.tool_calls:
                    if tc.index not in tool_calls_acc:
                        tool_calls_acc[tc.index] = {
                            "id": tc.id or "",
                            "name": tc.function.name if tc.function else "",
                            "arguments": "",
                        }
                    if tc.function and tc.function.arguments:
                        tool_calls_acc[tc.index]["arguments"] += tc.function.arguments

            if choice.finish_reason:
                finish_reason = choice.finish_reason

        text = "".join(text_parts)
        if text:
            output_texts.append(text)
            content_blocks.append(TextContentBlock(type="text", text=text))

        if finish_reason != "tool_calls":
            break

        assistant_msg: dict = {
            "role": "assistant",
            "content": text or None,
            "tool_calls": [
                {
                    "id": tc["id"],
                    "type": "function",
                    "function": {"name": tc["name"], "arguments": tc["arguments"]},
                }
                for tc in tool_calls_acc.values()
            ],
        }
        messages.append(assistant_msg)

        for tc in tool_calls_acc.values():
            args = json.loads(tc["arguments"])

            yield ToolCallEvent(
                type="tool_call", id=tc["id"], name=tc["name"], arguments=args
            )
            result = tools.call_function(db=db, name=tc["name"], args=args)
            yield ToolResultEvent(
                type="tool_result", tool_call_id=tc["id"], result=result
            )

            content_blocks.append(
                ToolCallContentBlock(
                    type="tool_call", id=tc["id"], name=tc["name"], arguments=args
                )
            )
            content_blocks.append(
                ToolResultContentBlock(
                    type="tool_result", tool_call_id=tc["id"], result=result
                )
            )

            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tc["id"],
                    "content": json.dumps(result),
                }
            )

    yield DoneEvent(
        type="done",
        content="\n\n".join(output_texts),
        content_blocks=content_blocks,
    )
