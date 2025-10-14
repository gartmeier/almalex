from datetime import datetime, timedelta, timezone

import click

from app.db.session import SessionLocal
from cli.cmd.sync_bge import sync_bge
from cli.cmd.sync_fedlex import sync_fedlex
from cli.utils.embeddings import create_embeddings


@click.command()
@click.option("--since", help="Start date for sync (YYYY-MM-DD)")
def sync_all(since):
    with SessionLocal() as db:
        if since:
            since = datetime.strptime(since, "%Y-%m-%d")
        else:
            since = datetime.now(timezone.utc) - timedelta(days=1)

        since = since.date().isoformat()

        click.echo("=== Syncing Fedlex ===")
        sync_fedlex(db, since)

        click.echo("\n=== Syncing BGE ===")
        sync_bge(db)

        click.echo("\n=== Creating Embeddings ===")
        create_embeddings(db)

        click.secho("\n✓ All syncs completed successfully", fg="green")
