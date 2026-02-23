"""add breadcrumb to articles

Revision ID: a97f60940a71
Revises: c057e58dfb38
Create Date: 2026-02-22 17:24:28.916828

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a97f60940a71"
down_revision: Union[str, None] = "c057e58dfb38"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("articles", sa.Column("breadcrumb", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("articles", "breadcrumb")
