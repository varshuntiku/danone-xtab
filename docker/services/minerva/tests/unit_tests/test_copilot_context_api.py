import json
from unittest.mock import MagicMock, patch

import pytest
from pydantic import BaseModel
from tests.mocks.auth import generate_jwt_token


class TestBlobContainerProperties(BaseModel):
    name: str


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_app_contexts_endpoint(test_client):
    response = test_client.get("/copilot/app/1/contexts")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_delete_app_context_endpoint(test_client):
    response = test_client.delete("/copilot/app/1/context/2")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_app_context_by_id_endpoint(test_client):
    with patch("azure.storage.blob.BlobServiceClient.from_connection_string") as MockedBlobServiceClient:
        with patch("app.utils.tools.storage_util.generate_blob_sas") as mock_generate_blob_sas:
            mocked_blob_service_client = MagicMock()
            mock_blob_client = MagicMock()
            mock_blob_client.delete_blob.return_value = True
            mock_blob_client.upload_blob.return_value = True
            mocked_blob_service_client.get_blob_client.return_value = mock_blob_client
            mocked_blob_service_client.account_name = "acc_name"
            mocked_blob_service_client.credential = MagicMock()
            mocked_blob_service_client.credential.account_key = "asa"
            MockedBlobServiceClient.return_value = mocked_blob_service_client
            mock_generate_blob_sas.return_value = "abcd"

            response = test_client.get("/copilot/app/1/context-datasources")
            assert response.status_code == 200

            response = test_client.get("/copilot/app/1/context-datasources?context_id=1")
            assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_app_context_endpoint(test_client):
    with patch("azure.storage.blob.BlobServiceClient.from_connection_string") as MockedBlobServiceClient:
        with patch("app.utils.tools.storage_util.generate_blob_sas") as mock_generate_blob_sas:
            mocked_blob_service_client = MagicMock()
            mock_blob_client = MagicMock()
            mock_blob_client.delete_blob.return_value = True
            mock_blob_client.upload_blob.return_value = True
            mocked_blob_service_client.get_blob_client.return_value = mock_blob_client
            mocked_blob_service_client.account_name = "acc_name"
            mocked_blob_service_client.credential = MagicMock()
            mocked_blob_service_client.credential.account_key = "asa"
            MockedBlobServiceClient.return_value = mocked_blob_service_client
            mock_generate_blob_sas.return_value = "abcd"

            data = {
                "payload": json.dumps(
                    {"name": "context 1 updated", "type": "data_metadata", "source_type": "csv", "config": {}}
                ),
                "deleted_documents": json.dumps([{"id": 2, "name": "Context doc.csv"}]),
            }
            files = [
                ("new_documents", ("test1.csv", b"file content 1")),
            ]
            response = test_client.put("/copilot/app/1/context/1", data=data, files=files)
            assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_create_app_context_endpoint(test_client):
    with patch("azure.storage.blob.BlobServiceClient.from_connection_string") as MockedBlobServiceClient:
        mocked_blob_service_client = MagicMock()
        mock_blob_client = MagicMock()
        mock_blob_client.delete_blob.return_value = True
        mock_blob_client.upload_blob.return_value = True
        mocked_blob_service_client.get_blob_client.return_value = mock_blob_client
        mocked_blob_service_client.account_name = "acc_name"
        MockedBlobServiceClient.return_value = mocked_blob_service_client

        data = {
            "payload": json.dumps({"name": "context 2", "type": "metrics_kpi", "source_type": "upload", "config": {}})
        }
        files = [
            ("new_documents", ("test1.txt", b"file content 1")),
        ]
        response = test_client.post("/copilot/app/1/context", data=data, files=files)
        assert response.status_code == 200

        data = {
            "payload": json.dumps({"name": "context 2", "type": "data_metadata", "source_type": "csv", "config": {}})
        }
        files = [
            ("new_documents", ("data_metadata.csv", b"file content 1")),
        ]
        response = test_client.post("/copilot/app/1/context", data=data, files=files)
        assert response.status_code == 200
