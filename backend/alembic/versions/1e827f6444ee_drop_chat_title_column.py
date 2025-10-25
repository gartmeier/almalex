"""drop chat title column

Revision ID: 1e827f6444ee
Revises: cb00e6f4abde
Create Date: 2025-10-25 11:08:01.336233

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "1e827f6444ee"
down_revision: Union[str, None] = "cb00e6f4abde"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_index("ix_chat_title", table_name="chat")
    op.drop_column("chat", "title")


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column("chat", sa.Column("title", sa.String(), nullable=True))
    op.create_index("ix_chat_title", "chat", ["title"], unique=False)
