"""update decision columns

Revision ID: f3e4c5d6a7b8
Revises: 0ff29808da67
Create Date: 2026-02-24

"""

from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "f3e4c5d6a7b8"
down_revision: Union[str, None] = "0ff29808da67"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("decision", "regeste")
    op.drop_column("decision", "source_url")
    op.alter_column("decision", "html_url", existing_type=sa.String(), nullable=True)
    op.add_column("decision", sa.Column("chamber", sa.String(), nullable=True))
    op.add_column("decision", sa.Column("pdf_url", sa.String(), nullable=True))
    op.add_column("decision", sa.Column("headline", postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    op.drop_column("decision", "headline")
    op.drop_column("decision", "pdf_url")
    op.drop_column("decision", "chamber")
    op.alter_column("decision", "html_url", existing_type=sa.String(), nullable=False)
    op.add_column("decision", sa.Column("source_url", sa.String(), nullable=True))
    op.add_column("decision", sa.Column("regeste", sa.String(), nullable=True))
