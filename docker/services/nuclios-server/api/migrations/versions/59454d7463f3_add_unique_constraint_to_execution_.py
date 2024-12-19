"""Add unique constraint to execution_environment_approval_status env_id

Revision ID: 59454d7463f3
Revises: 12834dff77df
Create Date: 2024-11-20 16:59:19.349612

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "59454d7463f3"
down_revision: Union[str, None] = "12834dff77df"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add unique and nullable constraints to the env_id column
    op.alter_column(
        "execution_environment_approval_status",
        "env_id",
        existing_type=sa.Integer(),
        nullable=False,  # Set nullable to False
        unique=True,  # Set unique constraint
    )


def downgrade():
    # Remove unique and nullable constraints from the env_id column
    op.alter_column(
        "execution_environment_approval_status",
        "env_id",
        existing_type=sa.Integer(),
        nullable=True,  # Revert nullable to True
        unique=False,  # Remove unique constraint
    )
    # ### end Alembic commands ###
