"""decision model and rename article_chunk to chunk

Revision ID: 0ff29808da67
Revises: a1b2c3d4e5f6
Create Date: 2026-02-24

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "0ff29808da67"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- Create decision table ---
    op.create_table(
        "decision",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("lang", sa.String(), nullable=False),
        sa.Column("court", sa.String(), nullable=False),
        sa.Column("reference", sa.String(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("html_url", sa.String(), nullable=False),
        sa.Column("source_url", sa.String(), nullable=True),
        sa.Column("text", sa.String(), nullable=True),
        sa.Column("regeste", sa.String(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("court", "reference", name="uq_decision_court_reference"),
    )
    op.create_index(op.f("ix_decision_lang"), "decision", ["lang"])
    op.create_index(op.f("ix_decision_court"), "decision", ["court"])

    # --- Create decision_sync_state ---
    op.create_table(
        "decision_sync_state",
        sa.Column("court", sa.String(), nullable=False),
        sa.Column("last_job_sequence", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("court"),
    )

    # --- Rename article_chunk → chunk ---
    op.rename_table("article_chunk", "chunk")

    # Rename indexes
    op.execute("ALTER INDEX ix_article_chunk_article_id RENAME TO ix_chunk_article_id")
    op.execute("ALTER INDEX idx_article_chunk_tsv RENAME TO idx_chunk_tsv")

    # Add source_type with backfill
    op.add_column("chunk", sa.Column("source_type", sa.String(), nullable=True))
    op.execute("UPDATE chunk SET source_type = 'article'")
    op.alter_column("chunk", "source_type", nullable=False)

    # Make article_id nullable
    op.alter_column("chunk", "article_id", existing_type=sa.Integer(), nullable=True)

    # Add decision_id FK
    op.add_column(
        "chunk",
        sa.Column("decision_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_chunk_decision_id",
        "chunk",
        "decision",
        ["decision_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_index(op.f("ix_chunk_decision_id"), "chunk", ["decision_id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_chunk_decision_id"), table_name="chunk")
    op.drop_constraint("fk_chunk_decision_id", "chunk", type_="foreignkey")
    op.drop_column("chunk", "decision_id")

    op.alter_column("chunk", "article_id", existing_type=sa.Integer(), nullable=False)
    op.drop_column("chunk", "source_type")

    op.execute("ALTER INDEX idx_chunk_tsv RENAME TO idx_article_chunk_tsv")
    op.execute("ALTER INDEX ix_chunk_article_id RENAME TO ix_article_chunk_article_id")

    op.rename_table("chunk", "article_chunk")

    op.drop_table("decision_sync_state")

    op.drop_index(op.f("ix_decision_court"), table_name="decision")
    op.drop_index(op.f("ix_decision_lang"), table_name="decision")
    op.drop_table("decision")
