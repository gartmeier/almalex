from pydantic import BaseModel


class SearchResult(BaseModel):
    id: int
    title: str
    url: str


class DocumentChunkResult(BaseModel):
    id: int
    text: str
    url: str
    title: str
    source: str


class SearchResults(BaseModel):
    results: list[DocumentChunkResult]
