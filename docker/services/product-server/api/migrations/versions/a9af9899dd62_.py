"""empty message

Revision ID: a9af9899dd62
Revises: 32f015da0234
Create Date: 2024-06-26 11:30:22.488588

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'a9af9899dd62'
down_revision = '32f015da0234'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('conn_system_dashboard', sa.Column('industry', sa.String(length=100)))
    op.add_column('conn_system_dashboard', sa.Column('function', sa.String(length=100)))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('conn_system_dashboard', 'function')
    op.drop_column('conn_system_dashboard', 'industry')
    # ### end Alembic commands ###
