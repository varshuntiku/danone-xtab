import pytest
from fastapi.testclient import TestClient
from tests.integration.common.mocks.mock_auth import generate_mock_jwt_token


@pytest.fixture(scope="function")
def test_http_client(seed_data):
    """create a test client for both authenticated & unauthenticated requests"""
    from api.main import app

    with TestClient(app) as test_client:
        test_client.headers.update({"Authorization": f"Bearer {generate_mock_jwt_token()}"})
        yield test_client


@pytest.fixture(scope="function")
def db_session(create_database):
    """Provides a transactional scope for a test function."""
    session = create_database
    yield session
    session.rollback()
    session.close()
