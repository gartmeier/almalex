from typing import Sequence

from openai import OpenAI

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


def create_embedding(input: str):
    response = client.embeddings.create(
        input=input,
        model=settings.openai_embedding_model,
    )
    return response.data[0].embedding


def format_chunks(chunks: Sequence[DocumentChunk]) -> str:
    context = ""

    for chunk in chunks:
        context += f"""\
ID: {chunk.document.id}
Title: {chunk.document.title}
Content: {chunk.text}
---
"""

    return context.strip()
