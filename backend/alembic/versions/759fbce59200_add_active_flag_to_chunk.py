"""add active flag to chunk

Revision ID: 759fbce59200
Revises: 4c21178e7771
Create Date: 2026-02-28 10:52:27.718398

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "759fbce59200"
down_revision: Union[str, None] = "4c21178e7771"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "chunk",
        sa.Column("active", sa.Boolean(), server_default="true", nullable=False),
    )
    op.create_index(op.f("ix_chunk_active"), "chunk", ["active"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_chunk_active"), table_name="chunk")
    op.drop_column("chunk", "active")
