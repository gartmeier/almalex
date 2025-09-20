"""Command to delete chats older than 30 days."""

from datetime import datetime, timedelta, timezone

import click
from sqlalchemy import delete

from app.db.models import Chat
from app.db.session import SessionLocal


@click.command()
@click.option(
    "--days",
    default=30,
    help="Delete chats older than this many days (default: 30)",
)
@click.option(
    "--dry-run",
    is_flag=True,
    help="Show what would be deleted without actually deleting",
)
def cleanup_chats(days: int, dry_run: bool):
    """Delete chats older than specified days (default: 30)."""
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)

    with SessionLocal() as session:
        # Count chats to be deleted
        old_chats = session.query(Chat).filter(Chat.created_at < cutoff_date).all()
        count = len(old_chats)

        if count == 0:
            click.echo(f"No chats older than {days} days found.")
            return

        if dry_run:
            click.echo(f"[DRY RUN] Would delete {count} chats older than {days} days:")
            for chat in old_chats[:10]:  # Show first 10
                click.echo(f"  - Chat {chat.id} created at {chat.created_at}")
            if count > 10:
                click.echo(f"  ... and {count - 10} more")
        else:
            click.echo(f"Deleting {count} chats older than {days} days...")

            # Delete old chats (cascade will handle messages)
            stmt = delete(Chat).where(Chat.created_at < cutoff_date)
            result = session.execute(stmt)
            session.commit()

            click.echo(f"Successfully deleted {result.rowcount} chats.")
