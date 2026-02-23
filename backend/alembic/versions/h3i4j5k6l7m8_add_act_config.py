"""add act_config table

Revision ID: h3i4j5k6l7m8
Revises: g2h3i4j5k6l7
Create Date: 2026-02-23

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "h3i4j5k6l7m8"
down_revision: Union[str, None] = "g2h3i4j5k6l7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "act_config",
        sa.Column("sr_number", sa.String(), nullable=False),
        sa.Column(
            "generate_context", sa.Boolean(), nullable=False, server_default="false"
        ),
        sa.PrimaryKeyConstraint("sr_number"),
    )


def downgrade() -> None:
    op.drop_table("act_config")
