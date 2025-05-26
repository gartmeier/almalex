from openai import OpenAI
from sqlalchemy.orm import Session

from app import crud
from app.ai.prompts import render
from app.core.config import settings
from app.db.models import ChatMessage

client = OpenAI(api_key=settings.openai_api_key)


def generate_title(user_message: str) -> str:
    prompt = render("title.md", user_message=user_message)

    response = client.responses.create(
        model=settings.openai_model,
        input=prompt,
    )
    return clean_title(response.output_text)


def clean_title(title: str) -> str:
    return title.replace('"', "").replace("'", "")


def generate_answer(session: Session, messages: list[ChatMessage]):
    question = messages[-1].content
    context = get_context(session, messages)

    prompt = render(
        "answer.md",
        question=question,
        context=context,
    )

    input: list = [
        {"role": "system", "content": "You are a helpful AI assistant"},
        *[{"role": m.role, "content": m.content} for m in messages[:-1]],
        {"role": "user", "content": prompt},
    ]

    stream = client.responses.create(
        input=input,
        model=settings.openai_model,
        stream=True,
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            yield event.delta


def get_context(session: Session, messages: list[ChatMessage], top_k: int = 10) -> str:
    query = generate_query(messages)
    query_embedding = create_embedding(query)

    chunks = crud.get_similar_chunks(session=session, query_embedding=query_embedding)

    context = ""
    for chunk in chunks:
        context += f"# {chunk.document.title}\n{chunk.text}\n\n"

    return context.strip()


def generate_query(messages: list[ChatMessage]):
    prompt = render("query.md", messages=messages)

    response = client.responses.create(
        input=prompt,
        model=settings.openai_model,
    )
    return response.output_text


def create_embedding(input: str):
    response = client.embeddings.create(
        input=input,
        model=settings.openai_embedding_model,
    )
    return response.data[0].embedding


def format_chunks(chunks):
    formatted_text = ""
    for title, text in chunks:
        formatted_text += f"## {title}\n\n{text}\n\n"
    return formatted_text
