"""empty message

Revision ID: 48fa8873e96f
Revises: 8770a63cfcd3
Create Date: 2024-06-12 16:31:25.014367

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '48fa8873e96f'
down_revision = '8770a63cfcd3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('code_execution_logs',
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('exec_env_id', sa.Integer(), nullable=True),
    sa.Column('execution_time', sa.Float(), nullable=True),
    sa.Column('execution_context', sa.Text(), nullable=True),
    sa.Column('errors', sa.Text(), nullable=True),
    sa.Column('logs', sa.Text(), nullable=True),
    sa.Column('execution_type', sa.String(length=255), nullable=True),
    sa.Column('invoked_by', sa.Integer(), nullable=True),
    sa.Column('execution_start_time', sa.DateTime(timezone=True), nullable=True),
    sa.Column('execution_end_time', sa.DateTime(timezone=True), nullable=True),
    sa.Column('execution_status', sa.String(length=255), nullable=True),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('updated_by', sa.Integer(), nullable=True),
    sa.Column('deleted_by', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['deleted_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['exec_env_id'], ['execution_environment.id'], ),
    sa.ForeignKeyConstraint(['invoked_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['updated_by'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('code_execution_logs')
    # ### end Alembic commands ###
