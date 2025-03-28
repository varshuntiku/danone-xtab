"""empty message

Revision ID: 5d4e1868b914
Revises: 8bd41338a341
Create Date: 2020-08-26 21:27:02.749538

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "5d4e1868b914"
down_revision = "8bd41338a341"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "app_screen_widget_filter_value",
        sa.Column("screen_id", sa.Integer(), nullable=True),
    )
    op.add_column(
        "app_screen_widget_filter_value",
        sa.Column("widget_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        None, "app_screen_widget_filter_value", "app_screen", ["screen_id"], ["id"]
    )
    op.create_foreign_key(
        None,
        "app_screen_widget_filter_value",
        "app_screen_widget",
        ["widget_id"],
        ["id"],
    )
    op.add_column(
        "app_screen_widget_value", sa.Column("screen_id", sa.Integer(), nullable=True)
    )
    op.create_foreign_key(
        None, "app_screen_widget_value", "app_screen", ["screen_id"], ["id"]
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "app_screen_widget_value", type_="foreignkey")
    op.drop_column("app_screen_widget_value", "screen_id")
    op.drop_constraint(None, "app_screen_widget_filter_value", type_="foreignkey")
    op.drop_constraint(None, "app_screen_widget_filter_value", type_="foreignkey")
    op.drop_column("app_screen_widget_filter_value", "widget_id")
    op.drop_column("app_screen_widget_filter_value", "screen_id")
    # ### end Alembic commands ###
