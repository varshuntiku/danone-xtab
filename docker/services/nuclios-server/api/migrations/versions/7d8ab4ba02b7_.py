"""empty message

Revision ID: 7d8ab4ba02b7
Revises: 47a1a660d417
Create Date: 2021-01-12 16:58:57.055168

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "7d8ab4ba02b7"
down_revision = "47a1a660d417"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("app_screen", sa.Column("screen_image", sa.String(length=100), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("app_screen", "screen_image")
    # ### end Alembic commands ###
