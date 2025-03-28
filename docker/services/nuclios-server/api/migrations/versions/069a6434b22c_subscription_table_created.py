"""subscription table created

Revision ID: 069a6434b22c
Revises: 966a6acd65e5
Create Date: 2024-09-09 20:05:59.253245

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "069a6434b22c"
down_revision: Union[str, None] = "6cdf4c2d1711"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "subscription",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("app_id", sa.Integer(), nullable=True),
        sa.Column("screen_id", sa.Integer(), nullable=True),
        sa.Column("widget_id", sa.Integer(), nullable=True),
        sa.Column("subscription_setting", sa.Text(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("updated_by", sa.Integer(), nullable=True),
        sa.Column("deleted_by", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["app_id"],
            ["app.id"],
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
            ["screen_id"],
            ["app_screen.id"],
        ),
        sa.ForeignKeyConstraint(
            ["updated_by"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["widget_id"],
            ["app_screen_widget.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("subscription")
    # ### end Alembic commands ###
