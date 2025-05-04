from pydantic import BaseModel, ConfigDict


class TokenResponse(BaseModel):
    access_token: str


class ChatResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str | None
    messages: list["MessageResponse"]


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: str
    content: str


class MessageRequest(BaseModel):
    id: str
    content: str
