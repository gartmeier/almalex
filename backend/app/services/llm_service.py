from typing import Iterator

from openai import OpenAI

from app.core.config import settings
from app.core.types import Language
from app.prompts.instructions import build_instructions
from app.schemas.chat import Message
from app.schemas.events import Event, TextDelta, ThinkingDelta


class LLMService:
    def __init__(self, client: OpenAI):
        self.client = client

    def generate(
        self, *, messages: list[Message], context: str, lang: Language
    ) -> Iterator[Event]:
        openai_messages: list[dict] = [
            {
                "role": "system",
                "content": build_instructions(lang=lang, context=context),
            },
            *[{"role": msg.role, "content": msg.content} for msg in messages],
        ]

        stream = self.client.chat.completions.create(
            model=settings.openai_chat_model,
            messages=openai_messages,  # type: ingore
            stream=True,
            extra_body={"reasoning_effort": settings.openai_reasoning_effort},
        )

        for chunk in stream:
            if not chunk.choices:
                continue

            delta = chunk.choices[0].delta

            reasoning_content = getattr(delta, "reasoning_content", None)
            if reasoning_content:
                yield ThinkingDelta(type="thinking_delta", delta=reasoning_content)

            elif delta.content:
                yield TextDelta(type="text_delta", delta=delta.content)
