"""empty message

Revision ID: 1ecf2811af73
Revises: 7029050f706a
Create Date: 2020-01-04 16:35:45.370442

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "1ecf2811af73"
down_revision = "7029050f706a"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "task",
        sa.Column("data_dashboard_params", sa.String(length=10000), nullable=True),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("task", "data_dashboard_params")
    # ### end Alembic commands ###
