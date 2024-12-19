import os

import pytest
from fastapi.testclient import TestClient
from tests.mocks.auth import generate_jwt_token


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_consumer_data_by_access_key(test_client):
    response = test_client.get("/admin/consumer-data?access_key=f0b277a7-f5404db9bc71-a4dafb55de0b")
    assert response.status_code == 200
    assert response.json()["name"] == "test consumer"


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_create_consumer_endpoint(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_consumer_create.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.post("/admin/consumer", data=data)
    assert response.status_code == 200
    assert response.json()["name"] == "consumer 1"


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_consumers(test_client):
    response = test_client.get("/admin/consumers")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_consumers_by_id(test_client):
    response = test_client.get("/admin/consumer/1")
    assert response.status_code == 200
    assert response.json()["name"] == "test consumer"


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_consumer_endpoint(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_consumer_put.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.put("/admin/consumer/1", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_delete_consumer_endpoint(test_client):
    response = test_client.delete("/admin/consumer/1")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_list_connection_table_endpoint(test_client):
    response = test_client.get("/admin/listConnectionTables?connection_string=sqlite:///./test_db.db&schema=")
    assert response.status_code == 200
