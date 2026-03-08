from typing import Iterator

from openai import OpenAI

from app.core.config import settings
from app.core.types import Language
from app.db.models import ChatMessage
from app.prompts.instructions import build_instructions
from app.schemas.events import Event, TextDelta, ThinkingDelta


class LLMService:
    def __init__(self, client: OpenAI):
        self.client = client

    def generate(
        self, *, history: list[ChatMessage], context: str, lang: Language
    ) -> Iterator[Event]:
        messages: list[dict] = [
            {
                "role": "system",
                "content": build_instructions(lang=lang, context=context),
            },
            *[{"role": msg.role, "content": msg.content} for msg in history],
        ]

        stream = self.client.chat.completions.create(
            model=settings.openai_chat_model,
            messages=messages,  # type: ignore
            stream=True,
            extra_body={"reasoning_effort": settings.openai_reasoning_effort},
        )

        for chunk in stream:
            if not chunk.choices:
                continue

            delta = chunk.choices[0].delta

            if hasattr(delta, "reasoning_content"):
                yield ThinkingDelta(
                    type="thinking_delta", delta=delta.reasoning_content
                )

            elif delta.content:
                yield TextDelta(type="text_delta", delta=delta.content)
