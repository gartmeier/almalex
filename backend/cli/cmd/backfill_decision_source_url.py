import click
from sqlalchemy import func, select

from app.db.models import Decision, DecisionFile
from app.db.session import SessionLocal
from cli.utils.http import fetch_json

BASE_URL = "https://entscheidsuche.ch/docs"


@click.command(name="backfill-decision-source-url")
@click.option("--spider", default=None)
@click.option("--force", is_flag=True, default=False)
@click.option("--batch-size", default=100, show_default=True)
def backfill_decision_source_url(spider: str | None, force: bool, batch_size: int):
    with SessionLocal() as db:
        count_q = select(func.count(Decision.id)).join(
            DecisionFile, Decision.id == DecisionFile.decision_id
        )
        if not force:
            count_q = count_q.where(Decision.source_url.is_(None))
        if spider:
            count_q = count_q.where(Decision.spider == spider)

        total = db.scalar(count_q)
        click.echo(f"Found {total} decisions to process")

        if total == 0:
            click.secho("Nothing to backfill", fg="green")
            return

        q = select(Decision, DecisionFile.file).join(
            DecisionFile, Decision.id == DecisionFile.decision_id
        )
        if not force:
            q = q.where(Decision.source_url.is_(None))
        if spider:
            q = q.where(Decision.spider == spider)

        updated = 0
        processed = 0

        for decision, file_path in db.execute(q).yield_per(batch_size):
            processed += 1

            try:
                metadata = fetch_json(f"{BASE_URL}/{file_path}")
                source_url = metadata.get("HTML", {}).get("URL")

                if source_url:
                    decision.source_url = source_url
                    updated += 1
                    click.echo(f"  {decision.citation}: updated")
                else:
                    click.echo(f"  {decision.citation}: no URL found in metadata")
            except Exception as e:
                click.secho(f"  {decision.citation}: error - {e}", fg="yellow")

            if processed % batch_size == 0:
                db.commit()
                click.echo(f"Committed batch ({processed}/{total})")

        db.commit()
        click.secho(f"Updated {updated}/{total} decisions", fg="green")
