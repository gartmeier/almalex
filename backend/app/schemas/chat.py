from pydantic import BaseModel


class MessageRequest(BaseModel):
    content: str
