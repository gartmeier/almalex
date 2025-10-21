"""LLM text generation using OpenAI API."""

from typing import Sequence

from openai import OpenAI

from app.core.config import settings
from app.core.types import Language
from app.db.models import ChatMessage, DocumentChunk
from app.prompts.query import build_search_query_prompt
from app.prompts.system import build_response_prompt
from app.prompts.title import build_title_prompt
from app.utils.formatters import format_chunks

client = OpenAI(api_key=settings.openai_api_key)


def generate_title(user_message: str) -> str:
    """Generate chat title from first user message.

    Args:
        user_message: First message in conversation

    Returns:
        Clean title string (3-7 words)
    """
    prompt = build_title_prompt(user_message)

    response = client.responses.create(
        model=settings.openai_title_model,
        input=prompt,
    )
    return _clean_title(response.output_text)


def _clean_title(title: str) -> str:
    """Remove quotes from generated title."""
    return title.replace('"', "").replace("'", "")


def generate_answer(
    *,
    messages: list[ChatMessage],
    search_results: Sequence[DocumentChunk],
    lang: Language = "de",
):
    """Generate streaming answer based on legal context.

    Args:
        messages: Chat conversation history
        search_results: Retrieved legal document chunks
        lang: Response language (de, en, fr)

    Yields:
        Text deltas as they're generated
    """
    question = messages[-1].content
    context = format_chunks(search_results)

    prompt = build_response_prompt(context, question, lang)

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


def generate_search_query(messages: list[ChatMessage]) -> str:
    """Generate search query from conversation.

    Args:
        messages: Chat conversation history

    Returns:
        Optimized search query string
    """
    prompt = build_search_query_prompt(messages)

    response = client.responses.create(
        input=prompt,
        model=settings.openai_query_model,
    )
    return response.output_text


def generate_text(messages: list[dict]):
    """Generate text from raw messages (used by CLI).

    Args:
        messages: List of message dicts with role and content

    Yields:
        Text deltas as they're generated
    """
    stream = client.responses.create(
        input=messages,
        model=settings.openai_response_model,
        stream=True,
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            yield event.delta
