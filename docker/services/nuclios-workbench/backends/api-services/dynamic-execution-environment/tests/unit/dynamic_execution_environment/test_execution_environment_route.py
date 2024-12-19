from unittest.mock import MagicMock, Mock, patch

import pytest
from starlette.requests import Request
from tests.unit.common.mocks.user_mocks import mock_user
from tests.unit.dynamic_execution_environment.mock.execution_environment_mock import (
    mock_execution_environment,
)

# @pytest.mark.asyncio
# @patch(
#     "api.routes.execution_environment.environment_route.execution_environment_controller.create_execution_environment",
#     new_callable=Mock,
# )
# async def test_unit_route_create_execution_environment(
#     mock_create_execution_environment, client, monkeypatch
# ):
#     def mock_create_env(user, request_data):
#         return {
#             "id": 1,
#             "name": request_data["name"],
#             "cloud_provider_id": request_data["cloud_provider_id"],
#             "infra_type": request_data["infra_type"],
#             "hosting_type": request_data["hosting_type"],
#             "compute_id": request_data["compute_id"],
#             "env_type": request_data["env_type"],
#             "run_time": request_data["run_time"],
#             "run_time_version": request_data["run_time_version"],
#             "replicas": request_data["replicas"],
#             "index_url": request_data["index_url"],
#             "env_category": request_data["env_category"],
#             "compute_type": request_data["compute_type"],
#             "project_id": request_data["project_id"],
#             "packages": request_data["packages"],
#         }

#     mock_create_execution_environment.side_effect = mock_create_env

#     mock_request = MagicMock(spec=Request)
#     mock_request.state.user = mock_user()

#     monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)
#     payload = generate_execution_environment_data()

#     response = client.post("services/dynamic-execution-environment/execution-environments", json=payload)

#     assert response.status_code == 201
#     assert response.json() == {
#         "id": 1,
#         **payload,
#     }


@pytest.mark.asyncio
@patch(
    "api.controllers.execution_environment.execution_environment_controller.ExecutionEnvironmentController.get_execution_environments",
    new_callable=Mock,
)
async def test_unit_route_get_execution_environments(mock_get_execution_environments, client, monkeypatch):
    # Mock the controller's behavior
    def mock_get_envs(*args, **kwargs):
        return [mock_execution_environment]

    mock_get_execution_environments.side_effect = mock_get_envs

    # Mock request
    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)

    # Send GET request
    response = client.get("services/dynamic-execution-environment/execution-environments")

    # Assertions
    assert response.status_code == 200
    assert response.json() == [mock_execution_environment]


@pytest.mark.asyncio
@patch(
    "api.controllers.execution_environment.execution_environment_controller.ExecutionEnvironmentController.get_execution_environment_detail",
    new_callable=MagicMock,
)
async def test_unit_route_get_execution_environment_detail(mock_get_execution_environment_detail, client, monkeypatch):
    # Mock the controller's behavior for fetching execution environment details
    def mock_get_env_detail(*args, **kwargs):
        return mock_execution_environment

    mock_get_execution_environment_detail.side_effect = mock_get_env_detail

    # Mock request user
    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)

    # Send GET request with an ID
    response = client.get("services/dynamic-execution-environment/execution-environments/1")

    # Assertions
    assert response.status_code == 200
    assert response.json() == mock_execution_environment


@pytest.mark.asyncio
@patch(
    "api.controllers.execution_environment.execution_environment_controller.ExecutionEnvironmentController.validate_pip_packages",
    new_callable=MagicMock,
)
async def test_unit_route_validate_pip_packages(mock_validate_pip_packages, client, monkeypatch):
    # Mock the controller's behavior for validating packages
    def mock_validate_packages(*args, **kwargs):
        return {
            "packages": [{"name": "numpy", "version": "1.21.0"}, {"name": "pandas", "version": "1.3.0"}],
            "message": "All packages are valid.",
        }

    mock_validate_pip_packages.side_effect = mock_validate_packages

    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)

    payload = payload = {
        "packages": [{"name": "valid_package", "version": "1.0"}, {"name": "invalid_package", "version": "2.0"}],
        "name": "Test Environment",
    }

    # Send POST request
    response = client.post(
        "services/dynamic-execution-environment/execution-environments/validate/packages", json=payload
    )

    # Assertions
    assert response.status_code == 200
    assert response.json() == {
        "packages": [{"name": "numpy", "version": "1.21.0"}, {"name": "pandas", "version": "1.3.0"}],
        "message": "All packages are valid.",
    }
