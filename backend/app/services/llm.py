"""LLM text generation using Infomaniak chat completions API."""

from typing import Iterator

from openai import OpenAI

from app.core.config import settings
from app.core.types import Language
from app.db.models import ChatMessage
from app.prompts.instructions import build_instructions
from app.schemas.chat import DoneEvent, TextContentBlock, TextEvent

client = OpenAI(
    api_key=settings.infomaniak_api_key,
    base_url=f"https://api.infomaniak.com/1/ai/{settings.infomaniak_chat_product_id}/openai/v1",
)


def generate(
    *, history: list[ChatMessage], context: str, lang: Language
) -> Iterator[TextEvent | DoneEvent]:
    messages: list[dict] = [
        {"role": "system", "content": build_instructions(lang=lang, context=context)},
        *[{"role": msg.role, "content": msg.content} for msg in history],
    ]

    stream = client.chat.completions.create(
        model=settings.infomaniak_chat_model,
        messages=messages,  # type: ignore
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
