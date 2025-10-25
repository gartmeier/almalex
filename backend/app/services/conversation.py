"""Conversation management using OpenAI Conversations API."""

from openai import OpenAI

from app.core.config import settings

client = OpenAI(api_key=settings.openai_api_key)


def create_conversation():
    """Create new OpenAI conversation.

    Returns:
        OpenAI Conversation object
    """
    return client.conversations.create()


def get_conversation(conversation_id: str):
    """Get conversation items from OpenAI.

    Args:
        conversation_id: OpenAI conversation ID

    Returns:
        Dict with conversation_id and items list
    """
    items = client.conversations.items.list(conversation_id)
    return {
        "conversation_id": conversation_id,
        "items": list(items),
    }
