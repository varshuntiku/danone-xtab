"""empty message

Revision ID: bd96d90031c7
Revises: 6bfaeaa8a57e
Create Date: 2021-11-30 16:59:20.747518

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "bd96d90031c7"
down_revision = "6bfaeaa8a57e"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("alerts", sa.Column("title", sa.String(length=100), nullable=True))
    op.drop_column("alerts", "name")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "alerts",
        sa.Column("name", sa.VARCHAR(length=100), autoincrement=False, nullable=True),
    )
    op.drop_column("alerts", "title")
    # ### end Alembic commands ###
