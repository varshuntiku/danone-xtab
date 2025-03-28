"""empty message

Revision ID: d93457e597b1
Revises: bf53cd83cc4f
Create Date: 2021-12-21 09:24:33.174142

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d93457e597b1"
down_revision = "bf53cd83cc4f"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("objectives_steps", sa.Column("app_screen_id", sa.Integer(), nullable=True))
    op.create_foreign_key(None, "objectives_steps", "app_screen", ["app_screen_id"], ["id"])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "objectives_steps", type_="foreignkey")
    op.drop_column("objectives_steps", "app_screen_id")
    # ### end Alembic commands ###
