"""infomaniak embedding dim and context column

Revision ID: 58037f5903ec
Revises: ce68a9015a46
Create Date: 2026-02-20 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from pgvector.sqlalchemy.vector import VECTOR

from alembic import op

revision: str = "58037f5903ec"
down_revision: Union[str, None] = "ce68a9015a46"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("document_chunk", "embedding")
    op.add_column(
        "document_chunk", sa.Column("embedding", VECTOR(dim=3584), nullable=True)
    )
    op.add_column("document_chunk", sa.Column("context", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("document_chunk", "context")
    op.drop_column("document_chunk", "embedding")
    op.add_column(
        "document_chunk", sa.Column("embedding", VECTOR(dim=1536), nullable=True)
    )
