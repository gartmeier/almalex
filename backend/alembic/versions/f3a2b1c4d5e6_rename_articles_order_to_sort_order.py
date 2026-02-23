"""rename articles.order to sort_order

Revision ID: f3a2b1c4d5e6
Revises: a97f60940a71
Create Date: 2026-02-22

"""

from typing import Sequence, Union

from alembic import op

revision: str = "f3a2b1c4d5e6"
down_revision: Union[str, None] = "a97f60940a71"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_index("ix_articles_order", table_name="articles")
    op.alter_column("articles", "order", new_column_name="sort_order")
    op.create_index(
        op.f("ix_articles_sort_order"), "articles", ["sort_order"], unique=False
    )


def downgrade() -> None:
    op.drop_index("ix_articles_sort_order", table_name="articles")
    op.alter_column("articles", "sort_order", new_column_name="order")
    op.create_index(op.f("ix_articles_order"), "articles", ["order"], unique=False)
