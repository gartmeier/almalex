"""add article_embedding table and article tsv/embedded_at

Revision ID: e1f2a3b4c5d6
Revises: f3a2b1c4d5e6
Create Date: 2026-02-22

"""

from typing import Sequence, Union

import sqlalchemy as sa
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "e1f2a3b4c5d6"
down_revision: Union[str, None] = "f3a2b1c4d5e6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "articles", sa.Column("embedded_at", sa.DateTime(timezone=True), nullable=True)
    )
    op.add_column(
        "articles",
        sa.Column(
            "text_search_vector",
            postgresql.TSVECTOR(),
            sa.Computed("to_tsvector('simple', text)", persisted=True),
            nullable=True,
        ),
    )
    op.create_index(
        "idx_articles_text_search_vector",
        "articles",
        ["text_search_vector"],
        postgresql_using="gin",
    )

    op.create_table(
        "article_embedding",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "article_id",
            sa.Integer(),
            sa.ForeignKey("articles.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("embedding", Vector(3584), nullable=True),
        sa.Column(
            "text_search_vector",
            postgresql.TSVECTOR(),
            sa.Computed("to_tsvector('simple', text)", persisted=True),
            nullable=True,
        ),
    )
    op.create_index(
        "idx_article_embedding_tsv",
        "article_embedding",
        ["text_search_vector"],
        postgresql_using="gin",
    )


def downgrade() -> None:
    op.drop_index("idx_article_embedding_tsv", table_name="article_embedding")
    op.drop_table("article_embedding")
    op.drop_index("idx_articles_text_search_vector", table_name="articles")
    op.drop_column("articles", "text_search_vector")
    op.drop_column("articles", "embedded_at")
