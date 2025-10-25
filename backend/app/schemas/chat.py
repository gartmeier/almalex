from typing import Any, Literal

from pydantic import BaseModel, ConfigDict


class WeatherResult(BaseModel):
    location: str
    temperature: int
    conditions: str
    humidity: int


class TextContentBlock(BaseModel):
    type: Literal["text"]
    text: str


class ReasoningContentBlock(BaseModel):
    type: Literal["reasoning"]
    text: str


class ToolCallContentBlock(BaseModel):
    type: Literal["tool_call"]
    id: str
    name: str
    arguments: dict[str, Any]


class ToolResultContentBlock(BaseModel):
    type: Literal["tool_result"]
    id: str
    result: WeatherResult


class MessageCreate(BaseModel):
    content: str


class MessageDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: str
    content: str
    content_blocks: list[
        TextContentBlock
        | ReasoningContentBlock
        | ToolCallContentBlock
        | ToolResultContentBlock
    ]


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
    result: WeatherResult


class DoneEvent(BaseModel):
    type: Literal["done"]


StreamEvent = ReasoningEvent | TextEvent | ToolCallEvent | ToolResultEvent | DoneEvent


class SSEMessage(BaseModel):
    data: StreamEvent
