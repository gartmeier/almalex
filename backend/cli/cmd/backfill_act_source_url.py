import click
from sqlalchemy import select

from app.db.models import Act
from app.db.session import SessionLocal
from cli.utils import sparql


@click.command(name="backfill-act-source-url")
@click.option("--lang", default="de", show_default=True)
@click.option("--sr-number")
@click.option("--force", is_flag=True, default=False)
def backfill_source_url(lang: str, sr_number: str | None, force: bool):
    with SessionLocal() as db:
        q = select(Act).where(Act.lang == lang)
        if not force:
            q = q.where(Act.source_url.is_(None))
        if sr_number:
            q = q.where(Act.sr_number == sr_number)

        acts = db.scalars(q).all()
        click.echo(f"Found {len(acts)} acts missing source_url")

        if not acts:
            click.secho("Nothing to backfill", fg="green")
            return

        rows = sparql.fetch_all(lang, sr_number)
        row_map = {(row.sr_number, row.applicability_date): row for row in rows}

        updated = 0
        for act in acts:
            key = (act.sr_number, str(act.applicability_date))
            row = row_map.get(key)

            if not row:
                click.echo(f"  {act.label}: not found in Fedlex")
                continue

            act.source_url = row.source_url
            updated += 1
            click.echo(f"  {act.label}: updated")

        db.commit()
        click.secho(f"Updated {updated} acts", fg="green")
