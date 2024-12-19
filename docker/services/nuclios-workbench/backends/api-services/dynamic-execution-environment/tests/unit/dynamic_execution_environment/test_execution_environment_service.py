from unittest.mock import patch

from api.dtos.execution_environment.execution_environment_dto import (
    ExecutionEnvironmentDetailDTO,
    ExecutionEnvironmentDTO,
)
from api.services.execution_environment.execution_environment_service import (
    ExecutionEnvironmentService,
)
from tests.unit.dynamic_execution_environment.mock.execution_environment_mock import (
    generate_mock_execution_environment,
    mock_approval_status,
    mock_env_category,
    mock_env_type,
    mock_project_id,
    mock_search,
    mock_user,
)

mock_user_id = 1


@patch("api.services.execution_environment.execution_environment_service.ExecutionEnvironmentDao")
def test_unit_service_get_execution_environments(mock_execution_environment_dao):
    # Expected DTOs
    mock_execution_environments = [generate_mock_execution_environment(1), generate_mock_execution_environment(2)]
    expected_dtos = [
        ExecutionEnvironmentDetailDTO(mock_execution_environments[0]),
        ExecutionEnvironmentDetailDTO(mock_execution_environments[1]),
    ]

    # Mock the DAO behavior
    mock_dao_instance = mock_execution_environment_dao.return_value
    mock_dao_instance.get_execution_environments.return_value = mock_execution_environments

    # Create service instance
    service = ExecutionEnvironmentService()

    # Call the service method
    result_dtos = service.get_execution_environments(
        mock_user, mock_search, mock_env_type, mock_env_category, mock_project_id, mock_approval_status
    )

    # Validate the output
    assert len(result_dtos) == len(expected_dtos)
    assert isinstance(result_dtos[0], expected_dtos[0].__class__)
    assert isinstance(result_dtos[1], expected_dtos[1].__class__)

    # Validate DAO method calls
    mock_dao_instance.get_execution_environments.assert_called_once_with(
        mock_user, mock_search, mock_env_type, mock_env_category, mock_project_id, mock_approval_status
    )


@patch("api.services.execution_environment.execution_environment_service.ExecutionEnvironmentDao")
def test_unit_service_get_execution_environment_by_id(mock_execution_environment_dao):
    mock_user = "test_user"
    mock_id = 1
    mock_execution_environment = generate_mock_execution_environment(1)

    expected_dto = ExecutionEnvironmentDTO(mock_execution_environment)
    mock_dao_instance = mock_execution_environment_dao.return_value
    mock_dao_instance.get_execution_environment_by_id.return_value = mock_execution_environment
    service = ExecutionEnvironmentService()

    result_dto = service.get_execution_environment_by_id(mock_user, mock_id)

    assert result_dto.__dict__ == expected_dto.__dict__

    mock_dao_instance.get_execution_environment_by_id.assert_called_once_with(mock_id)


@patch("api.services.execution_environment.execution_environment_service.ExecutionEnvironmentDao")
def test_unit_service_create_execution_environment_success(mock_execution_environment_dao):
    request_data = {
        "name": "test1-env2",
        "env_type": "test_type",
        "env_category": "DS_WORKBENCH",
        "project_id": 1,
        "cloud_provider_id": 1,
        "infra_type": "appservice",
        "index_url": None,
        "packages": [{"name": "alembic", "version": "1.13.1"}],
    }

    # Mock output
    mock_created_execution_environment = generate_mock_execution_environment(123)
    expected_dto = ExecutionEnvironmentDetailDTO(mock_created_execution_environment)

    # Mock DAO behavior
    mock_dao_instance = mock_execution_environment_dao.return_value
    mock_dao_instance.get_execution_environment_by_name.return_value = None  # No duplicate
    mock_dao_instance.create_execution_environment.return_value = mock_created_execution_environment
    mock_dao_instance.link_project_env.return_value = None

    # Create service instance
    service = ExecutionEnvironmentService()

    # Call the service method
    result_dto = service.create_execution_environment(mock_user, request_data)

    assert isinstance(result_dto, expected_dto.__class__)

    # Validate DAO calls
    mock_dao_instance.get_execution_environment_by_name.assert_called_once_with(request_data["name"])
    mock_dao_instance.create_execution_environment.assert_called_once_with(mock_user, request_data)
