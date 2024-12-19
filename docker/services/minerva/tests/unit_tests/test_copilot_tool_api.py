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
def test_get_copilot_tool_list(test_client: TestClient):
    response = test_client.get("/copilot_tool/tool/list")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_copilot_tool_api(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_tool_put.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.put("/copilot_tool/tool/1", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_create_copilot_tool_endpoint(test_client: TestClient):
    mock_get_file_content_list_response = MagicMock()
    mock_get_file_content_list_response.status_code = 200
    mock_get_file_content_list_response.json.return_value = [
        {
            "path": "__init__.py",
            "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
        }
    ]
    mock_get_file_content_list_response.content = b'[{"path": "__init__.py","content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n"}]'

    mock_get_latest_commit_id_response = MagicMock()
    mock_get_latest_commit_id_response.status_code = 200
    mock_get_latest_commit_id_response.json.return_value = {
        "value": [{"objectId": "6a3ead7367e0fd2a6aca68ee25eabaade8f35d9c"}]
    }

    mock_check_file_status_response = MagicMock()
    mock_check_file_status_response.status_code = 200
    mock_check_file_status_response.json.return_value = {
        "value": [
            [
                {
                    "gitObjectType": "blob",
                    "path": "__init__.py",
                    "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# NucliOS can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
                },
                {"path": "readme.md", "content": "description about skillset usage"},
            ]
        ]
    }

    mock_update_files_response = MagicMock()
    mock_update_files_response.status_code = 201
    mock_update_files_response.json.return_value = {"commits": [{"commitId": "sampleCommitId"}]}

    with patch(
        "app.utils.git_operations.azure_devops.requests.get",
        side_effect=[mock_get_file_content_list_response, mock_get_latest_commit_id_response],
    ):
        with patch(
            "app.utils.git_operations.azure_devops.requests.post",
            side_effect=[mock_check_file_status_response, mock_update_files_response],
        ):
            file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_tool_create.json")
            with open(file_path, "r") as f:
                data = f.read()
            response = test_client.post("/copilot_tool/tool", data=data)
            assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_tool_endpoint(test_client):
    response = test_client.get("/copilot_tool/tool/1")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_tool_version_detail_endpoint(test_client: TestClient):
    mock_get_file_content_list_response = MagicMock()
    mock_get_file_content_list_response.status_code = 200
    mock_get_file_content_list_response.json.return_value = [
        {
            "path": "__init__.py",
            "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
        }
    ]
    mock_get_file_content_list_response.content = b'[{"path": "__init__.py","content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n"}]'

    with patch("app.utils.git_operations.azure_devops.requests.get", return_value=mock_get_file_content_list_response):
        response = test_client.get("/copilot_tool/tool/1/tool-version")
        assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_create_copilot_tool_version_endpoint(test_client: TestClient):
    mock_get_latest_commit_id_response = MagicMock()
    mock_get_latest_commit_id_response.status_code = 200
    mock_get_latest_commit_id_response.json.return_value = {
        "value": [{"objectId": "e25eabaade8f35d9c6a3ead7367e0fd2a6aca68e"}]
    }
    mock_get_file_contents_list_response = MagicMock()
    mock_get_file_contents_list_response.status_Code = 200
    mock_get_file_contents_list_response.content = b"#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n"

    mock_check_file_status_response = MagicMock()
    mock_check_file_status_response.status_code = 200
    mock_check_file_status_response.json.return_value = {
        "value": [
            [
                {
                    "gitObjectType": "blob",
                    "path": "__init__.py",
                    "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# NucliOS can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
                },
                {"path": "readme.md", "content": "description about skillset usage"},
            ]
        ]
    }

    mock_update_files_response = MagicMock()
    mock_update_files_response.status_code = 201
    mock_update_files_response.json.return_value = {"commits": [{"commitId": "sampleCommitId"}]}

    with patch(
        "app.utils.git_operations.azure_devops.requests.post",
        side_effect=[mock_check_file_status_response, mock_update_files_response],
    ):
        with patch(
            "app.utils.git_operations.azure_devops.requests.get",
            side_effect=[mock_get_file_contents_list_response, mock_get_latest_commit_id_response],
        ):
            file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_tool_version_create.json")
            with open(file_path, "r") as f:
                data = f.read()
            response = test_client.post("/copilot_tool/tool/1/tool-version", data=data)
            assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_copilot_tool_version_api(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_tool_version_put.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.put("/copilot_tool/tool/1/tool-version", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_tool_version_list_endpoint(test_client: TestClient):
    response = test_client.get("/copilot_tool/tool/1/tool-version/list?limit=10&offset=0")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_tool_version_detail_by_id_endpoint(test_client: TestClient):
    mock_get_file_content_list_response = MagicMock()
    mock_get_file_content_list_response.status_code = 200
    mock_get_file_content_list_response.json.return_value = [
        {
            "path": "__init__.py",
            "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
        }
    ]
    mock_get_file_content_list_response.content = b'[{"path": "__init__.py","content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n"}]'

    with patch("app.utils.git_operations.azure_devops.requests.get", return_value=mock_get_file_content_list_response):
        response = test_client.get("/copilot_tool/tool-version/1")
        assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_publish_copilot_tool_version_endpoint(test_client: TestClient):
    mock_get_file_content_list_response = MagicMock()
    mock_get_file_content_list_response.status_code = 200
    mock_get_file_content_list_response.json.return_value = [
        {
            "path": "__init__.py",
            "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
        }
    ]
    mock_get_file_content_list_response.content = b'[{"path": "__init__.py","content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n"}]'

    mock_get_latest_commit_id_response = MagicMock()
    mock_get_latest_commit_id_response.status_code = 200
    mock_get_latest_commit_id_response.json.return_value = {
        "value": [{"objectId": "6a3ead7367e0fd2a6aca68ee25eabaade8f35d9c"}]
    }

    mock_check_file_status_response = MagicMock()
    mock_check_file_status_response.status_code = 200
    mock_check_file_status_response.json.return_value = {
        "value": [
            [
                {
                    "gitObjectType": "blob",
                    "path": "__init__.py",
                    "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# NucliOS can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
                },
                {"path": "readme.md", "content": "description about skillset usage"},
            ]
        ]
    }

    mock_update_files_response = MagicMock()
    mock_update_files_response.status_code = 201
    mock_update_files_response.json.return_value = {"commits": [{"commitId": "sampleCommitId"}]}

    with patch(
        "app.utils.git_operations.azure_devops.requests.get",
        side_effect=[mock_get_file_content_list_response, mock_get_latest_commit_id_response],
    ):
        with patch(
            "app.utils.git_operations.azure_devops.requests.post",
            side_effect=[mock_check_file_status_response, mock_update_files_response],
        ):
            file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_tool_version_publish.json")
            with open(file_path, "r") as f:
                data = f.read()
            response = test_client.post("/copilot_tool/tool-version/1/publish", data=data)
            assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_published_tool_list_endpoint(test_client: TestClient):
    response = test_client.get("/copilot_tool/published-tool/list?registry_id=1")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_verify_copilot_tool_version_endpoint(test_client: TestClient):
    file_path = os.path.join("tests", "unit_tests", "payloads", "copilot_tool_version_verify.json")
    with open(file_path, "r") as f:
        data = f.read()
    response = test_client.put("/copilot_tool/tool-version/verify", data=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_delete_published_tool_endpoint(test_client: TestClient):
    mock_post_file_content_list_response1 = MagicMock()
    mock_post_file_content_list_response1.status_code = 200
    mock_post_file_content_list_response1.json.return_value = {
        "value": [
            [
                {
                    "gitObjectType": "blob",
                    "path": "/published_tools/specs/function-2.yaml",
                    "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
                }
            ]
        ]
    }
    mock_post_file_content_list_response1.headers = {"Content-Type": ""}
    mock_post_file_content_list_response1.content = b'[{"path": "/published_tools/specs/function-2.yaml","content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n"}]'

    mock_update_files_response = MagicMock()
    mock_update_files_response.status_code = 201
    mock_update_files_response.json.return_value = {"commits": [{"commitId": "sampleCommitId"}]}

    with patch("requests.get") as mock_request_get:
        with patch("requests.post", side_effect=[mock_post_file_content_list_response1, mock_update_files_response]):
            mock_get_file_content_list_response = MagicMock()
            mock_get_file_content_list_response.status_code = 200
            mock_get_file_content_list_response.json.return_value = {
                "value": [
                    {
                        "gitObjectType": "blob",
                        "path": "/published_tools/specs/function-2.yaml",
                        "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
                        "objectId": "asbsa",
                    }
                ]
            }
            mock_get_file_content_list_response.headers = {"Content-Type": ""}
            mock_get_file_content_list_response.content = b'[{"path": "/published_tools/specs/function-2.yaml","content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n"}]'
            mock_request_get.return_value = mock_get_file_content_list_response

            tool_version_registry_mapping_id = 2
            response = test_client.delete(f"/copilot_tool/published-tool/{tool_version_registry_mapping_id}/delete")
            assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_tool_deploy_status(
    test_client,
):
    data = {"items": [{"id": 1, "deployment_status": "Completed", "info": {"access_url": "abcd.com"}}]}
    response = test_client.put("/copilot_tool/published-tool/update-status", json=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_update_update_published_tool_version(
    test_client,
):
    data = {"approved": True, "deprecated": True}
    tool_version_registry_mapping_id = 1
    response = test_client.put(f"/copilot_tool/published-tool/{tool_version_registry_mapping_id}", json=data)
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_published_tool_doc_content(
    test_client,
):
    tool_version_registry_mapping_id = 1
    with patch("requests.get") as mock_request_get:
        mock_get_file_content_list_response = MagicMock()
        mock_get_file_content_list_response.status_code = 200
        mock_get_file_content_list_response.json.return_value = {
            "value": [
                {
                    "gitObjectType": "blob",
                    "path": "readme.md",
                    "content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n",
                }
            ]
        }
        mock_get_file_content_list_response.headers = {"Content-Type": ""}
        mock_get_file_content_list_response.content = b'[{"path": "readme.md","content": "#\n# Author: Mathco Innovation Team\n# TheMathCompany, Inc. (c) 2023\n#\n# This file is part of Codx.\n#\n# Codx can not be copied and/or distributed without -\n# the express permission of TheMathCompany, Inc.\n#\n"}]'
        mock_request_get.return_value = mock_get_file_content_list_response
        response = test_client.get(f"/copilot_tool/published-tool/{tool_version_registry_mapping_id}/doc")
        assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_tool_base_versions_endpoint(test_client: TestClient):
    response = test_client.get("/copilot_tool/base-versions")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_tool_deployment_agents_endpoint(test_client: TestClient):
    response = test_client.get("/copilot_tool/deployment-agents")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_copilot_removable_tool_versions_endpoint(test_client: TestClient):
    response = test_client.get("/copilot_tool/removable-tool-versions/list")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_app_linked_deprecated_tools(test_client: TestClient):
    response = test_client.get("/copilot_tool/app-linked-deprecated-tools/list")
    assert response.status_code == 200


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_unused_published_tools(test_client: TestClient):
    response = test_client.get("/copilot_tool/unused-published-tools/list")
    assert response.status_code == 200
