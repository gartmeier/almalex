from openai.pagination import SyncConversationCursorPage
from openai.types.conversations import Conversation, ConversationItem


class ConversationResponse(Conversation):
    """OpenAI Conversation object."""

    pass


class ConversationItemsResponse(SyncConversationCursorPage[ConversationItem]):
    """Paginated list of conversation items."""

    pass
