import os

import pytest
from fastapi.testclient import TestClient
from tests.mocks.auth import generate_jwt_token


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_create_tool_registry_endpoint(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_tool_registry_create.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.post("/copilot/tool-registry", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_tool_registry_endpoint(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_tool_registry_update.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.put("/copilot/tool-registry/2", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_delete_tool_registry_endpoint(test_client):
    response = test_client.delete("/copilot/tool-registry/2")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_tool_registry_endpoint(test_client):
    response = test_client.get("/copilot/tool-registry/list")
    assert response.status_code == 200
