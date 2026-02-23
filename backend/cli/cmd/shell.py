import click
from IPython import embed
from sqlalchemy import select

from app.db.models import Act, Article, Chat, ChatMessage
from app.db.session import SessionLocal


@click.command()
def shell():
    session = SessionLocal()

    namespace = {
        "session": session,
        "select": select,
        "Act": Act,
        "Article": Article,
        "Chat": Chat,
        "ChatMessage": ChatMessage,
    }

    try:
        embed(user_ns=namespace)
    finally:
        session.close()
