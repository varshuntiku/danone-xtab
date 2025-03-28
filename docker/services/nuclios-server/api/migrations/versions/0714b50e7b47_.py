"""empty message

Revision ID: 0714b50e7b47
Revises: 5188f964ecad
Create Date: 2021-05-20 22:49:08.848325

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0714b50e7b47"
down_revision = "5188f964ecad"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("app_screen", sa.Column("last_deleted", sa.Boolean(), nullable=True))
    op.add_column("app_screen_widget", sa.Column("last_deleted", sa.Boolean(), nullable=True))
    op.add_column(
        "app_screen_widget_filter_value",
        sa.Column("last_deleted", sa.Boolean(), nullable=True),
    )
    op.add_column(
        "app_screen_widget_value",
        sa.Column("last_deleted", sa.Boolean(), nullable=True),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("app_screen_widget_value", "last_deleted")
    op.drop_column("app_screen_widget_filter_value", "last_deleted")
    op.drop_column("app_screen_widget", "last_deleted")
    op.drop_column("app_screen", "last_deleted")
    # ### end Alembic commands ###
