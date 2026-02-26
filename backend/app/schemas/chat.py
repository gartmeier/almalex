from typing import Any, Literal

from pydantic import BaseModel, ConfigDict


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
    tool_call_id: str
    result: Any


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


class ChatDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str | None
    messages: list[MessageDetail]
