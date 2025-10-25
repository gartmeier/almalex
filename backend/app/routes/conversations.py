from fastapi import APIRouter, Cookie

from app.core.types import Language
from app.schemas.conversation import ConversationItemsResponse, ConversationResponse
from app.services import conversation

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("", response_model=ConversationResponse)
async def create_conversation(lang: Language = Cookie(default="de")):
    """Create new OpenAI conversation with instructions."""
    return conversation.create_conversation(lang=lang)


@router.get("/{conversation_id}/items", response_model=ConversationItemsResponse)
async def get_conversation_items(conversation_id: str):
    """Get conversation items from OpenAI."""
    return conversation.get_conversation(conversation_id)
