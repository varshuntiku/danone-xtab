"""empty message

Revision ID: 0b8c6721ae48
Revises: acc27471591a
Create Date: 2020-08-30 12:44:00.643106

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0b8c6721ae48"
down_revision = "acc27471591a"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("app", sa.Column("modules", sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("app", "modules")
    # ### end Alembic commands ###
