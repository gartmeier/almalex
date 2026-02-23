"""add act, article, article_chunk, act_config tables; update document_chunk

Revision ID: 30a276fa6f7a
Revises: ce68a9015a46
Create Date: 2026-02-23

"""

from typing import Sequence, Union

import sqlalchemy as sa
from pgvector.sqlalchemy.vector import VECTOR
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "30a276fa6f7a"
down_revision: Union[str, None] = "ce68a9015a46"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "act",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("lang", sa.String(), nullable=False),
        sa.Column("sr_number", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=True),
        sa.Column("abbr", sa.String(), nullable=True),
        sa.Column("html_url", sa.String(), nullable=False),
        sa.Column("xml_url", sa.String(), nullable=False),
        sa.Column("applicability_date", sa.Date(), nullable=False),
        sa.Column("applicability_end_date", sa.Date(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("sr_number", "lang", "applicability_date"),
    )
    op.create_index(op.f("ix_act_lang"), "act", ["lang"], unique=False)
    op.create_index(op.f("ix_act_sr_number"), "act", ["sr_number"], unique=False)

    op.create_table(
        "act_config",
        sa.Column("sr_number", sa.String(), nullable=False),
        sa.Column(
            "generate_context", sa.Boolean(), nullable=False, server_default="false"
        ),
        sa.PrimaryKeyConstraint("sr_number"),
    )

    op.create_table(
        "article",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("act_id", sa.Integer(), nullable=False),
        sa.Column("eid", sa.String(), nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("context", sa.String(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.Column("breadcrumb", sa.String(), nullable=True),
        sa.Column("html", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["act_id"], ["act.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_article_act_id"), "article", ["act_id"], unique=False)
    op.create_index(
        op.f("ix_article_sort_order"), "article", ["sort_order"], unique=False
    )

    op.create_table(
        "article_chunk",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("article_id", sa.Integer(), nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("embedding", VECTOR(dim=3584), nullable=True),
        sa.Column("context", sa.String(), nullable=True),
        sa.Column(
            "search_vector",
            postgresql.TSVECTOR(),
            sa.Computed("to_tsvector('simple', text)", persisted=True),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["article_id"], ["article.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "idx_article_chunk_tsv",
        "article_chunk",
        ["search_vector"],
        postgresql_using="gin",
    )
    op.create_index(
        op.f("ix_article_chunk_article_id"),
        "article_chunk",
        ["article_id"],
        unique=False,
    )

    op.add_column("document_chunk", sa.Column("context", sa.String(), nullable=True))
    op.alter_column(
        "document_chunk",
        "embedding",
        existing_type=VECTOR(dim=1536),
        type_=VECTOR(dim=3584),
        existing_nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "document_chunk",
        "embedding",
        existing_type=VECTOR(dim=3584),
        type_=VECTOR(dim=1536),
        existing_nullable=True,
    )
    op.drop_column("document_chunk", "context")
    op.drop_index(op.f("ix_article_chunk_article_id"), table_name="article_chunk")
    op.drop_index(
        "idx_article_chunk_tsv",
        table_name="article_chunk",
        postgresql_using="gin",
    )
    op.drop_table("article_chunk")
    op.drop_index(op.f("ix_article_sort_order"), table_name="article")
    op.drop_index(op.f("ix_article_act_id"), table_name="article")
    op.drop_table("article")
    op.drop_table("act_config")
    op.drop_index(op.f("ix_act_sr_number"), table_name="act")
    op.drop_index(op.f("ix_act_lang"), table_name="act")
    op.drop_table("act")
