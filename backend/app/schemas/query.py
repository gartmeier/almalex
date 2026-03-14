from pydantic import BaseModel


class ExpandedQueries(BaseModel):
    article_queries: list[str]
    decision_queries: list[str]
