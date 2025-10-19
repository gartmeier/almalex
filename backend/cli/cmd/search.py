import click

from app.crud.search import search as search_func
from app.db.session import SessionLocal


@click.command()
@click.argument("query")
@click.option("--top-k", default=20, help="Number of results to return.")
def search(query, top_k: int = 20):
    with SessionLocal() as db:
        results = search_func(
            db=db,
            query=query,
            top_k=top_k,
        )
        for i, chunk in enumerate(results, 1):
            click.secho(chunk.document.title, fg="yellow", bold=True)
            click.secho(chunk.text, fg="white")
            click.echo()
