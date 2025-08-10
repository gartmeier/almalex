from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


# Authentication Schemas
class TokenResponse(BaseModel):
    access_token: str


# Content Block Schemas
class TextContentBlock(BaseModel):
    type: Literal["text"]
    text: str


class SearchResult(BaseModel):
    id: int
    title: str
    url: str


class SearchContentBlock(BaseModel):
    type: Literal["search"]
    status: Literal["completed", "in_progress"] = "completed"
    query: str
    results: list[SearchResult]


# Message Schemas
class MessageCreate(BaseModel):
    id: str
    content: str


class MessageDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: str
    content: str
    content_blocks: list[SearchContentBlock | TextContentBlock]


# Chat Schemas
class ChatCreate(BaseModel):
    id: str


class ChatUpdate(BaseModel):
    title: str


class ChatListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str | None
    created_at: datetime


class ChatDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str | None
    messages: list[MessageDetail]


# Rate Limiting Schemas
class RateLimit(BaseModel):
    remaining: int
    used: int
    max: int
