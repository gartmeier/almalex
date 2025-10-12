from pathlib import Path

import click
import requests
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Document, DocumentChunk
from app.db.session import SessionLocal
from cli.utils.text import normalize_text, split_text


@click.command()
def load_bge():
    db = SessionLocal()

    last_job_sequence = get_last_job_sequence(db)
    click.echo(f"Last processed job sequence: {last_job_sequence}")

    last_job = fetch_json("Jobs/CH_BGE/last")
    files = last_job["dateien"]

    for file_path, file_info in files.items():
        if Path(file_path).suffix != ".json":
            continue

        # Skip if already processed (last_change has job sequence in format "446973/47/2584")
        file_sequence = int(file_info["last_change"].split("/")[-1])
        if last_job_sequence is not None and file_sequence <= last_job_sequence:
            continue

        metadata = fetch_json(file_path)
        number = metadata["Num"][0]
        year = metadata["Datum"].split("-")[0]
        title = f"{number} ({year})"
        language = metadata["Sprache"]

        # Check if document already exists and delete it (will be re-imported with updates)
        existing = db.scalar(
            select(Document).where(
                Document.source == "bge",
                Document.title == title,
            )
        )
        if existing:
            click.echo(f"Updating: {title}")
            db.delete(existing)
            db.commit()
        else:
            click.echo(f"Processing: {title}")

        document = Document(
            source="bge",
            title=title,
            language=language,
            metadata_=metadata,
        )
        db.add(document)
        db.commit()

        path = metadata["HTML"]["Datei"]
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


def get_last_sync_date(db: Session) -> str | None:
    """Get most recent Datum from BGE documents using database ordering."""
    stmt = (
        select(Document.metadata_["Datum"].astext)
        .where(Document.source == "bge")
        .order_by(Document.metadata_["Datum"].astext.desc())
        .limit(1)
    )
    return db.scalar(stmt)


def get_last_job_id(db: Session) -> str | None:
    """Get the job ID with the highest sequence number."""
    # Get all job IDs
    stmt = (
        select(Document.metadata_["ScrapyJob"].astext)
        .where(Document.source == "bge")
        .where(Document.metadata_["ScrapyJob"].astext.isnot(None))
    )

    job_ids = db.scalars(stmt).all()

    if not job_ids:
        return None

    # Find the one with the highest sequence number
    return max(job_ids, key=lambda jid: int(jid.split("/")[-1]))


def get_last_job_sequence(db: Session) -> int | None:
    """Get just the sequence number."""
    job_id = get_last_job_id(db)
    return int(job_id.split("/")[-1]) if job_id else None


def fetch_json(path):
    url = f"https://entscheidsuche.ch/docs/{path}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
