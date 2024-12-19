import pytest
from pytest import MonkeyPatch
from fastapi.testclient import TestClient

from api.middlewares import auth_middleware
from tests.unit.common.mocks.middleware_mocks import mock_middlware, route_middlewares


@pytest.fixture(scope="function")
def client(monkeypatch: MonkeyPatch):
    """
    Creates a test client using the fastapi instance
    """

    # mock all the middlewares
    for middleware in route_middlewares:
        monkeypatch.setattr(auth_middleware, middleware, mock_middlware())

    # import app once all the middlewares are mocked
    # this will ensure that the app is loaded with the mocked middlewares
    from api.main import app

    with TestClient(app) as client:
        yield client
