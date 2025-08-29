"""add document url

Revision ID: ee1555c16f6c
Revises: afa141991fbf
Create Date: 2025-08-29 21:21:00.001887

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "ee1555c16f6c"
down_revision: Union[str, None] = "afa141991fbf"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("document", sa.Column("url", sa.String(), nullable=True))

    # Populate URL field from metadata
    connection = op.get_bind()

    # Update fedlex_article documents
    connection.execute(
        sa.text("""
            UPDATE document 
            SET url = metadata->>'article_url' 
            WHERE source = 'fedlex_article'
        """)
    )

    # Update bge documents
    connection.execute(
        sa.text("""
            UPDATE document 
            SET url = metadata->'HTML'->>'URL' 
            WHERE source = 'bge'
        """)
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("document", "url")
