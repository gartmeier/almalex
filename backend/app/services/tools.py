"""Tool definitions and execution handlers for AI-powered search.

Tools allow the AI to search the vector database dynamically,
deciding which sources to query and how many results to retrieve.
"""

from sqlalchemy.orm import Session

from app.ai.reranking import rerank_chunks
from app.crud.search import retrieve
from app.db.models import DocumentChunk

# Tool definitions for OpenAI function calling
TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "search_fedlex",
            "description": "Search Swiss federal laws, ordinances, and regulations (e.g., ZGB, OR, BV, StGB). Use this to find the actual legal text, articles, and provisions from federal legislation.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query describing what legal text to find (e.g., 'Art. 641 ZGB ownership', 'contract formation OR', 'constitutional rights BV')",
                    },
                    "top_k": {
                        "type": "integer",
                        "description": "Number of results to return (default: 12, range: 1-50)",
                        "default": 12,
                        "minimum": 1,
                        "maximum": 50,
                    },
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "search_bge",
            "description": "Search Swiss Federal Supreme Court decisions (BGE - Bundesgerichtsentscheide). Use this to find case law, precedents, and judicial interpretations of Swiss law.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query for court decisions (e.g., 'good faith contract law', 'property rights interpretation', 'damages calculation')",
                    },
                    "top_k": {
                        "type": "integer",
                        "description": "Number of results to return (default: 8, range: 1-30)",
                        "default": 8,
                        "minimum": 1,
                        "maximum": 30,
                    },
                },
                "required": ["query"],
            },
        },
    },
]


def execute_tool(
    tool_name: str, arguments: dict, db: Session
) -> list[DocumentChunk]:
    """Execute a search tool and return ranked document chunks.

    Args:
        tool_name: Name of the tool to execute ("search_fedlex" or "search_bge")
        arguments: Tool arguments (query, top_k)
        db: Database session

    Returns:
        List of reranked DocumentChunk objects

    Raises:
        ValueError: If tool_name is unknown
    """
    query = arguments["query"]
    top_k = arguments.get("top_k", 12 if tool_name == "search_fedlex" else 8)

    if tool_name == "search_fedlex":
        # Retrieve federal laws/ordinances, then rerank
        chunks = retrieve(
            db=db, query=query, source="fedlex_article", top_k=top_k * 8
        )
        return rerank_chunks(query, chunks, top_k=top_k)

    elif tool_name == "search_bge":
        # Retrieve court decisions, then rerank
        chunks = retrieve(db=db, query=query, source="bge", top_k=top_k * 8)
        return rerank_chunks(query, chunks, top_k=top_k)

    else:
        raise ValueError(f"Unknown tool: {tool_name}")


def format_tool_result(chunks: list[DocumentChunk]) -> dict:
    """Format tool execution result for display to user.

    Args:
        chunks: List of DocumentChunk from tool execution

    Returns:
        Dictionary with formatted results including unique documents
    """
    # Extract unique documents for display
    seen_doc_ids = set()
    documents = []

    for chunk in chunks:
        if chunk.document.id not in seen_doc_ids:
            seen_doc_ids.add(chunk.document.id)
            documents.append(
                {
                    "id": chunk.document.id,
                    "title": chunk.document.title,
                    "url": chunk.document.url,
                    "source": chunk.document.source,
                }
            )

    return {
        "chunk_count": len(chunks),
        "document_count": len(documents),
        "documents": documents,
    }
