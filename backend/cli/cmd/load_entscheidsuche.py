import re
from html import unescape

import click
import openai
import requests
from sqlalchemy import select
from sqlalchemy.orm import Session
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.core.clients import openai_client
from app.core.config import settings
from app.db.models import Chunk, Decision, DecisionSyncState
from app.db.session import SessionLocal
from cli.utils.html import fetch_html
from cli.utils.text import normalize_text, split_text

BASE_URL = "https://entscheidsuche.ch/docs"


@click.command(name="load-entscheidsuche")
@click.option("--court", default="CH_BGE", show_default=True)
def load_entscheidsuche_command(court: str):
    with SessionLocal() as db:
        load_entscheidsuche(db, court)


def load_entscheidsuche(db: Session, court: str):
    court_name = _fetch_court_name(court)
    click.echo(f"Court: {court_name}")

    sync = db.get(DecisionSyncState, court)
    last_seq = sync.last_job_sequence if sync else None
    click.echo(f"Last job sequence: {last_seq}")

    last_job = _fetch_json(f"Jobs/{court}/last")

    for file_path, file_info in last_job["dateien"].items():
        if not file_path.endswith(".json"):
            continue

        if "last_change" in file_info:
            file_seq = int(file_info["last_change"].split("/")[-1])
            if last_seq is not None and file_seq <= last_seq:
                continue
        elif file_info.get("status") != "update":
            continue

        try:
            _process_decision(db, court, court_name, file_path)
        except Exception as e:
            db.rollback()
            click.secho(f"  Error {file_path}: {e}", fg="yellow")

    # Update sync state
    job_seq = last_job.get("sequence")
    if job_seq is not None:
        sync = db.get(DecisionSyncState, court) or DecisionSyncState(court=court)
        sync.last_job_sequence = job_seq
        db.merge(sync)
        db.commit()

    click.secho("Done", fg="green")


def _process_decision(db: Session, court: str, court_name: str, file_path: str):
    metadata = _fetch_json(file_path)
    reference = metadata["Num"][0]
    date_str = metadata["Datum"]
    year = date_str.split("-")[0]
    lang = metadata["Sprache"]
    title = f"{reference} ({year})"

    html_url = f"{BASE_URL}/{metadata['HTML']['Datei']}"
    source_url = metadata["HTML"].get("URL")

    regeste = _extract_regeste(metadata, lang)

    # Fetch and normalize full text
    soup = fetch_html(html_url)
    text = normalize_text(soup.get_text())

    # Upsert: delete existing then recreate
    existing = db.scalar(
        select(Decision).where(Decision.court == court, Decision.reference == reference)
    )
    if existing:
        click.echo(f"  Updating: {title}")
        db.delete(existing)
        db.flush()
    else:
        click.echo(f"  Processing: {title}")

    decision = Decision(
        lang=lang,
        court=court,
        reference=reference,
        date=date_str,
        title=title,
        html_url=html_url,
        source_url=source_url,
        text=text,
        regeste=regeste,
    )
    db.add(decision)
    db.flush()

    # Create chunks
    chunks = []
    for chunk_text in split_text(text):
        regeste_section = f"\n\n{regeste}\n\n" if regeste else "\n\n"
        embedding_input = f"[{court_name} | {title}]{regeste_section}{chunk_text}"
        chunk = Chunk(
            source_type="decision",
            decision_id=decision.id,
            text=chunk_text,
            embedding_input=embedding_input,
        )
        db.add(chunk)
        chunks.append(chunk)

    db.flush()

    # Embed
    _embed_chunks(chunks)
    db.commit()


def _extract_regeste(metadata: dict, lang: str) -> str | None:
    abstracts = metadata.get("Abstract", [])
    for abstract in abstracts:
        if abstract.get("Sprache") == lang:
            raw = abstract.get("Text", "")
            return _strip_html(raw) if raw else None
    # Fallback: first abstract
    if abstracts:
        raw = abstracts[0].get("Text", "")
        return _strip_html(raw) if raw else None
    return None


def _strip_html(html: str) -> str:
    text = re.sub(r"<[^>]+>", "", html)
    return unescape(text).strip()


def _embed_chunks(chunks: list[Chunk]):
    batch_size = 99
    batches = [chunks[i : i + batch_size] for i in range(0, len(chunks), batch_size)]
    with click.progressbar(batches, label="    embed") as bar:
        for batch in bar:
            response = _create_embedding([c.embedding_input for c in batch])
            for chunk, data in zip(batch, response.data):
                chunk.embedding = data.embedding


@retry(
    retry=retry_if_exception_type(openai.RateLimitError),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    stop=stop_after_attempt(6),
)
def _create_embedding(input_: list[str]):
    return openai_client.embeddings.create(
        model=settings.openai_embedding_model,
        input=input_,
    )


def _fetch_court_name(court: str, lang: str = "de") -> str:
    facets = _fetch_json("Facetten_alle.json")
    canton = court.split("_")[0]
    try:
        return facets["data"][canton]["gerichte"][court][lang]
    except KeyError:
        return court


def _fetch_json(path: str):
    response = requests.get(f"{BASE_URL}/{path}")
    response.raise_for_status()
    return response.json()
