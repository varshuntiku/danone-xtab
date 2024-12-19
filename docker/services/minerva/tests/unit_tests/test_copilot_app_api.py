import json
import os
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from tests.mocks.auth import generate_jwt_token


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_create_copilot_app_endpoint(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_app_create.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.post("/copilot/app", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_upload_copilot_avatar(test_client: TestClient):
    with patch("azure.storage.blob.BlobServiceClient.from_connection_string") as MockedBlobServiceClient:
        mocked_blob_service_client = MagicMock()
        mock_blob_client = MagicMock()
        mock_blob_client.delete_blob.return_value = True
        mock_blob_client.upload_blob.return_value = True
        mocked_blob_service_client.get_blob_client.return_value = mock_blob_client
        mocked_blob_service_client.account_name = "acc_name"
        MockedBlobServiceClient.return_value = mocked_blob_service_client

        files = [
            ("avatar", ("test1.txt", b"file content 1")),
        ]
        copilot_app_id = 1
        response = test_client.post(f"/copilot/app/{copilot_app_id}/avatar", files=files)
        assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_app(
    test_client,
):
    response = test_client.get("/copilot/app/1")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_app_endpoint(test_client: TestClient):
    data = {"name": "changed name"}
    copilot_app_id = 1
    response = test_client.put(f"/copilot/app/{copilot_app_id}", json=data)
    assert response.status_code == 200
    assert response.json()["name"] == "changed name"


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_delete_app_endpoint(test_client: TestClient):
    copilot_app_id = 1
    response = test_client.delete(f"/copilot/app/{copilot_app_id}")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_apps(
    test_client,
):
    response = test_client.get("/copilot/apps")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_add_tool_to_copilot_app(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "add_tool_to_copilot_app.json")
    with open(file_path, "r") as f:
        data = f.read()

    copilot_app_id = 1

    mock_check_file_status_response = MagicMock()
    mock_check_file_status_response.status_code = 200
    mock_check_file_status_response.json.return_value = {"validation_flag": True}

    mock_check_file_status_response2 = MagicMock()
    mock_check_file_status_response2.status_code = 200
    mock_check_file_status_response2.json.return_value = {"status": "Completed"}

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
            with patch(
                "app.utils.orchestrators.tools.base.requests.get",
                side_effect=[mock_check_file_status_response, mock_check_file_status_response2],
            ):
                response = test_client.post(f"/copilot/app/{copilot_app_id}/tool", data=data)
                assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_app_tools(
    test_client,
):
    response = test_client.get("/copilot/app/1/tool/list")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Text to sql - local test - V1.2.1"


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_app_tool(
    test_client,
):
    copilot_app_tool_id = 1
    response = test_client.get(f"/copilot/app-tool/{copilot_app_tool_id}")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_copilot_app_tool_mapping(
    test_client,
):
    copilot_app_tool_id = 1
    data = {
        "desc": "changed desc",
        "selected_context_datasources": [
            {"context_datasource_id": 1, "config": {}, "app_tool_id": copilot_app_tool_id}
        ],
    }

    mock_check_file_status_response = MagicMock()
    mock_check_file_status_response.status_code = 200
    mock_check_file_status_response.json.return_value = {"validation_flag": True}

    mock_check_file_status_response2 = MagicMock()
    mock_check_file_status_response2.status_code = 200
    mock_check_file_status_response2.json.return_value = {"status": "Completed"}

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
            with patch(
                "app.utils.orchestrators.tools.base.requests.get",
                side_effect=[mock_check_file_status_response, mock_check_file_status_response2],
            ):
                response = test_client.put(f"/copilot/app-tool/{copilot_app_tool_id}", json=data)
                assert response.status_code == 200
                assert response.json()["desc"] == "changed desc"


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_copilot_app_tool_mapping_status(
    test_client,
):
    data = {"status": "Completed"}
    copilot_app_tool_id = 1
    response = test_client.put(f"/copilot/app-tool/{copilot_app_tool_id}/status", json=data)
    assert response.status_code == 200
    assert response.json()["status"] == "Completed"


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_delete_copilot_app_tool_mapping(test_client: TestClient):
    app_tool_mapping_id = 1
    response = test_client.delete(f"/copilot/app-tool/{app_tool_mapping_id}")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_deploy_copilot_app(test_client: TestClient):
    copilot_app_id = 1
    response = test_client.post(f"/copilot/app/{copilot_app_id}/deploy")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_query_copilot_app(test_client: TestClient):
    copilot_app_id = 1
    data = {
        "user_query": "top selling brand",
        "query_trace_id": "1",
        "window_id": 1,
        "skip_conversation_window": False,
        "payload": "",
    }
    mock_check_file_status_response = MagicMock()
    mock_check_file_status_response.status_code = 200
    mock_check_file_status_response.json.return_value = json.dumps({"result": "output"})

    files = [
        ("query_datasource", ("test1.png", b"file content 1")),
    ]

    with patch("azure.storage.blob.BlobServiceClient.from_connection_string") as MockedBlobServiceClient:
        with patch("app.utils.tools.storage_util.generate_blob_sas") as mock_generate_blob_sas:
            with patch(
                "app.utils.orchestrators.tools.base.requests.get",
                side_effect=[mock_check_file_status_response],
            ):
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

                response = test_client.post(f"copilot/app/{copilot_app_id}/query", data=data, files=files)
                assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_conversation(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_conversation_post.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.post("/copilot/conversation/1", data=data)
    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "feedback": 1,
        "pinned": True,
        "comment": {},
        "output": {
            "response": {
                "text": "145,338 total sales.",
                "processed_query": "what are the total sales?",
                "hint": "\n#### SQL Query\n\n```sql\nSELECT SUM(cpg.cpgnew_v2.price) AS total_sales FROM cpg.cpgnew_v2;\n```\n\n",
                "entities": None,
                "widgets": [
                    [
                        {
                            "name": "card",
                            "type": "card",
                            "title": "What are the total sales?",
                            "value": {"data": {"values": [[145337.6]], "columns": ["TOTAL SALES"]}, "layout": {}},
                        }
                    ]
                ],
                "citation": {
                    "id": "sql",
                    "type": "markdown",
                    "data": "\n#### SQL Query\n\n```sql\nSELECT SUM(cpg.cpgnew_v2.price) AS total_sales FROM cpg.cpgnew_v2;\n```\n\n",
                },
            }
        },
    }


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_conversation_windows(test_client):
    response = test_client.get("/copilot/app/1/conversation-windows")
    assert response.status_code == 200
    assert len(response.json()) == 4


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_conversation_window(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_conversation_window_put.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.put("/copilot/conversation-window/2", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_delete_conversation_window(test_client):
    response = test_client.delete("/copilot/conversation-window/4")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_conversations(test_client):
    # for staticmethod class function directly mock the class method, pass the path where class and its method is referenced from
    with patch(
        "app.services.copilot_app.copilot_app_service.StorageServiceClient.get_storage_client"
    ) as mocked_get_storage_client:
        # Mock the method get_url on the instance of AzureBlobStorageClient
        mock_azure_blob_storage_client_instance = MagicMock()
        mock_azure_blob_storage_client_instance.get_url.return_value = (
            "https://examplestorage.blob.core.windows.net/samplestoragecontainer/sample.png"
        )

        mocked_get_storage_client.return_value = mock_azure_blob_storage_client_instance

        response = test_client.get("/copilot/app/1/conversations?window_id=1&query_limit=10&query_offset=0")
        assert response.status_code == 200
        assert response.json()["total_count"] == 3


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_upgrade_tool_version(test_client):
    data = {
        "old_published_tool_id": 1,
        "new_published_tool_id": 2,
        "upgrade_all_apps": True,
        "apps": [],
        "upgrade_type": "partial",
        "suppress_base_tool_check": True,
    }
    response = test_client.post("/copilot/app/upgrade-tool", json=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_llm_deployed_models(test_client):
    with patch("sqlalchemy.func.json_typeof") as mock_json_typeof:
        mock_json_typeof.return_value = True
        response = test_client.get("/copilot/llm-models/list")
        assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_create_llm_deployed_model(test_client):
    file_path = os.path.join("tests", "unit_tests", "payloads", "llm_deployed_model_create.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.post("/copilot/llm-model/create", data=data)
    assert response.status_code == 201


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_llm_deployed_model(test_client):
    data = {"name": "changed name"}
    llm_model_id = 1
    response = test_client.put(f"/copilot/llm-model/{llm_model_id}", json=data)
    assert response.status_code == 200
    assert response.json()["name"] == "changed name"


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_create_llm_model_registry(test_client):
    file_path = os.path.join("tests", "unit_tests", "payloads", "llm_model_registry_create.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.post("/copilot/llm-model-registry", data=data)
    assert response.status_code == 201


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_create_llm_model_type(test_client):
    file_path = os.path.join("tests", "unit_tests", "payloads", "llm_model_type_create.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.post("/copilot/llm-model-type", data=data)
    assert response.status_code == 201


def test_get_video_stream_and_headers(test_client: TestClient):
    url = "https://minervastorage.blob.core.windows.net/test-video/codx_long_1.mp4"
    start_time = 0
    range_header = "bytes=0-"
    uri_token = generate_jwt_token()

    with patch(
        "app.services.copilot_app.copilot_app_service.StorageServiceClient.get_storage_client"
    ) as mocked_get_storage_client:
        mock_azure_blob_storage_client_instance = MagicMock()
        mock_video_stream = MagicMock()
        mock_video_stream.chunks = MagicMock()
        mock_video_stream.return_value = [b"chunk1", b"chunk2"]
        mock_azure_blob_storage_client_instance.download.return_value = mock_video_stream, 0, 1048575, 273532081

        mocked_get_storage_client.return_value = mock_azure_blob_storage_client_instance

        response = test_client.get(
            "/copilot/video?src_url={}&start_time={}&uri_token={}".format(url, start_time, uri_token),
            headers={"Range": range_header},
        )

        assert response.status_code == 206


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_llm_model_info_endpoint(test_client):
    response = test_client.get("/copilot/llm-model/1")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_llm_models_list_endpoint(test_client):
    response = test_client.get("/copilot/llm-models/models-list")
    assert response.status_code == 200


def test_get_audio_output(test_client: TestClient):
    uri_token = generate_jwt_token()
    text_to_audio = "The total sales amount is 254,322, indicating a significant revenue generated"
    restructure_text = ""

    response = test_client.get(
        f"/copilot/app/1/query_audio?text_to_audio={text_to_audio}&restructure_text={restructure_text}&uri_token={uri_token}"
    )

    assert response.status_code == 200
