"""empty message

Revision ID: edd9720f6758
Revises: aedbb74eea74
Create Date: 2020-05-17 18:03:51.628744

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "edd9720f6758"
down_revision = "aedbb74eea74"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "widget_group", sa.Column("dark_color", sa.String(length=100), nullable=True)
    )
    op.add_column(
        "widget_group", sa.Column("light_color", sa.String(length=100), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("widget_group", "light_color")
    op.drop_column("widget_group", "dark_color")
    # ### end Alembic commands ###
