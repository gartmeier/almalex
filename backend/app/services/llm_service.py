from typing import Iterator

from openai import OpenAI

from app.core.config import settings
from app.db.models import ChatMessage
from app.prompts.instructions import build_instructions
from app.schemas.events import (
    DoneEvent,
    ReasoningContentBlock,
    ReasoningEvent,
    TextContentBlock,
    TextEvent,
)


class LLMService:
    def __init__(self, client: OpenAI):
        self.client = client

    def generate(
        self, *, history: list[ChatMessage], context: str, lang: str
    ) -> Iterator[TextEvent | ReasoningEvent | DoneEvent]:
        messages: list[dict] = [
            {
                "role": "system",
                "content": build_instructions(lang=lang, context=context),
            },
            *[{"role": msg.role, "content": msg.content} for msg in history],
        ]

        stream = self.client.chat.completions.create(
            model=settings.openai_chat_model,
            messages=messages,
            stream=True,
            extra_body={"reasoning_effort": settings.openai_reasoning_effort},
        )

        reasoning_parts: list[str] = []
        text_parts: list[str] = []
        for chunk in stream:
            delta = chunk.choices[0].delta

            reasoning_content = getattr(delta, "reasoning_content", None)
            if reasoning_content:
                reasoning_parts.append(reasoning_content)
                yield ReasoningEvent(type="reasoning", delta=reasoning_content)

            if delta.content:
                text_parts.append(delta.content)
                yield TextEvent(type="text", delta=delta.content)

        text = "".join(text_parts)
        content_blocks: list[TextContentBlock | ReasoningContentBlock] = []
        if reasoning_parts:
            content_blocks.append(
                ReasoningContentBlock(type="reasoning", text="".join(reasoning_parts))
            )
        content_blocks.append(TextContentBlock(type="text", text=text))

        yield DoneEvent(
            type="done",
            content=text,
            content_blocks=content_blocks,
        )
