"""alter_chat_title

Revision ID: 0edd0b49792d
Revises: 9d7e73fef937
Create Date: 2025-04-26 15:36:21.892152

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0edd0b49792d"
down_revision: Union[str, None] = "9d7e73fef937"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("chat", "title", existing_type=sa.VARCHAR(), nullable=True)


def downgrade() -> None:
    op.alter_column("chat", "title", existing_type=sa.VARCHAR(), nullable=False)
