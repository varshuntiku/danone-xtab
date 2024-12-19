import sqlalchemy
from app.utils.config import get_settings
from app.utils.tools.unstructred_schema_creation_tool.unstructured_schema import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

settings = get_settings()
DATABASE_URL = settings.VECTOR_EMBEDDING_CONNECTION_STRING
schema_name = settings.UNSTRUCTURED_SCHEMA_NAME

engine_schema_generation = create_engine(DATABASE_URL)
SessionLocal_generation = sessionmaker(autocommit=False, autoflush=False, bind=engine_schema_generation)
with SessionLocal_generation() as session:
    try:
        if schema_name:
            statement = sqlalchemy.text(f"CREATE SCHEMA IF NOT EXISTS {schema_name}")
            session.execute(statement)
            session.commit()
    except Exception:
        pass
SessionLocal_generation.close_all()
engine_schema_generation.dispose()

engine = create_engine(DATABASE_URL, connect_args={"options": "-csearch_path={}".format(schema_name)})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_vector_extension() -> None:
    with SessionLocal() as session:
        try:
            statement = sqlalchemy.text("CREATE EXTENSION IF NOT EXISTS vector")
            session.execute(statement)
            session.commit()
        except Exception:
            pass


try:
    create_vector_extension()
    Base.metadata.create_all(bind=engine)
except Exception:
    pass
