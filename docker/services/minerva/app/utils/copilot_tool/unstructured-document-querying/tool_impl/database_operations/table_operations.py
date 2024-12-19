import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tool_impl.database_operations.copilot_tool_table_models import (
    Base as copilot_unstructured_table_base,
)
from tool_impl.database_operations.copilot_tool_table_models import (
    Document_Table,
    Status_Table,
)
from tool_impl.database_operations.pgvector_table_models import (
    Base as vector_table_base,
)


def validate_or_generate_schema(database_schema_name, database_connection_string):
    engine_schema_generation = create_engine(database_connection_string)
    SessionLocal_generation = sessionmaker(autocommit=False, autoflush=False, bind=engine_schema_generation)
    with SessionLocal_generation() as session:
        statement = sqlalchemy.text(f"CREATE SCHEMA IF NOT EXISTS {database_schema_name}")
        session.execute(statement)
        session.commit()
    SessionLocal_generation.close_all()
    engine_schema_generation.dispose()


def validate_or_generate_tables(database_schema_name, database_connection_string):
    engine = create_engine(
        database_connection_string, connect_args={"options": "-csearch_path={}".format(database_schema_name)}
    )
    copilot_unstructured_table_base.metadata.create_all(bind=engine)


def pgvector_table_creation(database_schema_name, database_connection_string):
    engine = create_engine(
        database_connection_string, connect_args={"options": "-csearch_path={}".format(database_schema_name)}
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def create_vector_extension() -> None:
        with SessionLocal() as session:
            statement = sqlalchemy.text("CREATE EXTENSION IF NOT EXISTS vector")
            session.execute(statement)
            session.commit()

    create_vector_extension()
    vector_table_base.metadata.create_all(bind=engine)


def unstructured_database_model_generation(database_schema_name, database_connection_string):
    validate_or_generate_schema(database_schema_name, database_connection_string)
    validate_or_generate_tables(database_schema_name, database_connection_string)
    pgvector_table_creation(database_schema_name, database_connection_string)


def insert_status_records(pipeline_status_dict, database_connection_string, database_schema_name):
    engine = create_engine(
        database_connection_string, connect_args={"options": "-csearch_path={}".format(database_schema_name)}
    )
    Session = sessionmaker(bind=engine)
    session = Session()
    row = Status_Table(
        copilot_tool_id=pipeline_status_dict["copilot_tool_id"],
        run_id=pipeline_status_dict["run_id"],
        job_status=pipeline_status_dict["job_status"],
        pipeline_type=pipeline_status_dict["pipeline_type"],
    )
    session.add(row)
    session.commit()
    session.close_all()
    engine.dispose()


def get_latest_status_copilot_tool(copilot_tool_id, database_connection_string, database_schema_name):
    engine = create_engine(
        database_connection_string, connect_args={"options": "-csearch_path={}".format(database_schema_name)}
    )
    Session = sessionmaker(bind=engine)
    session = Session()
    latest_status = (
        session.query(Status_Table)
        .filter(Status_Table.copilot_tool_id == copilot_tool_id)
        .order_by(Status_Table.updated_at.desc())
        .first()
    )
    session.close_all()
    engine.dispose()
    return latest_status


def get_documents_copilot_tool(database_connection_string, database_schema_name, copilot_tool_id):
    engine = create_engine(
        database_connection_string, connect_args={"options": "-csearch_path={}".format(database_schema_name)}
    )
    Session = sessionmaker(bind=engine)
    session = Session()
    result = (
        session.query(Document_Table)
        .filter(Document_Table.deleted_at.is_(None), Document_Table.copilot_tool_id == copilot_tool_id)
        .all()
    )
    session.close_all()
    engine.dispose()
    return result
