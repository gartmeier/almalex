from fastapi import APIRouter

from app.services import conversation

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("")
async def create_conversation():
    """Create new OpenAI conversation."""
    return conversation.create_conversation()


@router.get("/{conversation_id}/items")
async def get_conversation_items(conversation_id: str):
    """Get conversation items from OpenAI."""
    return conversation.get_conversation(conversation_id)
