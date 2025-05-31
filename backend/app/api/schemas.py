from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TokenResponse(BaseModel):
    access_token: str


class ChatListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str | None
    created_at: datetime


class ChatDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str | None
    messages: list["MessageResponse"]


class ChatCreate(BaseModel):
    id: str


class ChatUpdate(BaseModel):
    title: str


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: str
    content: str


class MessageRequest(BaseModel):
    id: str
    content: str
