"""add source_url to decision

Revision ID: 1f9a46e4d45e
Revises: 40f485b8a6d7
Create Date: 2026-03-09 15:52:41.866155

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "1f9a46e4d45e"
down_revision: Union[str, None] = "40f485b8a6d7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("decision", sa.Column("source_url", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("decision", "source_url")
