"""rename tsv column, add context

Revision ID: 7daaf3f9442f
Revises: h3i4j5k6l7m8
Create Date: 2026-02-23 10:18:24.243865

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "7daaf3f9442f"
down_revision: Union[str, None] = "h3i4j5k6l7m8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_index(op.f("ix_acts_lang"), table_name="act")
    op.drop_index(op.f("ix_acts_sr_number"), table_name="act")
    op.create_index(op.f("ix_act_lang"), "act", ["lang"], unique=False)
    op.create_index(op.f("ix_act_sr_number"), "act", ["sr_number"], unique=False)
    op.alter_column(
        "article",
        "html",
        existing_type=sa.TEXT(),
        type_=sa.String(),
        existing_nullable=False,
    )
    op.drop_index(op.f("ix_articles_act_id"), table_name="article")
    op.drop_index(op.f("ix_articles_sort_order"), table_name="article")
    op.create_index(op.f("ix_article_act_id"), "article", ["act_id"], unique=False)
    op.create_index(
        op.f("ix_article_sort_order"), "article", ["sort_order"], unique=False
    )
    # drop old GIN index and generated column before altering text
    op.drop_index(
        op.f("idx_article_chunk_tsv"),
        table_name="article_chunk",
        postgresql_using="gin",
    )
    op.drop_column("article_chunk", "text_search_vector")
    op.drop_index(op.f("ix_article_embedding_article_id"), table_name="article_chunk")
    op.alter_column(
        "article_chunk",
        "text",
        existing_type=sa.TEXT(),
        type_=sa.String(),
        existing_nullable=False,
    )
    op.add_column("article_chunk", sa.Column("context", sa.String(), nullable=True))
    op.add_column(
        "article_chunk",
        sa.Column(
            "search_vector",
            postgresql.TSVECTOR(),
            sa.Computed("to_tsvector('simple', text)", persisted=True),
            nullable=True,
        ),
    )
    op.create_index(
        "idx_article_chunk_tsv",
        "article_chunk",
        ["search_vector"],
        unique=False,
        postgresql_using="gin",
    )
    op.create_index(
        op.f("ix_article_chunk_article_id"),
        "article_chunk",
        ["article_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_article_chunk_article_id"), table_name="article_chunk")
    op.drop_index(
        "idx_article_chunk_tsv", table_name="article_chunk", postgresql_using="gin"
    )
    op.drop_column("article_chunk", "search_vector")
    op.drop_column("article_chunk", "context")
    op.alter_column(
        "article_chunk",
        "text",
        existing_type=sa.String(),
        type_=sa.TEXT(),
        existing_nullable=False,
    )
    op.add_column(
        "article_chunk",
        sa.Column(
            "text_search_vector",
            postgresql.TSVECTOR(),
            sa.Computed("to_tsvector('simple'::regconfig, text)", persisted=True),
            autoincrement=False,
            nullable=True,
        ),
    )
    op.create_index(
        op.f("idx_article_chunk_tsv"),
        "article_chunk",
        ["text_search_vector"],
        unique=False,
        postgresql_using="gin",
    )
    op.create_index(
        op.f("ix_article_embedding_article_id"),
        "article_chunk",
        ["article_id"],
        unique=False,
    )
    op.drop_index(op.f("ix_article_sort_order"), table_name="article")
    op.drop_index(op.f("ix_article_act_id"), table_name="article")
    op.create_index(
        op.f("ix_articles_sort_order"), "article", ["sort_order"], unique=False
    )
    op.create_index(op.f("ix_articles_act_id"), "article", ["act_id"], unique=False)
    op.alter_column(
        "article",
        "html",
        existing_type=sa.String(),
        type_=sa.TEXT(),
        existing_nullable=False,
    )
    op.drop_index(op.f("ix_act_sr_number"), table_name="act")
    op.drop_index(op.f("ix_act_lang"), table_name="act")
    op.create_index(op.f("ix_acts_sr_number"), "act", ["sr_number"], unique=False)
    op.create_index(op.f("ix_acts_lang"), "act", ["lang"], unique=False)
