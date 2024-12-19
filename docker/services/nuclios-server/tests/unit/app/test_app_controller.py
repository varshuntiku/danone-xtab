from unittest.mock import MagicMock, patch

from api.controllers.apps.app_controller import AppController
from api.schemas.apps.app_schema import CreateAppRequestSchema
from tests.unit.app.mocks.app_mocks import (
    mock_create_app_id_response as mock_create_app_response,
)
from tests.unit.app.mocks.app_mocks import mock_link_app_response
from tests.unit.common.factories.apps.app_factory import generate_app_data

# Mocked data for the test
mock_user_id = 1
mock_request_data = CreateAppRequestSchema(**generate_app_data())

# Mock response for service methods


@patch("api.controllers.apps.app_controller.AppService")
def test_unit_controller_create_new_app(mock_app_service):
    # setup
    controller = AppController()

    # mock service methods used by controller
    # create a mock to handle context manager - mocks __enter__ and __exit__
    mock_app_service_instance = MagicMock()
    mock_app_service_instance.create_app.return_value = mock_create_app_response
    mock_app_service_instance.link_app_to_project.return_value = mock_link_app_response
    mock_app_service.return_value.__enter__.return_value = mock_app_service_instance

    response = controller.create_app(mock_user_id, mock_request_data)

    assert response["status"] == "success"
    assert response["app_id"] == mock_create_app_response

    mock_app_service_instance.create_app.assert_called_once_with(mock_user_id, mock_request_data)
    mock_app_service_instance.link_app_to_project.assert_called_once_with(
        mock_create_app_response, mock_request_data.__dict__
    )
