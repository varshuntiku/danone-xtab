from unittest.mock import Mock, patch

import pytest
from api.controllers.execution_environment.execution_environment_controller import (
    ExecutionEnvironmentController,
)
from tests.unit.dynamic_execution_environment.mock.execution_environment_mock import (
    mock_execution_environment,
    mock_project_id,
    mock_user,
)


@patch("api.controllers.execution_environment.execution_environment_controller.ExecutionEnvironmentService")
@pytest.mark.asyncio
async def test_unit_controller_get_execution_environments(mock_execution_environment_service):
    # Setup
    controller = ExecutionEnvironmentController()

    # Mock pagination response
    mock_paginated_response = {"page": 1, "page_size": 10, "total": 50, "data": [mock_execution_environment]}

    # Mock the service methods
    mock_execution_environment_service_instance = Mock()
    mock_execution_environment_service_instance.return_value = mock_execution_environment_service_instance
    mock_execution_environment_service.return_value = mock_execution_environment_service_instance
    controller.execution_environment_service = mock_execution_environment_service_instance
    # Case 1: With pagination
    mock_execution_environment_service_instance.get_paginated_execution_environments.return_value = (
        mock_paginated_response["data"],  # mocked execution environments
        mock_paginated_response["total"],  # total count of environments
    )

    # Call the controller method with pagination parameters
    paginated_response = controller.get_execution_environments(
        mock_user, 1, 10, "test_search", "custom", "UIAC_EXECUTOR", mock_project_id, "approved"
    )
    assert paginated_response.page == mock_paginated_response["page"]
    assert paginated_response.total == mock_paginated_response["total"]
    assert len(paginated_response.items) == len(mock_paginated_response["data"])
    assert paginated_response.size == mock_paginated_response["page_size"]

    # Ensure the paginated service method was called with the expected parameters
    mock_execution_environment_service_instance.get_paginated_execution_environments.assert_called_once_with(
        mock_user, 1, 10, "test_search", "custom", "UIAC_EXECUTOR", mock_project_id, "approved"
    )

    # Case 2: Without pagination
    mock_execution_environment_service_instance.get_execution_environments.return_value = mock_paginated_response[
        "data"
    ]

    # # Call the controller method without pagination parameters (page and page_size are None)
    non_paginated_response = controller.get_execution_environments(
        mock_user, None, None, "test_search", "custom", "UIAC_EXECUTOR", mock_project_id, "approved"
    )

    assert non_paginated_response == mock_paginated_response["data"]

    # Ensure the non-paginated service method was called with the expected parameters
    mock_execution_environment_service_instance.get_execution_environments.assert_called_once_with(
        mock_user, "test_search", "custom", "UIAC_EXECUTOR", mock_project_id, "approved"
    )


@patch("api.controllers.execution_environment.execution_environment_controller.ExecutionEnvironmentService")
def test_unit_controller_get_execution_environment_id_by_app_id(mock_execution_environment_service):
    # Setup
    controller = ExecutionEnvironmentController()
    mock_app_id = 123
    mock_default_env = "default"

    # Case 1: Successful execution environment fetch with details
    mock_execution_environment_service_instance = Mock()
    mock_execution_environment_service_instance.return_value = mock_execution_environment_service_instance
    mock_execution_environment_service.return_value = mock_execution_environment_service_instance
    controller.execution_environment_service = mock_execution_environment_service_instance
    mock_execution_environment_service_instance.get_execution_environment_id_by_app_id.return_value = (
        mock_execution_environment
    )

    # Call the method with fetch_execution_environment_details = True
    controller.get_execution_environment_id_by_app_id(mock_user, mock_app_id, mock_default_env, True)


@patch("api.controllers.execution_environment.execution_environment_controller.ExecutionEnvironmentService")
def test_unit_controller_get_execution_environment_detail(mock_execution_environment_service):
    # Setup
    controller = ExecutionEnvironmentController()
    mock_id = 123

    # Case 1: Successful fetch of execution environment detail
    mock_execution_environment_service_instance = Mock()
    mock_execution_environment_service_instance.return_value = mock_execution_environment_service_instance
    mock_execution_environment_service.return_value = mock_execution_environment_service_instance
    controller.execution_environment_service = mock_execution_environment_service_instance
    mock_execution_environment_service_instance.get_execution_environment_detail.return_value = (
        mock_execution_environment
    )

    # Call the method
    controller.get_execution_environment_detail(mock_user, mock_id)

    mock_execution_environment_service_instance.get_execution_environment_detail.assert_called_once_with(
        mock_user, mock_id
    )
