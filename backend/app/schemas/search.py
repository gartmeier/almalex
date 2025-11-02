from pydantic import BaseModel


class SearchResult(BaseModel):
    id: int
    title: str
    url: str


class DocumentChunkResult(BaseModel):
    id: int
    source: str
    title: str
    text: str
    url: str


SearchResults = list[DocumentChunkResult]
