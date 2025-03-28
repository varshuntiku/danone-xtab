"""empty message

Revision ID: a11cd47d64c9
Revises: 0f5e361ca55a
Create Date: 2020-07-15 06:26:45.762579

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a11cd47d64c9"
down_revision = "0f5e361ca55a"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "project_notebook_config", sa.Column("results", sa.Text(), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("project_notebook_config", "results")
    # ### end Alembic commands ###
