from typing import Iterator

from openai import OpenAI

from app.core.config import settings
from app.db.models import ChatMessage
from app.prompts.instructions import build_instructions
from app.schemas.chat import DoneEvent, TextContentBlock, TextEvent


class LLMService:
    def __init__(self, client: OpenAI):
        self.client = client

    def generate(
        self, *, history: list[ChatMessage], context: str, lang: str
    ) -> Iterator[TextEvent | DoneEvent]:
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
        )

        text_parts: list[str] = []
        for chunk in stream:
            delta = chunk.choices[0].delta
            if delta.content:
                text_parts.append(delta.content)
                yield TextEvent(type="text", delta=delta.content)

        text = "".join(text_parts)
        yield DoneEvent(
            type="done",
            content=text,
            content_blocks=[TextContentBlock(type="text", text=text)],
        )
