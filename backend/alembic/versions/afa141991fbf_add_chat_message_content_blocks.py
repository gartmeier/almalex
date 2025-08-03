"""Add content_blocks column to chat_message

Revision ID: afa141991fbf
Revises: d203d81d576d
Create Date: 2025-08-03 20:33:50.067030

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "afa141991fbf"
down_revision: Union[str, None] = "d203d81d576d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add column as nullable first
    op.add_column(
        "chat_message",
        sa.Column(
            "content_blocks", postgresql.JSONB(astext_type=sa.Text()), nullable=True
        ),
    )

    # Populate content_blocks from existing content
    op.execute("""
        UPDATE chat_message 
        SET content_blocks = jsonb_build_array(
            jsonb_build_object('type', 'text', 'text', content)
        )
    """)

    # Make column NOT NULL after populating
    op.alter_column("chat_message", "content_blocks", nullable=False)


def downgrade() -> None:
    op.drop_column("chat_message", "content_blocks")
