import cohere
from anthropic import Anthropic
from openai import OpenAI

from app.core.config import settings

openai_client = OpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url,
)

anthropic_client = Anthropic(
    api_key=settings.anthropic_api_key,
)

cohere_client = cohere.ClientV2(
    api_key=settings.cohere_api_key,
    base_url=settings.cohere_base_url,
)
