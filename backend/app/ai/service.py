from openai import OpenAI

from app.ai.prompts import TITLE_PROMPT
from app.core.config import settings

client = OpenAI(api_key=settings.openai_api_key)


def generate_title(message: str) -> str:
    response = client.responses.create(
        model=settings.openai_model,
        input=TITLE_PROMPT.format(user_message=message),
    )

    # Extract just the title from the response
    title = response.output_text

    # Remove any quotes that might be in the response
    title = title.replace('"', "").replace("'", "")

    return title


def generate_text(messages: list):
    stream = client.chat.completions.create(
        messages=messages,
        model="gpt-4.1-nano",
        stream=True,
    )

    for chunk in stream:
        data = chunk.choices[0].delta.content
        if data:
            yield data


def create_embedding(input: str):
    response = client.embeddings.create(
        input=input,
        model=settings.openai_embedding_model,
    )
    return response.data[0].embedding
