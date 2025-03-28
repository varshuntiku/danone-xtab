"""empty message

Revision ID: a3c5d69f4112
Revises: 49c156f6b116
Create Date: 2021-04-20 21:08:07.128839

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
revision = "a3c5d69f4112"
down_revision = "49c156f6b116"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_constraint("story_pages_content_id_fkey", "story_pages", type_="foreignkey")
    drop_constraints(op, "story_pages", "content_id")

    op.drop_column("story_pages", "content_id")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "story_pages",
        sa.Column("content_id", sa.INTEGER(), autoincrement=False, nullable=True),
    )
    op.create_foreign_key(
        "story_pages_content_id_fkey",
        "story_pages",
        "story_content",
        ["content_id"],
        ["id"],
    )
    # ### end Alembic commands ###
