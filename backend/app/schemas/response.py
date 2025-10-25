from pydantic import BaseModel

from app.core.types import Language


class ResponseRequest(BaseModel):
    conversation_id: str
    input: str
    reasoning_effort: str = "low"
    lang: Language = "de"
