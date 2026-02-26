from anthropic import Anthropic
from openai import OpenAI

from app.core.config import settings

openai_client = OpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url,
)

bulk_embedding_client = OpenAI(
    api_key=settings.bulk_embedding_api_key,
    base_url=settings.bulk_embedding_base_url,
)

anthropic_client = Anthropic(
    api_key=settings.anthropic_api_key,
)
