from pydantic import BaseModel


class ResponseRequest(BaseModel):
    conversation_id: str
    message: str
    effort: str = "low"
