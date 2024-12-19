"""add golden and status columns to solution_blueprint table

Revision ID: b69cd997d810
Revises: a0d8f9162960
Create Date: 2024-11-11 13:10:27.703578

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b69cd997d810"
down_revision: Union[str, None] = "a0d8f9162960"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add the new columns to the solution_blueprint table
    op.add_column(
        "solution_blueprint", sa.Column("golden", sa.Boolean(), nullable=True, server_default=sa.text("false"))
    )
    op.add_column(
        "solution_blueprint", sa.Column("status", sa.String(length=50), nullable=True, server_default="not-verified")
    )


def downgrade():
    # Remove the columns if downgrading
    op.drop_column("solution_blueprint", "golden")
    op.drop_column("solution_blueprint", "status")
