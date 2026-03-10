from typing import Literal

from pydantic import BaseModel, field_validator

from app.core.config import settings


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    model: str

    @field_validator("messages")
    @classmethod
    def messages_not_empty(cls, v):
        if not v:
            raise ValueError("messages must not be empty")
        return v

    @field_validator("model")
    @classmethod
    def model_allowed(cls, v):
        if v not in settings.allowed_models:
            raise ValueError(f"Model not allowed: {v}")
        return v
