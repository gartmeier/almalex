"""create act table

Revision ID: 26d425877d55
Revises: ce68a9015a46
Create Date: 2026-02-22 09:34:16.926283

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "26d425877d55"
down_revision: Union[str, None] = "ce68a9015a46"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "acts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("lang", sa.String(), nullable=False),
        sa.Column("sr_number", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=True),
        sa.Column("abbr", sa.String(), nullable=True),
        sa.Column("html_url", sa.String(), nullable=False),
        sa.Column("xml_url", sa.String(), nullable=False),
        sa.Column("applicability_date", sa.Date(), nullable=False),
        sa.Column("applicability_end_date", sa.Date(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("sr_number", "lang"),
    )
    op.create_index(op.f("ix_acts_lang"), "acts", ["lang"], unique=False)
    op.create_index(op.f("ix_acts_sr_number"), "acts", ["sr_number"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_acts_sr_number"), table_name="acts")
    op.drop_index(op.f("ix_acts_lang"), table_name="acts")
    op.drop_table("acts")
