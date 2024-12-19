"""Add index_url column to execution_environment

Revision ID: 6f33a9100db2
Revises: bb4c7f72c23a
Create Date: 2024-08-20 16:30:19.273062

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "6f33a9100db2"
down_revision: Union[str, None] = "bb4c7f72c23a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add the index_url column to the execution_environment table
    op.add_column("execution_environment", sa.Column("index_url", sa.Text(), nullable=True))


def downgrade():
    # Remove the index_url column if rolling back
    op.drop_column("execution_environment", "index_url")
