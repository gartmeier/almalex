from typing import Sequence

from app.db.models import DocumentChunk


def format_chunks(chunks: Sequence[DocumentChunk]) -> str:
    """Format chunks for prompt context."""
    context = ""

    for chunk in chunks:
        context += f"""\
ID: {chunk.document.id}
Title: {chunk.document.title}
Content: {chunk.text}
---
"""

    return context.strip()
