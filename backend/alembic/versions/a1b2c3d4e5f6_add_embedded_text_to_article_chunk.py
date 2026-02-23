"""add embedding_input to article_chunk

Revision ID: a1b2c3d4e5f6
Revises: 30a276fa6f7a
Create Date: 2026-02-23

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "30a276fa6f7a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "article_chunk", sa.Column("embedding_input", sa.String(), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("article_chunk", "embedding_input")
