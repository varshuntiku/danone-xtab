"""empty message

Revision ID: 3b3a58a57ef8
Revises: 9e4b0009b4e9
Create Date: 2023-07-24 15:07:39.545489

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3b3a58a57ef8'
down_revision = '9e4b0009b4e9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('goals',
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('dashboard_id', sa.Integer(), nullable=True),
    sa.Column('target', sa.ARRAY(sa.JSON(), dimensions=0), nullable=True),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('updated_by', sa.Integer(), nullable=True),
    sa.Column('deleted_by', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['dashboard_id'], ['conn_systems_dashboard.id'], ),
    sa.ForeignKeyConstraint(['deleted_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['updated_by'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('initiatives',
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('dashboard_id', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('tag', sa.String(length=100), nullable=True),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('updated_by', sa.Integer(), nullable=True),
    sa.Column('deleted_by', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['dashboard_id'], ['conn_systems_dashboard.id'], ),
    sa.ForeignKeyConstraint(['deleted_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['updated_by'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('solutions',
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('app_id', sa.Integer(), nullable=True),
    sa.Column('business_process_id', sa.Integer(), nullable=True),
    sa.Column('dashboard_id', sa.Integer(), nullable=True),
    sa.Column('problem_definition_id', sa.Integer(), nullable=True),
    sa.Column('linkedKPIS', sa.ARRAY(sa.JSON(), dimensions=0), nullable=True),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('updated_by', sa.Integer(), nullable=True),
    sa.Column('deleted_by', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['app_id'], ['app.id'], ),
    sa.ForeignKeyConstraint(['business_process_id'], ['business_process.id'], ),
    sa.ForeignKeyConstraint(['created_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['dashboard_id'], ['conn_systems_dashboard.id'], ),
    sa.ForeignKeyConstraint(['deleted_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['problem_definition_id'], ['problem_definition.id'], ),
    sa.ForeignKeyConstraint(['updated_by'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('stake_holders',
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('dashboard_id', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('avatar', sa.String(length=100), nullable=True),
    sa.Column('designation', sa.String(length=100), nullable=True),
    sa.Column('problem_definition_id', sa.Integer(), nullable=True),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('updated_by', sa.Integer(), nullable=True),
    sa.Column('deleted_by', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['created_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['dashboard_id'], ['conn_systems_dashboard.id'], ),
    sa.ForeignKeyConstraint(['deleted_by'], ['user.id'], ),
    sa.ForeignKeyConstraint(['problem_definition_id'], ['problem_definition.id'], ),
    sa.ForeignKeyConstraint(['updated_by'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('stake_holders')
    op.drop_table('solutions')
    op.drop_table('initiatives')
    op.drop_table('goals')
    # ### end Alembic commands ###
