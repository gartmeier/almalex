from typing import Literal

from pydantic import BaseModel


class TextDelta(BaseModel):
    type: Literal["text_delta"]
    delta: str


class ThinkingDelta(BaseModel):
    type: Literal["thinking_delta"]
    delta: str


class Error(BaseModel):
    type: Literal["error"]
    message: str


class Source(BaseModel):
    id: int
    citation: str
    url: str


class Status(BaseModel):
    type: Literal["status"]
    status: Literal["searching", "thinking", "generating", "done"]


class Sources(BaseModel):
    type: Literal["sources"]
    sources: list[Source]


Event = TextDelta | ThinkingDelta | Status | Error | Sources
