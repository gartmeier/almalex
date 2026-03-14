from datetime import date

import click
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.db.models import Chunk, Decision, DecisionFile
from app.db.session import SessionLocal
from cli.utils.http import fetch_html_text, fetch_json, fetch_pdf_text
from cli.utils.text import normalize_text, split_text

BASE_URL = "https://entscheidsuche.ch/docs"


@click.command(name="load-entscheidsuche")
@click.option("--spider", default=None)
@click.option("--force", is_flag=True, default=False)
def load_entscheidsuche_command(spider: str, force: bool):
    with SessionLocal() as db:
        load_entscheidsuche(db, spider, force=force)


def load_entscheidsuche(db: Session, spider: str, *, force: bool = False):
    selected_spider = spider

    facets = fetch_json(f"{BASE_URL}/Facetten_alle.json")
    spiders = set()

    if selected_spider:
        spiders.add(selected_spider)
    else:
        for jurisdiction in facets:
            for court_name, court_data in facets[jurisdiction]["gerichte"].items():
                for chamber_name, chamber_data in court_data["kammern"].items():
                    spiders.add(chamber_data["spider"])

    for spider in spiders:
        click.echo(f"Spider: {spider}")

        try:
            last_job = fetch_json(f"{BASE_URL}/Jobs/{spider}/last")

            if force:
                db.execute(delete(DecisionFile).where(DecisionFile.spider == spider))
                db.execute(delete(Decision).where(Decision.spider == spider))
                db.flush()
                known_files = {}
            else:
                obsolete = []
                for file_path, file_info in last_job["dateien"].items():
                    if (
                        file_path.endswith(".json")
                        and file_info.get("status") == "nicht_mehr_da"
                    ):
                        obsolete.append(file_path)

                if obsolete:
                    db.execute(
                        delete(DecisionFile).where(DecisionFile.file.in_(obsolete))
                    )
                    db.flush()

                known_files = {
                    row[0]: row[1]
                    for row in db.execute(
                        select(DecisionFile.file, DecisionFile.checksum).where(
                            DecisionFile.spider == spider
                        )
                    ).all()
                }

            for file_path, file_info in last_job["dateien"].items():
                if not file_path.endswith(".json"):
                    continue

                if file_info.get("status") == "nicht_mehr_da":
                    continue

                checksum = file_info.get("checksum")
                if known_files.get(file_path) == checksum:
                    continue

                metadata = fetch_json(f"{BASE_URL}/{file_path}")
                decision = _process_decision(db, spider, facets, metadata)

                db.execute(
                    insert(DecisionFile)
                    .values(
                        file=file_path,
                        spider=spider,
                        checksum=checksum,
                        decision_id=decision.id if decision else None,
                    )
                    .on_conflict_do_update(
                        index_elements=["file"],
                        set_={
                            "checksum": checksum,
                            "decision_id": decision.id if decision else None,
                        },
                    )
                )
                db.commit()

            click.secho("Done", fg="green")
        except Exception as e:
            db.rollback()
            click.secho(f"Error {spider}: {repr(e)}", fg="yellow")


def _process_decision(
    db: Session, spider: str, facets: dict, metadata: dict
) -> Decision | None:
    number = metadata["Num"][0]
    lang = metadata.get("Sprache", "de")
    title = _extract_title(metadata)
    html_url = f"{BASE_URL}/{metadata['HTML']['Datei']}" if "HTML" in metadata else None
    pdf_url = f"{BASE_URL}/{metadata['PDF']['Datei']}" if "PDF" in metadata else None
    source_url = metadata.get("HTML", {}).get("URL") or metadata.get("PDF", {}).get(
        "URL"
    )

    try:
        date_ = date.fromisoformat(metadata["Datum"])
    except ValueError:
        click.secho(
            f"  Skipping {number}: invalid date {metadata['Datum']!r}", fg="yellow"
        )
        return None

    existing = db.execute(
        select(Decision).where(
            Decision.spider == spider,
            Decision.number == number,
            Decision.date == date_,
        )
    ).scalar_one_or_none()
    if existing:
        click.echo(f"  Skipping {number} ({date_.year}): already exists")
        return existing

    click.echo(f"  Processing: {number} ({date_.year})")

    if html_url:
        text = fetch_html_text(html_url)
    elif pdf_url:
        text = normalize_text(fetch_pdf_text(pdf_url))
    else:
        click.secho(f"  Skipping {number}: no HTML or PDF", fg="yellow")
        return None

    decision = Decision(
        lang=lang,
        spider=spider,
        number=number,
        title=title,
        text=text,
        source_url=source_url,
        html_url=html_url,
        pdf_url=pdf_url,
        date=date_,
    )
    db.add(decision)
    db.flush()

    chunks = []
    for chunk_text in split_text(text):
        chunk_body = f"{title[lang]}\n\n{chunk_text}"

        chunk = Chunk(
            source_type="decision",
            decision_id=decision.id,
            text=chunk_body,
            embedding_input=chunk_body,
        )
        chunks.append(chunk)

    db.add_all(chunks)
    db.flush()

    return decision


def _extract_title(metadata: dict) -> dict:
    result = {}

    for entry in metadata.get("Kopfzeile", []):
        for lang in entry["Sprachen"]:
            result[lang] = entry["Text"]

    return result
