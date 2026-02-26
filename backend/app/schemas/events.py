from typing import Literal

from pydantic import BaseModel


class TextContentBlock(BaseModel):
    type: Literal["text"]
    text: str


class TextEvent(BaseModel):
    type: Literal["text"]
    delta: str


class DoneEvent(BaseModel):
    type: Literal["done"]
    content: str
    content_blocks: list[TextContentBlock]
