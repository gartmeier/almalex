from typing import Literal

from pydantic import BaseModel, ConfigDict

from app.api.schemas.search import SearchResult


class TextContentBlock(BaseModel):
    type: Literal["text"]
    text: str


class SearchContentBlock(BaseModel):
    type: Literal["search"]
    status: Literal["completed", "in_progress"] = "completed"
    query: str
    results: list[SearchResult]


class MessageCreate(BaseModel):
    chat_id: str
    content: str


class MessageDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: str
    content: str
    content_blocks: list[SearchContentBlock | TextContentBlock]


class ChatCreate(BaseModel):
    id: str
    message: str


class ChatDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str | None
    messages: list[MessageDetail]
