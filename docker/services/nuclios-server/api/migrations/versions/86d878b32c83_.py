"""empty message

Revision ID: 86d878b32c83
Revises: 518467c76d9a
Create Date: 2024-03-11 16:52:37.789129

"""
from alembic import op

# revision identifiers, used by Alembic.
revision = "86d878b32c83"
down_revision = "518467c76d9a"
branch_labels = None
depends_on = None

langchain_pg_embedding_table = "langchain_pg_embedding_copilot_external"
langchain_pg_collection_table = "langchain_pg_collection_copilot_external"
unstructured_documents_table = "unstructured_documents_copilot_external"
unstructured_pipeline_status_table = "unstructured_pipeline_status_copilot_external"


def upgrade():
    # connection = op.get_bind()
    # res = connection.execute("SELECT * FROM pg_extension;")
    # results_as_dict = res.mappings().all()
    # vector_enabled_in_db = any(x.extname == "vector" for x in results_as_dict)

    # if vector_enabled_in_db:
    #     res2 = connection.execute(
    #         """
    #     SELECT n.nspname,
    #     p.proname
    #     FROM pg_catalog.pg_namespace n
    #     JOIN pg_catalog.pg_proc p ON p.pronamespace = n.oid
    #     WHERE p.proname = 'vector';"""
    #     )
    #     results_as_dict2 = res2.mappings().all()
    #     vector_in_public = any(x.nspname == "public" for x in results_as_dict2)
    #     vector_in_other_schema = bool(len(results_as_dict2) and not vector_in_public)
    # else:
    #     vector_in_public = False
    #     vector_in_other_schema = False

    # vector_tobe_enabled = vector_enabled_in_db and (not vector_in_other_schema) and (not vector_in_public)

    # if vector_tobe_enabled:
    #     op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    #     vector_in_public = True
    vector_in_public = False

    op.execute(
        #         f"""
        # CREATE TABLE IF NOT EXISTS {langchain_pg_collection_table} (
        # "name" varchar NULL,
        # cmetadata json NULL,
        # uuid uuid NOT NULL,
        # CONSTRAINT {langchain_pg_collection_table}_pkey PRIMARY KEY (uuid)
        # );
        # """
        f"""
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'{langchain_pg_collection_table}')
BEGIN
    CREATE TABLE {langchain_pg_collection_table} (
        [name] NVARCHAR(MAX) NULL,
        cmetadata NVARCHAR(MAX) NULL,
        uuid UNIQUEIDENTIFIER NOT NULL,
        CONSTRAINT {langchain_pg_collection_table}_pkey PRIMARY KEY (uuid)
    );
END;
"""
    )
    op.execute(
        f"""
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'{langchain_pg_embedding_table}')
    BEGIN
        CREATE TABLE {langchain_pg_embedding_table} (
            collection_id UNIQUEIDENTIFIER NULL,
            embedding { 'NVARCHAR(MAX)' if vector_in_public else 'FLOAT' } NULL,
            [document] NVARCHAR(MAX) NULL,
            cmetadata NVARCHAR(MAX) NULL,
            custom_id NVARCHAR(MAX) NULL,
            uuid UNIQUEIDENTIFIER NOT NULL,
            CONSTRAINT {langchain_pg_embedding_table}_pkey PRIMARY KEY (uuid),
            CONSTRAINT {langchain_pg_embedding_table}_collection_id_fkey FOREIGN KEY (collection_id)
                REFERENCES {langchain_pg_collection_table}(uuid) ON DELETE CASCADE
        );
    END;
    """
    )


op.execute(
    f"""
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'{unstructured_documents_table}')
    BEGIN
        CREATE TABLE {unstructured_documents_table} (
            id INT IDENTITY(1,1) NOT NULL,
            copilot_tool_id INT NULL,
            [name] NVARCHAR(MAX) NULL,
            document_status NVARCHAR(MAX) NULL,
            created_at DATETIMEOFFSET NULL DEFAULT SYSDATETIMEOFFSET(),
            updated_at DATETIMEOFFSET NULL DEFAULT SYSDATETIMEOFFSET(),
            deleted_at DATETIMEOFFSET NULL,
            CONSTRAINT {unstructured_documents_table}_pkey PRIMARY KEY (id)
        );
    END;
    """
)

op.execute(
    f"""
    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'{unstructured_pipeline_status_table}')
    BEGIN
        CREATE TABLE {unstructured_pipeline_status_table} (
            id INT IDENTITY(1,1) NOT NULL,
            copilot_tool_id INT NULL,
            run_id NVARCHAR(MAX) NULL,
            job_status NVARCHAR(MAX) NULL,
            pipeline_type NVARCHAR(MAX) NULL,
            created_at DATETIMEOFFSET NULL DEFAULT SYSDATETIMEOFFSET(),
            updated_at DATETIMEOFFSET NULL DEFAULT SYSDATETIMEOFFSET(),
            deleted_at DATETIMEOFFSET NULL,
            CONSTRAINT {unstructured_pipeline_status_table}_pkey PRIMARY KEY (id)
        );
    END;
    """
)


#     op.execute(
#         f"""
# CREATE TABLE IF NOT EXISTS {langchain_pg_embedding_table} (
# collection_id uuid NULL,
# embedding {'vector' if vector_in_public else 'float'} NULL,
# "document" varchar NULL,
# cmetadata json NULL,
# custom_id varchar NULL,
# uuid uuid NOT NULL,
# CONSTRAINT {langchain_pg_embedding_table}_pkey PRIMARY KEY (uuid),
# CONSTRAINT {langchain_pg_embedding_table}_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES {langchain_pg_collection_table}(uuid) ON DELETE CASCADE
# );
# """
#     )

#     op.execute(
#         f"""
# CREATE TABLE IF NOT EXISTS {unstructured_documents_table} (
# id serial4 NOT NULL,
# copilot_tool_id int4 NULL,
# "name" text NULL,
# document_status text NULL,
# created_at timestamptz NULL DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP),
# updated_at timestamptz NULL DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP),
# deleted_at timestamptz NULL,
# CONSTRAINT {unstructured_documents_table}_pkey PRIMARY KEY (id)
# );
# """
#     )
#     op.execute(
#         f"""
# CREATE TABLE IF NOT EXISTS {unstructured_pipeline_status_table} (
# id serial4 NOT NULL,
# copilot_tool_id int4 NULL,
# run_id text NULL,
# job_status text NULL,
# pipeline_type text NULL,
# created_at timestamptz NULL DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP),
# updated_at timestamptz NULL DEFAULT timezone('Asia/Kolkata'::text, CURRENT_TIMESTAMP),
# deleted_at timestamptz NULL,
# CONSTRAINT {unstructured_pipeline_status_table}_pkey PRIMARY KEY (id)
# );
# """
#     )
# ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # op.execute(f'DROP TABLE IF EXISTS {unstructured_pipeline_status_table}')
    # op.execute(f'DROP TABLE IF EXISTS {unstructured_documents_table}')
    # op.execute(f'DROP TABLE IF EXISTS {langchain_pg_embedding_table}')
    # op.execute(f'DROP TABLE  IF EXISTS {langchain_pg_collection_table}')
    # ### end Alembic commands ###
    pass
