from fastapi import APIRouter

from app.schemas.conversation import (
    ConversationCreateRequest,
    ConversationItemsResponse,
    ConversationResponse,
)
from app.services import conversation

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("", response_model=ConversationResponse)
async def create_conversation(request: ConversationCreateRequest):
    """Create new OpenAI conversation with instructions."""
    return conversation.create_conversation(lang=request.lang)


@router.get("/{conversation_id}/items", response_model=ConversationItemsResponse)
async def get_conversation_items(conversation_id: str):
    """Get conversation items from OpenAI."""
    return conversation.get_conversation(conversation_id)
