"""add source_url to act

Revision ID: 40f485b8a6d7
Revises: 41cecc98dd61
Create Date: 2026-03-09 12:09:27.856008

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "40f485b8a6d7"
down_revision: Union[str, None] = "41cecc98dd61"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("act", sa.Column("source_url", sa.String(), nullable=True))
    op.drop_index(
        op.f("ix_chunk_embedding_hnsw"),
        table_name="chunk",
        postgresql_ops={"(embedding::halfvec(3584))": "halfvec_l2_ops"},
        postgresql_using="hnsw",
    )


def downgrade() -> None:
    op.create_index(
        op.f("ix_chunk_embedding_hnsw"),
        "chunk",
        [sa.literal_column("(embedding::halfvec(3584))")],
        unique=False,
        postgresql_ops={"(embedding::halfvec(3584))": "halfvec_l2_ops"},
        postgresql_using="hnsw",
    )
    op.drop_column("act", "source_url")
