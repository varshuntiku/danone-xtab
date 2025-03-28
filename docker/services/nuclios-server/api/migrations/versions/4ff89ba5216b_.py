"""empty message

Revision ID: 4ff89ba5216b
Revises: 5e8b1ee8a1f5
Create Date: 2023-01-24 01:32:13.536682
THIS WILL COME BEFORE DELETING INDSUTRY AND FUNCITON COLUMN FROM APP TABLE
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4ff89ba5216b"
down_revision = "0edee58fa3dc"
branch_labels = None
depends_on = None


def upgrade():
    # try:
    #     requests.get(app.config['BACKEND_APP_URI']+'/app/create_containers')
    #     #if this does not run successfully we exit and dont run the migration.
    # except Exception as ex:
    #     print(ex)
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "app_container",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=True,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("problem_area", sa.Text(), nullable=True),
        sa.Column("problem", sa.Text(), nullable=True),
        sa.Column("blueprint_link", sa.Text(), nullable=True),
        sa.Column("approach_blob_name", sa.Text(), nullable=True),
        sa.Column("orderby", sa.Integer(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("deleted_by", sa.Integer(), nullable=True),
        sa.Column("app_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["created_by"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["deleted_by"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["updated_by"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.add_column("app", sa.Column("parent_container_id", sa.Integer(), nullable=True))
    op.create_index(op.f("ix_app_parent_container_id"), "app", ["parent_container_id"], unique=False)
    op.create_foreign_key(
        "app_app_container_id_fkey",
        "app",
        "app_container",
        ["parent_container_id"],
        ["id"],
    )
    op.add_column("app_mapping", sa.Column("container_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "app_mapping_app_container_id_fkey",
        "app_mapping",
        "app_container",
        ["container_id"],
        ["id"],
    )
    op.execute(
        """insert into app_container (app_id, problem_area, problem, blueprint_link) select a.id, a.problem_area, a.problem, a.blueprint_link from app a where a.deleted_at is null"""
    )
    op.execute("""update app set parent_container_id = (select id from app_container where app_id = app.id)""")
    op.drop_column("app_container", "app_id")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint("app_mapping_app_container_id_fkey", "app_mapping", type_="foreignkey")
    op.drop_column("app_mapping", "container_id")
    op.drop_constraint("app_app_container_id_fkey", "app", type_="foreignkey")
    op.drop_index(op.f("ix_app_parent_container_id"), table_name="app")
    op.drop_column("app", "parent_container_id")
    op.drop_table("app_container")
    # ### end Alembic commands ###
