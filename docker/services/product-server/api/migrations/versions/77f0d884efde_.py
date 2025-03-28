"""empty message

Revision ID: 77f0d884efde
Revises: 476d14d47f86
Create Date: 2021-01-23 10:17:59.392395

"""
from alembic import op


# revision identifiers, used by Alembic.
revision = "77f0d884efde"
down_revision = "476d14d47f86"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index(
        op.f("ix_app_screen_app_id"), "app_screen", ["app_id"], unique=False
    )
    op.create_index(
        op.f("ix_app_screen_widget_app_id"),
        "app_screen_widget",
        ["app_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_app_screen_widget_screen_id"),
        "app_screen_widget",
        ["screen_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_app_screen_widget_filter_value_app_id"),
        "app_screen_widget_filter_value",
        ["app_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_app_screen_widget_filter_value_screen_id"),
        "app_screen_widget_filter_value",
        ["screen_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_app_screen_widget_filter_value_widget_id"),
        "app_screen_widget_filter_value",
        ["widget_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_app_screen_widget_filter_value_widget_value_id"),
        "app_screen_widget_filter_value",
        ["widget_value_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_app_screen_widget_value_app_id"),
        "app_screen_widget_value",
        ["app_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_app_screen_widget_value_screen_id"),
        "app_screen_widget_value",
        ["screen_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_app_screen_widget_value_widget_id"),
        "app_screen_widget_value",
        ["widget_id"],
        unique=False,
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(
        op.f("ix_app_screen_widget_value_widget_id"),
        table_name="app_screen_widget_value",
    )
    op.drop_index(
        op.f("ix_app_screen_widget_value_screen_id"),
        table_name="app_screen_widget_value",
    )
    op.drop_index(
        op.f("ix_app_screen_widget_value_app_id"), table_name="app_screen_widget_value"
    )
    op.drop_index(
        op.f("ix_app_screen_widget_filter_value_widget_value_id"),
        table_name="app_screen_widget_filter_value",
    )
    op.drop_index(
        op.f("ix_app_screen_widget_filter_value_widget_id"),
        table_name="app_screen_widget_filter_value",
    )
    op.drop_index(
        op.f("ix_app_screen_widget_filter_value_screen_id"),
        table_name="app_screen_widget_filter_value",
    )
    op.drop_index(
        op.f("ix_app_screen_widget_filter_value_app_id"),
        table_name="app_screen_widget_filter_value",
    )
    op.drop_index(
        op.f("ix_app_screen_widget_screen_id"), table_name="app_screen_widget"
    )
    op.drop_index(op.f("ix_app_screen_widget_app_id"), table_name="app_screen_widget")
    op.drop_index(op.f("ix_app_screen_app_id"), table_name="app_screen")
    # ### end Alembic commands ###
