"""empty message

Revision ID: 2792f583594f
Revises: 2667055cb410
Create Date: 2022-03-25 00:55:03.381997

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


def drop_constraints(op, table_name, column_name):
    conn = op.get_bind()
    inspector = inspect(conn)

    # Define your table and column names
    table_name = table_name
    column_name = column_name
    # Get the dynamically generated foreign key constraint name
    foreign_keys = inspector.get_foreign_keys(table_name)
    print(foreign_keys)

    # Find the correct foreign key constraint dynamically
    constraint_name = None
    for fk in foreign_keys:
        if fk["constrained_columns"] == [column_name]:
            constraint_name = fk["name"]
            break

    if constraint_name:
        # Drop the foreign key constraint using its dynamic name
        op.drop_constraint(constraint_name, table_name, type_="foreignkey")


# revision identifiers, used by Alembic.
revision = "2792f583594f"
down_revision = "2667055cb410"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("story", sa.Column("story_type", sa.String(length=100), nullable=True))
    # op.drop_constraint(
    #     "story_content_app_id_app_screen_id_app_screen_widget_id_app_key",
    #     "story_content",
    #     type_="unique",
    # )
    drop_constraints(op, "story_content", "app_id")
    op.create_unique_constraint(
        None,
        "story_content",
        [
            "app_id",
            "app_screen_id",
            "app_screen_widget_id",
            "app_screen_widget_value_id",
            "story_id",
            # "filter_data",
        ],
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "story_content", type_="unique")
    op.create_unique_constraint(
        "story_content_app_id_app_screen_id_app_screen_widget_id_app_key",
        "story_content",
        [
            "app_id",
            "app_screen_id",
            "app_screen_widget_id",
            "app_screen_widget_value_id",
            "story_id",
        ],
    )
    op.drop_column("story", "story_type")
    # ### end Alembic commands ###
