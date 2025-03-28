"""empty message

Revision ID: e1deb291f5a3
Revises: 6b244a881523
Create Date: 2021-02-23 18:25:42.626963

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e1deb291f5a3"
down_revision = "6b244a881523"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "project_notebook_triggered",
        sa.Column("trigger_run_url", sa.Text(), nullable=True),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("project_notebook_triggered", "trigger_run_url")
    # ### end Alembic commands ###
