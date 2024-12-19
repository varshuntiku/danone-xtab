import os
import subprocess
import time

import pytest

# import base
from api.databases.base_class import Base
from api.models.base_models import *  # noqa: F403 F401
from sqlalchemy import create_engine
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.orm import sessionmaker
from testcontainers.postgres import PostgresContainer
from tests.utils.docker_utils import create_database_container


@pytest.fixture(scope="session", autouse=True)
def check_env_vars():
    REQUIRED_ENV_VARS = [
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "POSTGRES_DB",
        "DB_URL_TEST",
        "ENVIRONMENT",
    ]
    missing_vars = [var for var in REQUIRED_ENV_VARS if var not in os.environ]

    if missing_vars:
        raise EnvironmentError(f"Missing environment variables: {', '.join(missing_vars)}")

    # If no variables are missing, proceed with the tests
    print("All required environment variables are set.")


def create_database_in_memory(wait_time=10):
    postgres_container = PostgresContainer("postgres:11.22")
    postgres_container.start()

    engine_url = postgres_container.get_connection_url()
    print("Starting PostgreSQL with URL:", engine_url)

    # wait for container start up
    time.sleep(wait_time)

    return engine_url


@pytest.fixture(scope="session")
def create_database():
    """
    Creates a database connection and session with the test database
    container
    """
    current_env = os.environ.get("ENVIRONMENT")
    print("Current Env", current_env)
    print("Creating Database and Establishing DB Session")
    engine = None
    container = None
    engine_url = None
    session = None

    if current_env == "pipeline":
        container = create_database_container(env=current_env)
        print("Container has been setup for the tests")
    engine_url = os.environ.get("DB_URL_TEST")

    engine = create_engine(engine_url)
    # print("TEST DB URL", engine_url)

    # add the extensions: pgvector and uuid for now
    with engine.connect() as connection:
        try:
            connection.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
            # connection.execute('CREATE EXTENSION IF NOT EXISTS "pgvector";')
        except ProgrammingError as e:
            print(f"Error creating extensions: {e}")

    # create all tables
    Base.metadata.create_all(engine)

    SESSIONLOCAL = sessionmaker(bind=engine, autoflush=True, autocommit=False)
    session = SESSIONLOCAL()
    session.commit()

    yield session

    if current_env != "pipeline":
        # Dropped all tables after tests.
        Base.metadata.drop_all(bind=engine)
        # close session & connection
        session.close()
        connection.close()
        print("Cleanup: Dropped all tables.")

    elif container:
        # delete container once the all the tests are complete based on env
        print("Cleanup: Stopping and removing local container...")
        container.stop()
        container.remove()


@pytest.fixture(scope="session")
def seed_data(create_database):
    """seeds data using the session created in `create_database`."""
    script_path = os.path.join(os.getcwd(), "run_data_seeder.sh")
    subprocess.run(["bash", script_path], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("Seeded test data.")
