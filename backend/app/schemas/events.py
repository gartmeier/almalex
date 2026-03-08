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
    id: str
    reference: str
    url: str


class Sources(BaseModel):
    type: Literal["sources"]
    sources: list[Source]


Event = TextDelta | ThinkingDelta | Error | Sources
