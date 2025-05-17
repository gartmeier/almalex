from typing import Sequence, Union

import sqlalchemy as sa
from pgvector.sqlalchemy.vector import VECTOR
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "9d7e73fef937"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "chat",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_chat_created_at"), "chat", ["created_at"], unique=False)
    op.create_index(op.f("ix_chat_title"), "chat", ["title"], unique=False)
    op.create_index(op.f("ix_chat_updated_at"), "chat", ["updated_at"], unique=False)
    op.create_index(op.f("ix_chat_user_id"), "chat", ["user_id"], unique=False)
    op.create_table(
        "document",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("source", sa.String(), nullable=False),
        sa.Column("language", sa.String(), nullable=False),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_document_language"), "document", ["language"], unique=False
    )
    op.create_index(op.f("ix_document_source"), "document", ["source"], unique=False)
    op.create_table(
        "chat_message",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("chat_id", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("content", sa.String(), nullable=False),
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
        "document_chunk",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("document_id", sa.Integer(), nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.Column("embedding", VECTOR(dim=1536), nullable=True),
        sa.ForeignKeyConstraint(["document_id"], ["document.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_document_chunk_document_id"),
        "document_chunk",
        ["document_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_document_chunk_order"), "document_chunk", ["order"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_document_chunk_order"), table_name="document_chunk")
    op.drop_index(op.f("ix_document_chunk_document_id"), table_name="document_chunk")
    op.drop_table("document_chunk")
    op.drop_index(op.f("ix_chat_message_created_at"), table_name="chat_message")
    op.drop_index(op.f("ix_chat_message_chat_id"), table_name="chat_message")
    op.drop_table("chat_message")
    op.drop_index(op.f("ix_document_source"), table_name="document")
    op.drop_index(op.f("ix_document_language"), table_name="document")
    op.drop_table("document")
    op.drop_index(op.f("ix_chat_user_id"), table_name="chat")
    op.drop_index(op.f("ix_chat_updated_at"), table_name="chat")
    op.drop_index(op.f("ix_chat_title"), table_name="chat")
    op.drop_index(op.f("ix_chat_created_at"), table_name="chat")
    op.drop_table("chat")
