"""empty message

Revision ID: 30a2e0b907b0
Revises: 47dc5dd975e6
Create Date: 2022-03-31 11:42:48.843985

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "30a2e0b907b0"
down_revision = "47dc5dd975e6"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("alerts", sa.Column("widget_url", sa.String(), nullable=True))
    op.add_column("notifications", sa.Column("widget_name", sa.String(), nullable=True))
    op.add_column("notifications", sa.Column("shared_by", sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("notifications", "shared_by")
    op.drop_column("notifications", "widget_name")
    op.drop_column("alerts", "widget_url")
    # ### end Alembic commands ###
