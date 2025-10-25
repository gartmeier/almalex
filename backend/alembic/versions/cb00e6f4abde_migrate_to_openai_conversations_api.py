"""migrate to openai conversations api

Revision ID: cb00e6f4abde
Revises: ce68a9015a46
Create Date: 2025-10-25 11:01:23.130488

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "cb00e6f4abde"
down_revision: Union[str, None] = "ce68a9015a46"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop chat_message table
    op.drop_table("chat_message")

    # Truncate chat table
    op.execute("TRUNCATE TABLE chat CASCADE")

    # Add openai_conversation_id column
    op.add_column(
        "chat", sa.Column("openai_conversation_id", sa.String(), nullable=False)
    )
    op.create_index(
        "idx_chat_conversation_id", "chat", ["openai_conversation_id"], unique=False
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Remove openai_conversation_id
    op.drop_index("idx_chat_conversation_id", table_name="chat")
    op.drop_column("chat", "openai_conversation_id")

    # Recreate chat_message table
    op.create_table(
        "chat_message",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("chat_id", sa.String(), nullable=False),
        sa.Column("role", sa.String(), nullable=False),
        sa.Column("content", sa.String(), nullable=False),
        sa.Column("content_blocks", sa.dialects.postgresql.JSONB(), nullable=False),
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
        "ix_chat_message_chat_id", "chat_message", ["chat_id"], unique=False
    )
    op.create_index(
        "ix_chat_message_created_at", "chat_message", ["created_at"], unique=False
    )
