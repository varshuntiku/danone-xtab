"""empty message

Revision ID: bd4ceda2214d
Revises: 7c93f3cb866f
Create Date: 2020-01-15 09:26:51.457469

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "bd4ceda2214d"
down_revision = "7c93f3cb866f"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "dashboard_widget", sa.Column("widget_data", sa.Text(), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("dashboard_widget", "widget_data")
    # ### end Alembic commands ###
