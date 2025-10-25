"""drop chat table

Revision ID: 739a27e18012
Revises: 1e827f6444ee
Create Date: 2025-10-25 11:18:42.735742

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "739a27e18012"
down_revision: Union[str, None] = "1e827f6444ee"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_table("chat")


def downgrade() -> None:
    """Downgrade schema."""
    op.create_table(
        "chat",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("openai_conversation_id", sa.String(), nullable=False),
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
    op.create_index(
        "idx_chat_conversation_id", "chat", ["openai_conversation_id"], unique=False
    )
    op.create_index("ix_chat_created_at", "chat", ["created_at"], unique=False)
    op.create_index("ix_chat_updated_at", "chat", ["updated_at"], unique=False)
