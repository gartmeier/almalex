"""update acts unique constraint

Revision ID: b9661e41b3ce
Revises: 26d425877d55
Create Date: 2026-02-22 09:51:23.609046

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b9661e41b3ce"
down_revision: Union[str, None] = "26d425877d55"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint(op.f("acts_sr_number_lang_key"), "acts", type_="unique")
    op.create_unique_constraint(
        None, "acts", ["sr_number", "lang", "applicability_date"]
    )


def downgrade() -> None:
    pass
