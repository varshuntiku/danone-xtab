"""empty message

Revision ID: a1867d30ad31
Revises: 4ff89ba5216b
Create Date: 2023-03-28 18:45:32.460170

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
revision = "a1867d30ad31"
down_revision = "4ff89ba5216b"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("app", "parent_app_id", new_column_name="source_app_id")
    # op.add_column('app', sa.Column('source_app_id', sa.Integer(), nullable=True))
    op.drop_index("ix_app_parent_app_id", table_name="app")
    op.create_index(op.f("ix_app_source_app_id"), "app", ["source_app_id"], unique=False)
    op.drop_constraint("app_parent_app_id_fkey", "app", type_="foreignkey")
    op.create_foreign_key("app_source_app_id_fkey", "app", "app", ["source_app_id"], ["id"])

    op.execute(
        "update app_mapping set container_id = (select parent_container_id from app where app.id = app_mapping.app_id)"
    )
    # op.drop_constraint("app_mapping_app_id_fkey", "app_mapping", type_="foreignkey")
    drop_constraints(op, "app_mapping", "app_id")

    op.drop_column("app_mapping", "app_id")

    op.alter_column("app", "parent_container_id", new_column_name="container_id")
    op.drop_index("ix_app_parent_container_id", table_name="app")
    op.create_index(op.f("ix_app_container_id"), "app", ["container_id"], unique=False)
    op.drop_constraint("app_app_container_id_fkey", "app", type_="foreignkey")
    op.create_foreign_key("app_container_id_fkey", "app", "app_container", ["container_id"], ["id"])
    op.rename_table("app_mapping", "container_mapping")

    # op.drop_column('app', 'parent_app_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # op.add_column('app', sa.Column('parent_app_id', sa.INTEGER(), autoincrement=False, nullable=True))
    # op.drop_constraint(None, 'app', type_='foreignkey')
    # op.drop_index(op.f('ix_app_source_app_id'), table_name='app')
    op.rename_table("container_mapping", "app_mapping")
    op.alter_column("app", "source_app_id", new_column_name="parent_app_id")
    op.drop_index("ix_app_source_app_id", table_name="app")
    op.create_index("ix_app_parent_app_id", "app", ["parent_app_id"], unique=False)
    op.drop_constraint("app_source_app_id_fkey", "app", type_="foreignkey")
    op.create_foreign_key("app_parent_app_id_fkey", "app", "app", ["parent_app_id"], ["id"])

    op.add_column("app_mapping", sa.Column("app_id", sa.INTEGER(), autoincrement=False))
    op.create_foreign_key("app_mapping_app_id_fkey", "app_mapping", "app", ["app_id"], ["id"])
    op.execute(
        "update app_mapping set app_id = (select id from app where app.container_id = app_mapping.container_id limit 1)"
    )

    op.alter_column("app", "container_id", new_column_name="parent_container_id")
    op.drop_index("ix_app_container_id", table_name="app")
    op.create_index("ix_app_parent_container_id", "app", ["parent_app_id"], unique=False)
    op.drop_constraint("app_container_id_fkey", "app", type_="foreignkey")
    op.create_foreign_key(
        "app_app_container_id_fkey",
        "app",
        "app_container",
        ["parent_container_id"],
        ["id"],
    )
    # ### end Alembic commands ###
