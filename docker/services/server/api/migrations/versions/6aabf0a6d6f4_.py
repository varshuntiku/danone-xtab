"""empty message

Revision ID: 6aabf0a6d6f4
Revises: 30f59e3803eb
Create Date: 2020-08-26 14:05:59.672229

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "6aabf0a6d6f4"
down_revision = "30f59e3803eb"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("user_group", sa.Column("app_publish", sa.Boolean(), nullable=True))

    op.execute("UPDATE user_group SET app_publish = true WHERE id = 2")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("user_group", "app_publish")
    # ### end Alembic commands ###
