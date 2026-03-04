from typing import Literal

from pydantic import BaseModel


class TextContentBlock(BaseModel):
    type: Literal["text"]
    text: str


class ReasoningContentBlock(BaseModel):
    type: Literal["reasoning"]
    text: str


class TextEvent(BaseModel):
    type: Literal["text"]
    delta: str


class ReasoningEvent(BaseModel):
    type: Literal["reasoning"]
    delta: str


class DoneEvent(BaseModel):
    type: Literal["done"]
    content: str
    content_blocks: list[TextContentBlock | ReasoningContentBlock]


class StatusEvent(BaseModel):
    type: Literal["status"]
    status: str


class ArticleSource(BaseModel):
    article_id: int
    citation: str
    article_number: str
    act_sr_number: str
    act_abbr: str | None
    act_title: str | None


class DecisionSource(BaseModel):
    decision_id: int
    citation: str
    decision_number: str
    decision_date: str
    html_url: str | None


class ArticlesEvent(BaseModel):
    type: Literal["articles"]
    articles: list[ArticleSource]


class DecisionsEvent(BaseModel):
    type: Literal["decisions"]
    decisions: list[DecisionSource]
