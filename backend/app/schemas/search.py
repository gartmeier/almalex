from pydantic import BaseModel


class SearchResult(BaseModel):
    id: int
    title: str
    url: str


class DocumentChunkResult(BaseModel):
    chunk_text: str
    document_id: int
    url: str
    title: str
    source: str
    law_abbreviation: str | None = None
    article_number: str | None = None


class SearchResults(BaseModel):
    results: list[DocumentChunkResult]
