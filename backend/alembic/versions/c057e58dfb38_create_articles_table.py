"""create articles table

Revision ID: c057e58dfb38
Revises: b9661e41b3ce
Create Date: 2026-02-22 16:56:37.692112

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "c057e58dfb38"
down_revision: Union[str, None] = "b9661e41b3ce"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "articles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("act_id", sa.Integer(), nullable=False),
        sa.Column("eid", sa.String(), nullable=False),
        sa.Column("num", sa.String(), nullable=False),
        sa.Column("text", sa.String(), nullable=False),
        sa.Column("context", sa.String(), nullable=True),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["act_id"], ["acts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_articles_act_id"), "articles", ["act_id"], unique=False)
    op.create_index(op.f("ix_articles_order"), "articles", ["order"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_articles_order"), table_name="articles")
    op.drop_index(op.f("ix_articles_act_id"), table_name="articles")
    op.drop_table("articles")
