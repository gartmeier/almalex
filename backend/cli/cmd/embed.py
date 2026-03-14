import click

from app.db.session import SessionLocal
from cli.utils.embedding import embed_missing_chunks


@click.command(name="embed")
def embed_command():
    with SessionLocal() as db:
        embed_missing_chunks(db)
