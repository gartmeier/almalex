from typing import Any, Literal

from pydantic import BaseModel, ConfigDict

from app.schemas.search import SearchResult


class TextContentBlock(BaseModel):
    type: Literal["text"]
    text: str


class SearchContentBlock(BaseModel):
    type: Literal["search"]
    status: Literal["completed", "in_progress"] = "completed"
    query: str
    results: list[SearchResult]


class MessageCreate(BaseModel):
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


class ReasoningEvent(BaseModel):
    type: Literal["reasoning"]
    delta: str


class TextEvent(BaseModel):
    type: Literal["text"]
    delta: str


class ToolCallEvent(BaseModel):
    type: Literal["tool_call"]
    id: str
    name: str
    arguments: dict[str, Any]


class ToolResultEvent(BaseModel):
    type: Literal["tool_result"]
    id: str
    result: dict[str, Any]


class DoneEvent(BaseModel):
    type: Literal["done"]


StreamEvent = ReasoningEvent | TextEvent | ToolCallEvent | ToolResultEvent | DoneEvent


class SSEMessage(BaseModel):
    data: StreamEvent
