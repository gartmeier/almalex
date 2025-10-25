from openai.types.responses import ResponseStreamEvent
from pydantic import BaseModel


class ResponseRequest(BaseModel):
    conversation_id: str
    input: str
    reasoning_effort: str = "low"


class SSEMessage(BaseModel):
    """OpenAI Response stream event wrapper."""

    data: ResponseStreamEvent
