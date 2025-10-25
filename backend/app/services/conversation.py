"""Conversation management using OpenAI Conversations API."""

from openai import OpenAI

from app.core.config import settings
from app.core.types import Language
from app.prompts.instructions import build_instructions

client = OpenAI(api_key=settings.openai_api_key)


def create_conversation(lang: Language = "de"):
    """Create new OpenAI conversation.

    Args:
        lang: Response language for instructions

    Returns:
        OpenAI Conversation object
    """
    instructions = build_instructions(lang)
    return client.conversations.create(instructions=instructions)


def get_conversation(conversation_id: str):
    """Get conversation items from OpenAI.

    Args:
        conversation_id: OpenAI conversation ID

    Returns:
        OpenAI conversation items
    """
    return client.conversations.items.list(conversation_id)
