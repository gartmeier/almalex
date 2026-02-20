import anthropic
import click
from openai import OpenAI
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import Document, DocumentChunk

_anthropic = anthropic.Anthropic(api_key=settings.anthropic_api_key)
_openai = OpenAI(
    api_key=settings.infomaniak_api_key,
    base_url=f"https://api.infomaniak.com/1/ai/{settings.infomaniak_embedding_product_id}/openai/v1",
)

_CONTEXT_PROMPT = """\
<document>
{document_text}
</document>
Here is the chunk we want to situate within the whole document:
<chunk>
{chunk_text}
</chunk>
Please give a short succinct context to situate this chunk within the overall document for the purposes of improving search retrieval of the chunk. Answer only with the succinct context and nothing else."""


def generate_context(document_text: str, chunk_text: str) -> str:
    response = _anthropic.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=200,
        messages=[
            {
                "role": "user",
                "content": _CONTEXT_PROMPT.format(
                    document_text=document_text, chunk_text=chunk_text
                ),
            }
        ],
    )
    return response.content[0].text  # type: ignore


def create_embeddings(db: Session):
    _generate_contexts(db)
    _embed_chunks(db)


def _generate_contexts(db: Session):
    chunks = (
        db.query(DocumentChunk)
        .join(Document)
        .filter(DocumentChunk.context.is_(None))
        .order_by(DocumentChunk.document_id, DocumentChunk.order)
        .all()
    )

    if not chunks:
        click.echo("No chunks without context found")
        return

    click.echo(f"Generating context for {len(chunks)} chunks")

    # Group chunks by document
    docs: dict[int, list[DocumentChunk]] = {}
    for chunk in chunks:
        docs.setdefault(chunk.document_id, []).append(chunk)

    processed = 0
    for doc_chunks in docs.values():
        document_text = "\n\n".join(c.text for c in doc_chunks)
        for chunk in doc_chunks:
            chunk.context = generate_context(document_text, chunk.text)
            processed += 1

        db.commit()
        click.echo(f"  Context: {processed}/{len(chunks)} chunks")

    click.secho(f"Generated context for {len(chunks)} chunks", fg="green")


def _embed_chunks(db: Session):
    chunks = (
        db.query(DocumentChunk)
        .join(Document)
        .filter(DocumentChunk.embedding.is_(None))
        .order_by(DocumentChunk.id)
        .all()
    )

    if not chunks:
        click.echo("No chunks without embeddings found")
        return

    click.echo(f"Creating embeddings for {len(chunks)} chunks")

    batch_size = 100

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        texts = [f"{c.context}\n\n{c.text}" if c.context else c.text for c in batch]

        response = _openai.embeddings.create(
            input=texts,
            model=settings.infomaniak_embedding_model,
        )

        for chunk, embedding_data in zip(batch, response.data):
            chunk.embedding = embedding_data.embedding

        db.commit()
        click.echo(f"  Embedded {i + len(batch)}/{len(chunks)} chunks")

    click.secho(f"Created {len(chunks)} embeddings", fg="green")
