import click
import requests
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Chunk, Decision, DecisionSyncState
from app.db.session import SessionLocal
from cli.utils.embedding import embed_chunks
from cli.utils.html import fetch_html
from cli.utils.pdf import fetch_pdf_text
from cli.utils.text import normalize_text, split_text

BASE_URL = "https://entscheidsuche.ch/docs"


@click.command(name="load-entscheidsuche")
@click.option("--court", default="CH_BGE", show_default=True)
@click.option("--force", is_flag=True, default=False)
def load_entscheidsuche_command(court: str, force: bool):
    with SessionLocal() as db:
        load_entscheidsuche(db, court, force=force)


def load_entscheidsuche(db: Session, court: str, *, force: bool = False):
    facets = _fetch_json("Facetten_alle.json")
    click.echo(f"Court: {court}")

    sync = db.get(DecisionSyncState, court)
    last_seq = sync.last_job_sequence if sync else None
    click.echo(f"Last job sequence: {last_seq}")

    last_job = _fetch_json(f"Jobs/{court}/last")
    all_chunks: list[Chunk] = []
    processed = 0

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
            chunks = _process_decision(db, court, facets, file_path, force=force)
            all_chunks += chunks
            if chunks:
                processed += 1
                if processed >= 100:  # TODO: remove temp limit
                    break
        except Exception as e:
            db.rollback()
            click.secho(f"  Error {file_path}: {e}", fg="yellow")

    if all_chunks:
        db.commit()
        embed_chunks(all_chunks)
        db.commit()

    job_seq = last_job.get("sequence")
    if job_seq is not None:
        sync = db.get(DecisionSyncState, court) or DecisionSyncState(court=court)
        sync.last_job_sequence = job_seq
        db.merge(sync)
        db.commit()

    click.secho("Done", fg="green")


def _process_decision(
    db: Session, court: str, facets: dict, file_path: str, *, force: bool = False
) -> list[Chunk]:
    metadata = _fetch_json(file_path)
    reference = metadata["Num"][0]

    existing = db.scalar(
        select(Decision).where(Decision.court == court, Decision.reference == reference)
    )
    if existing and not force:
        return []
    if existing:
        db.delete(existing)
        db.flush()

    date_str = metadata["Datum"]
    year = date_str.split("-")[0]
    lang = metadata["Sprache"]
    title = f"{reference} ({year})"
    click.echo(f"  Processing: {title}")

    signatur = metadata.get("Signatur", court)
    header = _build_header(facets, signatur, title, lang)
    headline = _extract_headline(metadata)

    html_url = None
    pdf_url = None

    if "HTML" in metadata:
        html_url = f"{BASE_URL}/{metadata['HTML']['Datei']}"
        soup = fetch_html(html_url)
        text = normalize_text(soup.get_text())
    elif "PDF" in metadata:
        pdf_url = f"{BASE_URL}/{metadata['PDF']['Datei']}"
        text = normalize_text(fetch_pdf_text(pdf_url))
    else:
        click.secho(f"  Skipping {reference}: no HTML or PDF", fg="yellow")
        return []

    decision = Decision(
        lang=lang,
        court=court,
        reference=reference,
        date=date_str,
        title=title,
        html_url=html_url,
        pdf_url=pdf_url,
        text=text,
        chamber=signatur if signatur != court else None,
        headline=headline,
    )
    db.add(decision)
    db.flush()

    chunks = []
    for chunk_text in split_text(text):
        embedding_input = f"{header}\n\n{chunk_text}"
        chunk = Chunk(
            source_type="decision",
            decision_id=decision.id,
            text=chunk_text,
            embedding_input=embedding_input,
        )
        db.add(chunk)
        chunks.append(chunk)

    db.flush()
    return chunks


def _build_header(facets: dict, signatur: str, title: str, lang: str) -> str:
    canton = signatur.split("_")[0]
    for court_key, court_info in facets.get(canton, {}).get("gerichte", {}).items():
        if signatur in court_info.get("kammern", {}):
            gericht = court_info.get(lang, court_key)
            kammer = court_info["kammern"][signatur].get(lang, "")
            parts = [p for p in (gericht, kammer, title) if p]
            return " ".join(parts)
    return title


def _extract_headline(metadata: dict) -> dict:
    kopfzeile = metadata.get("Kopfzeile", {})
    return {k: v for k, v in kopfzeile.items() if k in ("de", "fr", "it") and v}


def _fetch_json(path: str):
    response = requests.get(f"{BASE_URL}/{path}")
    response.raise_for_status()
    return response.json()
