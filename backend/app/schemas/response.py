from pydantic import BaseModel


class ResponseRequest(BaseModel):
    conversation_id: str
    input: str
    reasoning_effort: str = "low"
