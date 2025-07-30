import click
from sqlalchemy import select

from app.ai.service import create_embedding, generate_text
from app.db.models import Document, DocumentChunk
from app.db.session import SessionLocal


@click.command()
@click.argument("question")
def prompt(question):
    with SessionLocal() as db:
        question_embedding = create_embedding(question)

        context_chunks = db.execute(
            select(Document.title, DocumentChunk.text)
            .join(DocumentChunk)
            .order_by(DocumentChunk.embedding.l2_distance(question_embedding))
            .limit(10)
        ).all()

        formatted_context = format_chunks(context_chunks)
        chat_messages = [
            {
                "role": "developer",
                "content": f"Answer based on this context:\n\n{formatted_context}",
            },
            {
                "role": "user",
                "content": question,
            },
        ]
        chat_response = generate_text(chat_messages)

        for response_chunk in chat_response:
            click.echo(response_chunk, nl=False)

        click.echo()


def format_chunks(chunks):
    return "\n\n".join(format_chunk(*chunk) for chunk in chunks)


def format_chunk(document_title, chunk_text):
    return f"# {document_title}\n\n{chunk_text}"
