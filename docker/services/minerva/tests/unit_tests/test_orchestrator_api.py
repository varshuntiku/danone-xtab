import os

import pytest
from fastapi.testclient import TestClient
from tests.mocks.auth import generate_jwt_token


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_post_orchestrator_endpoint(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_orchestrator_create.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.post("/copilot/orchestrator", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_orchestrator_by_id_endpoint(test_client: TestClient):
    response = test_client.get("/copilot/orchestrator/1")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_orchestrator_endpoint(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_orchestrator_put.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.put("/copilot/orchestrator/1", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_delete_orchestrator_endpoint(test_client):
    response = test_client.delete("/copilot/orchestrator/1")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_orchestrators(test_client):
    response = test_client.get("/copilot/orchestrator/list")
    assert response.status_code == 200
