# Mock the request data
mock_user = "test_user"
mock_search = "search_query"
mock_env_type = "test_type"
mock_env_category = "test_category"
mock_project_id = 123
mock_approval_status = "approved"

# Mock DAO return value
mock_execution_environment = {
    "id": 1,
    "name": "Env 1",
    "cloud_provider": None,
    "infra_type": None,
    "compute": None,
    "endpoint": None,
    "env_type": "default",
    "run_time": "python",
    "run_time_version": "3.10",
    "packages": [],
    "index_url": None,
    "status": "active",
    "created_by": "test_user",
    "created_at": "2024-01-01T12:00:00Z",
    "env_category": "UIAC_EXECUTOR",
    "compute_type": None,
    "approval_status": "approved",
}
from unittest.mock import MagicMock


def generate_mock_execution_environment(id):
    """
    Generate a mock execution environment object for testing purposes.
    """
    mock_execution_environment = MagicMock()
    mock_execution_environment.id = id
    mock_execution_environment.name = "test1-env1"
    mock_execution_environment.env_type = mock_env_type
    mock_execution_environment.env_category = "test_category"
    mock_execution_environment.compute_type = "test_compute_type"
    mock_execution_environment.run_time = "python"
    mock_execution_environment.run_time_version = "3.9"
    mock_execution_environment.endpoint = "http://test-endpoint.com"
    mock_execution_environment.packages = '["numpy", "pandas"]'
    mock_execution_environment.index_url = "http://pypi.test.org/simple"
    mock_execution_environment.status = "active"
    mock_execution_environment.created_by_user = MagicMock()
    mock_execution_environment.created_by_user.email_address = "user@test.com"
    mock_execution_environment.created_at = "2024-11-19T12:00:00"
    mock_execution_environment.approval_status = MagicMock()
    mock_execution_environment.approval_status.approval_status = "approved"

    return mock_execution_environment


def generate_execution_environment_data():
    return {
        "name": "Test Environment",
        "cloud_provider_id": 1,
        "infra_type": "k8",
        "hosting_type": "shared",
        "compute_id": None,
        "env_type": "custom",
        "run_time": "python",
        "run_time_version": "3.10",
        "replicas": 1,
        "packages": [
            {"name": "numpy", "version": "1.21.0"},
            {"name": "pandas", "version": "1.3.0"},
        ],
        "index_url": None,
        "env_category": "UIAC_EXECUTOR",
        "compute_type": "Test Compute",
        "project_id": 1001,
    }
