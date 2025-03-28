"""empty message

Revision ID: 5aa3b13eccd2
Revises: a05808db4b10
Create Date: 2024-04-12 15:28:00.491218

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "5aa3b13eccd2"
down_revision = "a05808db4b10"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # op.add_column("llm_deployed_model", sa.Column("model_params", sa.Text(), nullable=True))
    # op.execute(
    #     """INSERT INTO llm_model_registry (name,"source",model_type,is_active,description,problem_type, created_by) VALUES
    #            ('gpt-35-turbo','azure-openai','text',1,'gpt-35-turbo','deps',0);"""
    # )

    # op.execute(
    #     """INSERT INTO llm_model_registry (name,"source",model_type,is_active,description,problem_type, created_by) VALUES
    #            ('gpt-4','azure-openai','text',1,'gpt-4','deps',0);"""
    # )

    # op.execute(
    #     """INSERT INTO llm_model_registry (name,"source",model_type,is_active,description,problem_type, created_by) VALUES
    #            ('gpt-35-turbo-16k','azure-openai','text',1,'gpt-35-turbo-16k','deps',0);"""
    # )

    # op.execute(
    #     """INSERT INTO llm_model_registry (name,"source",model_type,is_active,description,problem_type, created_by) VALUES
    #            ('text-embedding-ada-002','azure-openai','embedding',1,'text-embedding-ada-002','deps', 0);"""
    # )

    # op.execute(
    #     """INSERT INTO llm_model_type ("type",is_active, created_by) VALUES
    #            ('text-to-embedding',1, 0);"""
    # )

    # op.execute(
    #     """INSERT INTO llm_model_type (type, is_active, created_by)
    # SELECT 'text-to-embedding', 1, 0
    # WHERE NOT EXISTS (
    #     SELECT 1
    #     FROM llm_model_type
    #     WHERE type = 'text-to-embedding'
    # );"""
    # )
    # op.execute(
    #     """INSERT INTO llm_model_type (type, is_active, created_by)
    # SELECT 'text-to-text', 1, 0
    # WHERE NOT EXISTS (
    #     SELECT 1
    #     FROM llm_model_type
    #     WHERE type = 'text-to-text'
    # );"""
    # )

    # op.execute(
    #     """INSERT INTO llm_model_type_mapping (model_id, type_id)
    # SELECT mr.id, mt.id
    # FROM llm_model_registry mr
    # JOIN llm_model_type mt ON mr.name = 'gpt-35-turbo' AND mt.type = 'text-to-text';
    # """
    # )

    # op.execute(
    #     """INSERT INTO llm_model_type_mapping (model_id, type_id)
    # SELECT mr.id, mt.id
    # FROM llm_model_registry mr
    # JOIN llm_model_type mt ON mr.name = 'gpt-4' AND mt.type = 'text-to-text';
    # """
    # )

    # op.execute(
    #     """INSERT INTO llm_model_type_mapping (model_id, type_id)
    # SELECT mr.id, mt.id
    # FROM llm_model_registry mr
    # JOIN llm_model_type mt ON mr.name = 'gpt-35-turbo-16k' AND mt.type = 'text-to-text';
    # """
    # )

    # op.execute(
    #     """INSERT INTO llm_model_type_mapping (model_id, type_id)
    # SELECT mr.id, mt.id
    # FROM llm_model_registry mr
    # JOIN llm_model_type mt ON mr.name = 'text-embedding-ada-002' AND mt.type = 'text-to-embedding';
    # """
    # )

    # op.execute(
    #     """INSERT INTO llm_deployment_type ("name",is_active, created_by) VALUES
    #            ('custom',1, 0);"""
    # )

    # op.execute(
    #     """INSERT INTO llm_deployed_model (model_id, endpoint, status, is_active, name, description, approval_status, deployment_type_id, progress, created_by, model_params)
    # SELECT mr.id, 'https://minervatexttosql.openai.azure.com/', 'Completed', 1, mr.name, mr.description, 'approved', dt.id, 100, 0, '{"api_version": "2023-07-01-preview","deployment_name": "base-text-to-sql-gpt35","model_name": "gpt-35-turbo","openai_api_key": "eb5760d8736941a4ada8413b9145026f","temperature": 0}'
    # FROM llm_model_registry mr
    # JOIN llm_deployment_type dt ON mr.name = 'gpt-35-turbo' AND dt.name = 'custom';"""
    # )

    # op.execute(
    #     """INSERT INTO llm_deployed_model (model_id, endpoint, status, is_active, name, description, approval_status, deployment_type_id, progress, created_by, model_params)
    # SELECT mr.id, 'https://minerva-llm.openai.azure.com/', 'Completed', 1, mr.name, mr.description, 'approved', dt.id, 100, 0, '{"api_version": "2023-03-15-preview","deployment_name": "minerva-llm","model_name": "gpt-4","openai_api_key": "77d52ae1fd974967ba7aaa6a3f14e591","temperature": 0}'
    # FROM llm_model_registry mr
    # JOIN llm_deployment_type dt ON mr.name = 'gpt-4' AND dt.name = 'custom';"""
    # )

    # op.execute(
    #     """INSERT INTO llm_deployed_model (model_id, endpoint, status, is_active, name, description, approval_status, deployment_type_id, progress, created_by, model_params)
    # SELECT mr.id, 'https://minervatexttosql.openai.azure.com/', 'Completed', 1, mr.name, mr.description, 'approved', dt.id, 100, 0, '{"api_version": "2023-07-01-preview","deployment_name": "gpt-35-16k","model_name": "gpt-35-turbo-16k","openai_api_key": "eb5760d8736941a4ada8413b9145026f","temperature": 0}'
    # FROM llm_model_registry mr
    # JOIN llm_deployment_type dt ON mr.name = 'gpt-35-turbo-16k' AND dt.name = 'custom';"""
    # )

    # op.execute(
    #     """INSERT INTO llm_deployed_model (model_id, endpoint, status, is_active, name, description, approval_status, deployment_type_id, progress, created_by, model_params)
    # SELECT mr.id, 'https://minerva-llm.openai.azure.com/', 'Completed', 1, mr.name, mr.description, 'approved', dt.id, 100, 0, '{"api_version": "2023-07-01-preview","deployment_name": "text-embedding-ada-002","model_name": "text-embedding-ada-002","openai_api_key": "77d52ae1fd974967ba7aaa6a3f14e591","temperature": 0}'
    # FROM llm_model_registry mr
    # JOIN llm_deployment_type dt ON mr.name = 'text-embedding-ada-002' AND dt.name = 'custom';"""
    # )

    # op.execute("ALTER TABLE llm_model_config ALTER COLUMN model_params TYPE JSON USING model_params::JSON;")
    pass

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("llm_deployed_model", "model_params")
    op.execute("ALTER TABLE llm_model_config ALTER COLUMN model_params TYPE TEXT;")
    # ### end Alembic commands ###
