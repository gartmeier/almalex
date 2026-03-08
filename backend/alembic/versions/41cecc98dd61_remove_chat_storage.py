"""remove chat storage

Revision ID: 41cecc98dd61
Revises: 5914108014f1
Create Date: 2026-03-08 20:39:42.659370

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "41cecc98dd61"
down_revision: Union[str, None] = "5914108014f1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_index(op.f("ix_chat_message_chat_id"), table_name="chat_message")
    op.drop_index(op.f("ix_chat_message_created_at"), table_name="chat_message")
    op.drop_table("chat_message")
    op.drop_index(op.f("ix_chat_created_at"), table_name="chat")
    op.drop_index(op.f("ix_chat_title"), table_name="chat")
    op.drop_index(op.f("ix_chat_updated_at"), table_name="chat")
    op.drop_table("chat")


def downgrade() -> None:
    op.create_table(
        "chat",
        sa.Column("id", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column("title", sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="chat_pkey"),
        postgresql_ignore_search_path=False,
    )
    op.create_index(op.f("ix_chat_updated_at"), "chat", ["updated_at"], unique=False)
    op.create_index(op.f("ix_chat_title"), "chat", ["title"], unique=False)
    op.create_index(op.f("ix_chat_created_at"), "chat", ["created_at"], unique=False)
    op.create_table(
        "chat_message",
        sa.Column("id", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column("chat_id", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column("role", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column("content", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column(
            "content_blocks",
            postgresql.JSONB(astext_type=sa.Text()),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["chat_id"],
            ["chat.id"],
            name=op.f("chat_message_chat_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("chat_message_pkey")),
    )
    op.create_index(
        op.f("ix_chat_message_created_at"), "chat_message", ["created_at"], unique=False
    )
    op.create_index(
        op.f("ix_chat_message_chat_id"), "chat_message", ["chat_id"], unique=False
    )
