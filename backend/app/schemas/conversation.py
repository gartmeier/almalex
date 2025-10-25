from openai.pagination import SyncConversationCursorPage
from openai.types.conversations import Conversation, ConversationItem
from pydantic import BaseModel

from app.core.types import Language


class ConversationCreateRequest(BaseModel):
    lang: Language = "de"


class ConversationResponse(Conversation):
    """OpenAI Conversation object."""

    pass


class ConversationItemsResponse(SyncConversationCursorPage[ConversationItem]):
    """Paginated list of conversation items."""

    pass
