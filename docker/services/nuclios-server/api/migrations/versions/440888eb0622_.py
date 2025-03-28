"""empty message

Revision ID: 440888eb0622
Revises: 5487b27a5a4e
Create Date: 2024-04-10 15:28:39.808838

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "440888eb0622"
down_revision = "5487b27a5a4e"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "custom_layout",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=True,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("app_id", sa.Integer(), nullable=False),
        sa.Column(
            "layout_options",
            sa.JSON(),
            server_default='[{ "no_labels": 0, "no_graphs": 1 },\n            { "no_labels": 0, "no_graphs": 2, "graph_type": "1-1", "vertical": true },\n            { "no_labels": 0, "no_graphs": 2, "graph_type": "1-1", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 3, "graph_type": "2-1" },\n            { "no_labels": 0, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 3, "graph_type": "1-2" },\n            { "no_labels": 0, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 3, "graph_type": "1-1-1", "vertical": true },\n            { "no_labels": 0, "no_graphs": 3, "graph_type": "1-1-1", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 4 },\n            { "no_labels": 0, "no_graphs": 4, "graph_type": "3-1", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 4, "graph_type": "1-3", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 5, "graph_type": "1-4", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 5, "graph_type": "1-3-1", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 5, "graph_type": "1-2-2", "horizontal": false },\n            { "no_labels": 0, "no_graphs": 5, "graph_type": "2-2-1", "horizontal": false },\n            { "no_labels": 0, "no_graphs": 5, "graph_type": "2-2-1", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 5, "graph_type": "1-1-1-1-1", "vertical": true },\n            { "no_labels": 0, "no_graphs": 6 },\n            { "no_labels": 0, "no_graphs": 6, "graph_type": "2-2-2", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 7, "graph_type": "4-2-1", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 7, "graph_type": "3-3-1", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 7, "graph_type": "1-2-2-2", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 8, "graph_type": "4-2-2", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 9, "graph_type": "4-3-2", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 9, "graph_type": "4-3-1-1", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 15, "graph_type": "5-5-5", "horizontal": true },\n            { "no_labels": 0, "no_graphs": 20, "graph_type": "5-5-5-5", "horizontal": true },\n            { "no_labels": 1, "no_graphs": 4 },\n            { "no_labels": 2, "no_graphs": 1 },\n            { "no_labels": 2, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },\n            { "no_labels": 2, "no_graphs": 2 },\n            { "no_labels": 2, "no_graphs": 6 },\n            { "no_labels": 3, "no_graphs": 1 },\n            { "no_labels": 3, "no_graphs": 2 },\n            { "no_labels": 3, "no_graphs": 3 },\n            { "no_labels": 3, "no_graphs": 3, "graph_type": "2-1" },\n            { "no_labels": 3, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },\n            { "no_labels": 3, "no_graphs": 3, "graph_type": "1-2" },\n            { "no_labels": 3, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },\n            { "no_labels": 3, "no_graphs": 4 },\n            { "no_labels": 3, "no_graphs": 4, "graph_type": "1-3", "horizontal": true },\n            { "no_labels": 3, "no_graphs": 5, "graph_type": "1-2-2", "horizontal": false },\n            { "no_labels": 3, "no_graphs": 6 },\n            { "no_labels": 4, "no_graphs": 1 },\n            { "no_labels": 4, "no_graphs": 2 },\n            { "no_labels": 4, "no_graphs": 2, "graph_type": "1-1", "horizontal": true },\n            { "no_labels": 4, "no_graphs": 3 },\n            { "no_labels": 4, "no_graphs": 3, "graph_type": "2-1" },\n            { "no_labels": 4, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },\n            { "no_labels": 4, "no_graphs": 3, "graph_type": "1-2" },\n            { "no_labels": 4, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },\n            { "no_labels": 4, "no_graphs": 3, "graph_type": "1-1-1", "horizontal": true },\n            { "no_labels": 4, "no_graphs": 4 },\n            { "no_labels": 4, "no_graphs": 4, "graph_type": "1-3", "horizontal": true },\n            { "no_labels": 4, "no_graphs": 5, "graph_type": "3-2", "horizontal": true },\n            { "no_labels": 4, "no_graphs": 5, "graph_type": "1-2-2", "horizontal": false },\n            { "no_labels": 4, "no_graphs": 6 },\n            { "no_labels": 4, "no_graphs": 6, "graph_type": "4-1-1", "horizontal": true },\n            { "no_labels": 4, "no_graphs": 8, "graph_type": "4-4", "horizontal": true },\n            { "no_labels": 5, "no_graphs": 1 },\n            { "no_labels": 5, "no_graphs": 2 },\n            { "no_labels": 5, "no_graphs": 2, "graph_type": "1-1", "horizontal": true },\n            { "no_labels": 5, "no_graphs": 4 },\n            { "no_labels": 5, "no_graphs": 3, "graph_type": "2-1" },\n            { "no_labels": 5, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },\n            { "no_labels": 5, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },\n            { "no_labels": 5, "no_graphs": 5, "graph_type": "3-2", "horizontal": true },\n            { "no_labels": 5, "no_graphs": 8, "graph_type": "4-4", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 1 },\n            { "no_labels": 6, "no_graphs": 2 },\n            { "no_labels": 6, "no_graphs": 2, "graph_type": "1-1", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 3, "graph_type": "2-1" },\n            { "no_labels": 6, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 4 },\n            { "no_labels": 5, "no_graphs": 6 },\n            { "no_labels": 6, "no_graphs": 5, "graph_type": "2-3", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 7, "graph_type": "3-2-2", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 9, "graph_type": "3-3-3", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 3, "graph_type": "1-1-1", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 5, "graph_type": "1-2-2", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 6, "graph_type": "2-2-2", "horizontal": true },\n            { "no_labels": 6, "no_graphs": 8, "graph_type": "4-4", "horizontal": true },\n            { "no_labels": 5, "no_graphs": 15, "graph_type": "5-5-5", "horizontal": true }]',  # noqa: E501
            nullable=True,
        ),
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
            ["updated_by"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.add_column("app_screen", sa.Column("graph_width", sa.String(length=100), nullable=True))
    op.add_column("app_screen", sa.Column("graph_height", sa.String(length=100), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("app_screen", "graph_height")
    op.drop_column("app_screen", "graph_width")
    op.drop_table("custom_layout")
    # ### end Alembic commands ###
