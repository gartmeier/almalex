import click
from IPython import embed
from sqlalchemy import select

from app.db.models import Act, Article
from app.db.session import SessionLocal


@click.command()
def shell():
    session = SessionLocal()

    namespace = {
        "session": session,
        "select": select,
        "Act": Act,
        "Article": Article,
    }

    try:
        embed(user_ns=namespace)
    finally:
        session.close()
