"""empty message

Revision ID: 16c93490fafd
Revises: 77f0d884efde
Create Date: 2021-01-26 21:06:11.962807

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "16c93490fafd"
down_revision = "77f0d884efde"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "app_screen", sa.Column("screen_filters_open", sa.Boolean(), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("app_screen", "screen_filters_open")
    # ### end Alembic commands ###
