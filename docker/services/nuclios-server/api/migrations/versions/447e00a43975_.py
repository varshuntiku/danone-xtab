"""empty message

Revision ID: 447e00a43975
Revises: 46dacde1ba9b
Create Date: 2023-11-02 09:09:30.696049

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER

# revision identifiers, used by Alembic.
revision = "447e00a43975"
down_revision = "46dacde1ba9b"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "project",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("name", sa.String(length=100), nullable=True),
        sa.Column("industry", sa.Text(), nullable=True),
        sa.Column("parent_project_id", sa.Integer(), nullable=True),
        sa.Column("project_status", sa.Integer(), nullable=True),
        sa.Column("design_metadata", sa.Text(), nullable=True),
        sa.Column("artifact_metadata", sa.Text(), nullable=True),
        sa.Column("blueprint", sa.Text(), nullable=True),
        sa.Column("assignee", sa.Integer(), nullable=True),
        sa.Column("reviewer", sa.Integer(), nullable=True),
        sa.Column("account", sa.String(length=200), nullable=True),
        sa.Column("problem_area", sa.String(length=1000), nullable=True),
        sa.Column("origin", sa.String(length=50), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("deleted_by", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["assignee"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["created_by"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["deleted_by"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["parent_project_id"],
            ["project.id"],
        ),
        sa.ForeignKeyConstraint(
            ["reviewer"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["updated_by"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "problem_definition_version",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("version_id", UNIQUEIDENTIFIER, nullable=True),
        sa.Column("version_name", sa.String(length=1000), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=True),
        sa.Column("is_current", sa.Boolean(), nullable=False),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("deleted_by", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["created_by"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["deleted_by"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["project_id"],
            ["project.id"],
        ),
        sa.ForeignKeyConstraint(
            ["updated_by"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("version_id"),
    )
    op.create_table(
        "project_assignee_identifier",
        sa.Column("project_id", sa.Integer(), nullable=True),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["project_id"],
            ["project.id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.id"],
        ),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("project_assignee_identifier")
    op.drop_table("problem_definition_version")
    op.drop_table("project")
    # ### end Alembic commands ###
