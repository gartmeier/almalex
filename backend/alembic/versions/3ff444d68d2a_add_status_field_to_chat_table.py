"""Add status field to chat table

Revision ID: 3ff444d68d2a
Revises: 342fe082d552
Create Date: 2025-09-13 10:59:10.029816

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "3ff444d68d2a"
down_revision: Union[str, None] = "342fe082d552"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create the enum type first
    chat_status_enum = sa.Enum("PENDING", "IN_PROGRESS", "COMPLETED", name="chatstatus")
    chat_status_enum.create(op.get_bind())

    # Add the column with the enum type
    op.add_column(
        "chat",
        sa.Column(
            "status",
            chat_status_enum,
            nullable=False,
            server_default="COMPLETED",
        ),
    )
    op.create_index(op.f("ix_chat_status"), "chat", ["status"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_chat_status"), table_name="chat")
    op.drop_column("chat", "status")

    # Drop the enum type
    chat_status_enum = sa.Enum("PENDING", "IN_PROGRESS", "COMPLETED", name="chatstatus")
    chat_status_enum.drop(op.get_bind())
