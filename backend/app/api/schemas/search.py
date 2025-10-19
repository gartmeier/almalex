from pydantic import BaseModel


class SearchResult(BaseModel):
    id: int
    title: str
    url: str
