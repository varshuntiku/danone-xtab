from unittest.mock import MagicMock, patch

import pytest
from tests.mocks.auth import generate_jwt_token


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_blob_sas_url(test_client):
    # for staticmethod class function directly mock the class method, pass the path where class and its method is referenced from
    with patch("app.routers.services.StorageServiceClient.get_storage_client") as mocked_get_storage_client:
        # Mock the method get_url on the instance of AzureBlobStorageClient
        mock_azure_blob_storage_client_instance = MagicMock()
        mock_azure_blob_storage_client_instance.get_url.return_value = (
            "https://examplestorage.blob.core.windows.net/samplestoragecontainer/blob.txt"
        )

        mocked_get_storage_client.return_value = mock_azure_blob_storage_client_instance

        response = test_client.get(
            "/services/get_blob_sas_url?blob_url=private%3Ahttps%3A%2F%2Fexamplestorage.blob.core.windows.net%2Fsamplestoragecontainer%2Fblob.txt"
        )
        assert response.status_code == 200
        assert response.json() == "https://examplestorage.blob.core.windows.net/samplestoragecontainer/blob.txt"
