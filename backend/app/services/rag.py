from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai.service import create_embedding
from app.db.models import Document, DocumentChunk

PROMPT = """\
Deine Aufgabe ist es, eine Abfrage für eine Vektor-Datenbank anhand einer Chat-Historie zu erstellen. Das Ziel ist eine 
Abfrage zu formulieren, die die relevantesten Gesetzesartikel und Gerichtsentscheide in der Datenbank findet.
"""


def get_relevant_context(db: Session, query: str, limit: int = 10) -> str:
    question_embedding = create_embedding(query)

    context_chunks = db.execute(
        select(Document.title, DocumentChunk.text)
        .join(DocumentChunk)
        .order_by(DocumentChunk.embedding.l2_distance(question_embedding))
        .limit(limit)
    ).all()

    if not context_chunks:
        return ""

    return format_chunks(context_chunks)


def format_chunks(chunks):
    return "\n\n".join(format_chunk(*chunk) for chunk in chunks)


def format_chunk(document_title, chunk_text):
    return f"# {document_title}\n\n{chunk_text}"
