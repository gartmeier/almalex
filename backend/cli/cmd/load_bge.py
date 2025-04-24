from pathlib import Path

import click
import requests
from bs4 import BeautifulSoup

from app.db.models import Document, DocumentChunk
from app.db.session import SessionLocal
from cli.utils.text import normalize_text, split_text


@click.command()
def load_bge():
    db = SessionLocal()

    last_job = fetch_json("Jobs/CH_BGE/last")
    files = last_job["dateien"]

    for file_path in files:
        if Path(file_path).suffix != ".json":
            continue

        click.echo(f"Processing file: {file_path}")

        data = fetch_json(file_path)
        number = data["Num"][0]
        year = data["Datum"].split("-")[0]
        title = f"{number} ({year})"
        language = data["Sprache"]

        document = Document(
            source="bge",
            title=title,
            language=language,
            metadata=data,
        )
        db.add(document)
        db.commit()

        path = data["HTML"]["Datei"]
        url = f"https://entscheidsuche.ch/docs/{path}"
        response = requests.get(url)
        response.raise_for_status()
        response.encoding = response.apparent_encoding
        html = response.text

        soup = BeautifulSoup(html, "html.parser")
        text = normalize_text(soup.get_text())
        text_chunks = split_text(text)

        for chunk_index, chunk_text in enumerate(text_chunks):
            chunk = DocumentChunk(
                document_id=document.id,
                text=chunk_text.strip(),
                order=chunk_index,
            )
            db.add(chunk)
        db.commit()


def fetch_json(path):
    url = f"https://entscheidsuche.ch/docs/{path}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
