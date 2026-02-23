"""drop article num and embedded_at, add html

Revision ID: g2h3i4j5k6l7
Revises: f1e2d3c4b5a6
Create Date: 2026-02-22

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "g2h3i4j5k6l7"
down_revision: Union[str, None] = "f1e2d3c4b5a6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("article", "num")
    op.drop_column("article", "embedded_at")
    op.add_column(
        "article", sa.Column("html", sa.Text(), nullable=False, server_default="")
    )
    op.alter_column("article", "html", server_default=None)


def downgrade() -> None:
    op.drop_column("article", "html")
    op.add_column(
        "article", sa.Column("embedded_at", sa.DateTime(timezone=True), nullable=True)
    )
    op.add_column(
        "article", sa.Column("num", sa.String(), nullable=False, server_default="")
    )
    op.alter_column("article", "num", server_default=None)
