"""init

Revision ID: e3d01afb9bab
Revises:
Create Date: 2026-02-26 11:50:26.122671

"""

from typing import Sequence, Union

import sqlalchemy as sa
from pgvector.sqlalchemy.vector import VECTOR
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e3d01afb9bab"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
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
        sa.Column("generate_context", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("sr_number"),
    )
    op.create_table(
        "chat",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_chat_created_at"), "chat", ["created_at"], unique=False)
    op.create_index(op.f("ix_chat_title"), "chat", ["title"], unique=False)
    op.create_index(op.f("ix_chat_updated_at"), "chat", ["updated_at"], unique=False)
    op.create_table(
        "decision",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("lang", sa.String(), nullable=False),
        sa.Column("spider", sa.String(), nullable=False),
        sa.Column("number", sa.String(), nullable=False),
        sa.Column("title", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("html_url", sa.String(), nullable=True),
        sa.Column("pdf_url", sa.String(), nullable=True),
        sa.Column("date", sa.Date(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("spider", "number"),
    )
    op.create_index(op.f("ix_decision_lang"), "decision", ["lang"], unique=False)
    op.create_index(op.f("ix_decision_spider"), "decision", ["spider"], unique=False)
    op.create_table(
        "article",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("act_id", sa.Integer(), nullable=False),
        sa.Column("eid", sa.String(), nullable=False),
        sa.Column("number", sa.String(), nullable=False),
        sa.Column("html", sa.String(), nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["act_id"], ["act.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_article_act_id"), "article", ["act_id"], unique=False)
    op.create_index(
        op.f("ix_article_sort_order"), "article", ["sort_order"], unique=False
    )
    op.create_table(
        "chat_message",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("chat_id", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("content", sa.String(), nullable=False),
        sa.Column(
            "content_blocks", postgresql.JSONB(astext_type=sa.Text()), nullable=False
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["chat_id"], ["chat.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_chat_message_chat_id"), "chat_message", ["chat_id"], unique=False
    )
    op.create_index(
        op.f("ix_chat_message_created_at"), "chat_message", ["created_at"], unique=False
    )
    op.create_table(
        "decision_file",
        sa.Column("file", sa.String(), nullable=False),
        sa.Column("spider", sa.String(), nullable=False),
        sa.Column("checksum", sa.String(), nullable=True),
        sa.Column("decision_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["decision_id"], ["decision.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("file"),
    )
    op.create_index(
        op.f("ix_decision_file_spider"), "decision_file", ["spider"], unique=False
    )
    op.create_table(
        "chunk",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("source_type", sa.String(), nullable=False),
        sa.Column("article_id", sa.Integer(), nullable=True),
        sa.Column("decision_id", sa.Integer(), nullable=True),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("context", sa.String(), nullable=True),
        sa.Column("embedding_input", sa.String(), nullable=True),
        sa.Column("embedding", VECTOR(dim=3584), nullable=True),
        sa.Column(
            "search_vector",
            postgresql.TSVECTOR(),
            sa.Computed("to_tsvector('simple', text)", persisted=True),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["article_id"], ["article.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["decision_id"], ["decision.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "idx_chunk_tsv",
        "chunk",
        ["search_vector"],
        unique=False,
        postgresql_using="gin",
    )
    op.create_index(op.f("ix_chunk_article_id"), "chunk", ["article_id"], unique=False)
    op.create_index(
        op.f("ix_chunk_decision_id"), "chunk", ["decision_id"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_chunk_decision_id"), table_name="chunk")
    op.drop_index(op.f("ix_chunk_article_id"), table_name="chunk")
    op.drop_index("idx_chunk_tsv", table_name="chunk", postgresql_using="gin")
    op.drop_table("chunk")
    op.drop_index(op.f("ix_decision_file_spider"), table_name="decision_file")
    op.drop_table("decision_file")
    op.drop_index(op.f("ix_chat_message_created_at"), table_name="chat_message")
    op.drop_index(op.f("ix_chat_message_chat_id"), table_name="chat_message")
    op.drop_table("chat_message")
    op.drop_index(op.f("ix_article_sort_order"), table_name="article")
    op.drop_index(op.f("ix_article_act_id"), table_name="article")
    op.drop_table("article")
    op.drop_index(op.f("ix_decision_spider"), table_name="decision")
    op.drop_index(op.f("ix_decision_lang"), table_name="decision")
    op.drop_table("decision")
    op.drop_index(op.f("ix_chat_updated_at"), table_name="chat")
    op.drop_index(op.f("ix_chat_title"), table_name="chat")
    op.drop_index(op.f("ix_chat_created_at"), table_name="chat")
    op.drop_table("chat")
    op.drop_table("act_config")
    op.drop_index(op.f("ix_act_sr_number"), table_name="act")
    op.drop_index(op.f("ix_act_lang"), table_name="act")
    op.drop_table("act")
    op.execute("DROP EXTENSION IF EXISTS vector")
