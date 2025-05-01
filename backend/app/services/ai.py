from openai import OpenAI

from app.core.config import settings


TITLE_PROMPT = """\
Your task is to generate a concise, descriptive title for a conversation based on the user's first message. The title should:

1. Be between 3-7 words long
2. Capture the main topic or intent of the message
3. Use plain language without technical jargon unless the query is explicitly technical
4. Avoid using quotes or special characters
5. Start with a capital letter
6. Not include "chat about" or similar phrases - focus on the subject matter directly
7. Transform questions into topic statements where appropriate

Based on the user's first message: "{user_message}", generate an appropriate title for this conversation.
Respond with ONLY the title text, nothing else.
"""

client = OpenAI(api_key=settings.openai_api_key)


def generate_title(message: str) -> str:
    response = client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {
                "role": "developer",
                "content": "You are a helpful assistant that generates concise chat titles.",
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        temperature=0.7,
        max_tokens=20,
    )

    # Extract just the title from the response
    title = response.choices[0].message.content.strip()

    # Remove any quotes that might be in the response
    title = title.replace('"', "").replace("'", "")

    return title


def create_completion(messages: list[dict]):
    stream = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=messages,
        stream=True,
    )

    for chunk in stream:
        data = chunk.choices[0].delta.content
        if data:
            yield data
