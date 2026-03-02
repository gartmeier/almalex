"""add hnsw index on chunk embedding

Revision ID: 5914108014f1
Revises: 759fbce59200
Create Date: 2026-03-02 09:55:57.450481

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "5914108014f1"
down_revision: Union[str, None] = "759fbce59200"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        "CREATE INDEX ix_chunk_embedding_hnsw ON chunk "
        "USING hnsw (embedding vector_l2_ops)"
    )


def downgrade() -> None:
    op.drop_index("ix_chunk_embedding_hnsw", table_name="chunk")
