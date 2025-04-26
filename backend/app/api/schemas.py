from pydantic import BaseModel, ConfigDict


class ChatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    messages: list["MessageResponse"]


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: str
    content: str


class MessageCreate(BaseModel):
    id: str
    content: str
