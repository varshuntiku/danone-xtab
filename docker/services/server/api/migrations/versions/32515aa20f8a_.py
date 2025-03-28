"""empty message

Revision ID: 32515aa20f8a
Revises: 40feaf2078ce
Create Date: 2019-05-18 02:19:42.654123

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "32515aa20f8a"
down_revision = "40feaf2078ce"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("feature", sa.Column("feature_store_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        None, "feature", "feature_store", ["feature_store_id"], ["id"]
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "feature", type_="foreignkey")
    op.drop_column("feature", "feature_store_id")
    # ### end Alembic commands ###
