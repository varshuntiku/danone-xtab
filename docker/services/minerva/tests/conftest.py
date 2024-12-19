import logging
import os

import pytest
from app.db.base_class import Base
from app.dependencies.dependencies import get_db
from app.main import app
from app.utils.auth.middleware import AuthMiddleware, validate_copilot_tool_auth_token
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from tests.mocks.auth import mock_auth_middleware, mock_validate_copilot_tool_auth_token
from tests.seed_data.data_seeder import data_seeder

# import uuid


# mock db for testing
SQLITE_DATABASE_URL = "sqlite:///./test_db.db"

engine = create_engine(
    SQLITE_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# create all tables
Base.metadata.create_all(bind=engine)


# seed data on session start
@pytest.hookimpl(tryfirst=True)
def pytest_sessionstart(session):
    """Hook to run the data seeder before tests."""
    try:
        data_seeder()
    except Exception as e:
        if os.path.exists("./test_db.db"):
            os.remove("./test_db.db")
        raise e


@pytest.fixture(scope="function")
def db_session():
    """create a new database session with a rollback at the end of the test."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def test_client(db_session, request):
    """create a test client for both authenticated & unauthenticated requests"""

    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()

    app.dependency_overrides[get_db] = override_get_db

    app.dependency_overrides[AuthMiddleware] = mock_auth_middleware

    app.dependency_overrides[validate_copilot_tool_auth_token] = mock_validate_copilot_tool_auth_token

    auth_token = getattr(request, "param", {}).get("auth_token", None)
    logging.info(f"Auth token {auth_token} {request}")
    if auth_token:
        token = request.param["auth_token"]
        with TestClient(app) as test_client:
            test_client.headers.update({"Authorization": f"Bearer {token}"})
            yield test_client
    else:
        logging.info("No Auth token found!!")
        with TestClient(app) as test_client:
            yield test_client


# @pytest.fixture()
# def user_id() -> uuid.UUID:
#     """Generate a random user id."""
#     return str(uuid.uuid4())


# @pytest.fixture()
# def user_payload(user_id):
#     """Generate a user payload."""
#     return {
#         "id": user_id,
#         "first_name": "John",
#         "last_name": "Doe",
#         "address": "123 Farmville",
#     }


# @pytest.fixture()
# def user_payload_updated(user_id):
#     """Generate an updated user payload."""
#     return {
#         "first_name": "Jane",
#         "last_name": "Doe",
#         "address": "321 Farmville",
#         "activated": True,
#     }


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_db():
    """Delete the test database file after the test session completes."""
    yield
    if os.path.exists("./test_db.db"):
        os.remove("./test_db.db")


@pytest.fixture(scope="function")
def db_inspector():
    inspector = inspect(engine)
    return inspector
