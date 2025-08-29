from typing import List, TypedDict

from mcp.server.fastmcp import FastMCP
from sqlalchemy import select

from app.ai.service import create_embedding
from app.db.models import Document, DocumentChunk
from app.db.session import SessionLocal

instructions = """\
When using Swiss Legal Search tools:
1. ALWAYS use the search tool for ANY Swiss legal question - never answer from memory
2. ALWAYS include the returned URLs as clickable links in responses
3. Quote relevant legal text with proper source attribution
"""

mcp = FastMCP("swiss-legal-search", instructions=instructions)


class DocumentResult(TypedDict):
    title: str
    content: str
    url: str


@mcp.tool(description=instructions)
def search_federal_law(
    query: str, limit: int = 10, offset: int = 0
) -> List[DocumentResult]:
    with SessionLocal() as db:
        query_embedding = create_embedding(query)

        rows = db.execute(
            select(
                Document.title,
                DocumentChunk.text,
                Document.metadata_["law_url"].astext.label("law_url"),
                Document.metadata_["article_id"].astext.label("article_id"),
            )
            .join(DocumentChunk)
            .where(Document.source == "fedlex_article")
            .order_by(DocumentChunk.embedding.l2_distance(query_embedding))
            .limit(limit)
            .offset(offset)
        ).all()

        return [
            {
                "title": row.title,
                "content": row.text,
                "url": fix_url(row.law_url, row.article_id),
            }
            for row in rows
        ]


def fix_url(law_url: str, article_id: str) -> str:
    base_url = law_url.replace("fedlex.data.admin.ch", "www.fedlex.admin.ch")
    url_parts = base_url.rsplit("/", 1)
    return f"{url_parts[0]}/de#{article_id}"


def main():
    mcp.run(transport="sse")


if __name__ == "__main__":
    main()
