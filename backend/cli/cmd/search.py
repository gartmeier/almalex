import click

from app import crud
from app.db.session import SessionLocal


@click.command()
@click.argument("query")
@click.option("--top-k", default=10, help="Number of results to return.")
def search(query, top_k: int = 10):
    with SessionLocal() as db:
        results = crud.search(
            db=db,
            query=query,
            top_k=top_k,
        )
        for i, chunk in enumerate(results, 1):
            click.secho(chunk.document.title, fg="yellow", bold=True)
            click.secho(chunk.text, fg="white")
            click.echo()
