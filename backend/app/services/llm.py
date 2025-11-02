"""LLM text generation using OpenAI API."""

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
    ReasoningContentBlock,
    ReasoningEvent,
    TextContentBlock,
    TextEvent,
    ToolCallContentBlock,
    ToolCallEvent,
    ToolResultContentBlock,
    ToolResultEvent,
)

client = OpenAI(api_key=settings.openai_api_key)


def generate_with_tools(
    *, db: Session, history: list[ChatMessage], lang: Language
) -> Iterator[ReasoningEvent | TextEvent | ToolCallEvent | ToolResultEvent | DoneEvent]:
    """Generate response with automatic tool calling loop.

    Yields deltas for streaming to frontend and final blocks for DB storage.

    Args:
        db: Database session for tool functions
        history: Chat message history
        lang: Language for instructions

    Yields:
        Delta events (type: "reasoning"/"text", delta: str) for frontend streaming
        Tool events (type: "tool_call"/"tool_result") for frontend display
        Done event (type: "done", blocks: list, content: str) for DB storage
    """

    input_items = _messages_to_openai_format(history)
    output_items = []
    output_texts = []
    function_call_outputs = []

    while True:
        stream = client.responses.create(
            model=settings.openai_response_model,
            input=input_items,  # type: ignore
            instructions=build_instructions(lang),
            tools=tools.ALL_TOOLS,
            reasoning={"effort": "medium", "summary": "auto"},
            store=False,
            stream=True,
        )

        tool_calls = {}

        for event in stream:
            match event.type:
                case "response.output_text.delta":
                    yield TextEvent(type="text", delta=event.delta)

                case "response.reasoning_summary_text.delta":
                    yield ReasoningEvent(type="reasoning", delta=event.delta)

                case "response.output_item.added":
                    if event.item.type == "function_call":
                        tool_calls[event.output_index] = event.item

                case "response.function_call_arguments.done":
                    if event.output_index in tool_calls:
                        tool_calls[event.output_index].arguments = event.arguments

                case "response.output_item.done":
                    if event.item.type == "message":
                        input_items.append(event.item)
                        output_items.append(event.item)
                        output_texts.append(event.item.content[0].text)
                    elif event.item.type == "function_call":
                        input_items.append(event.item)
                        output_items.append(event.item)
                    elif event.item.type == "reasoning":
                        output_items.append(event.item)

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

            result = tools.call_function(db=db, name=tool_call.name, args=args)

            yield ToolResultEvent(
                type="tool_result",
                id=tool_call.call_id,
                result=result,
            )

            item = {
                "type": "function_call_output",
                "call_id": tool_call.call_id,
                "output": result.model_dump_json(),
            }

            input_items.append(item)
            function_call_outputs.append(item)

    content = "\n\n".join(output_texts)
    content_blocks: list[
        ReasoningContentBlock
        | TextContentBlock
        | ToolCallContentBlock
        | ToolResultContentBlock
    ] = []

    for output_item in output_items:
        match output_item.type:
            case "reasoning":
                if output_item.summary:
                    content_blocks.append(
                        ReasoningContentBlock(
                            type="reasoning",
                            text=output_item.summary[0].text,
                        )
                    )

            case "message":
                if output_item.content and output_item.content[0].type == "output_text":
                    content_blocks.append(
                        TextContentBlock(
                            type="text",
                            text=output_item.content[0].text,
                        )
                    )

            case "function_call":
                content_blocks.append(
                    ToolCallContentBlock(
                        type="tool_call",
                        id=output_item.call_id,
                        name=output_item.name,
                        arguments=json.loads(output_item.arguments),
                    )
                )

                # Find matching output
                for function_call_output in function_call_outputs:
                    if function_call_output["call_id"] == output_item.call_id:
                        result_data = json.loads(function_call_output["output"])
                        content_blocks.append(
                            ToolResultContentBlock(
                                type="tool_result",
                                id=output_item.call_id,
                                result=result_data,
                            )
                        )
                        break

    yield DoneEvent(
        type="done",
        content=content,
        content_blocks=content_blocks,
    )


def _messages_to_openai_format(messages: list[ChatMessage]):
    return [{"role": msg.role, "content": msg.content} for msg in messages]
