from unittest.mock import patch

import pytest
from api.middlewares.error_middleware import GeneralException
from api.schemas.apps.app_schema import CreateAppRequestSchema
from api.services.apps.app_service import AppService
from tests.unit.app.mocks.app_mocks import mock_app_id, mock_user_id
from tests.unit.common.factories.apps.app_factory import generate_app_data

mock_request_data = CreateAppRequestSchema(
    **generate_app_data(industry_id=1, function_id=1),
    env_key="production",
    source_app_id=10,
)


@patch("api.services.apps.app_service.AppDao")
def test_unit_service_create_new_app_with_source_app(mock_app_dao):
    """
    Scenario - 1:
    Test when both env_key and source_app_id are provided,
    and the source app exists
    """

    service = AppService()

    mock_app_dao_instance = mock_app_dao.return_value
    mock_app_dao_instance.check_app_by_id.return_value = 1
    mock_app_dao_instance.create_app_from_source_app.return_value.id = mock_app_id

    created_app_id = service.create_app(mock_user_id, mock_request_data)

    assert created_app_id == mock_app_id

    mock_app_dao_instance.check_app_by_id.assert_called_once_with(mock_request_data.source_app_id)
    mock_app_dao_instance.create_app_from_source_app.assert_called_once_with(mock_user_id, mock_request_data)


@patch("api.services.apps.app_service.AppDao")
def test_unit_service_create_new_app_with_nonexistent_source_app(mock_app_dao):
    """
    Scenario - 2:
    Test when env_key and source_app_id are provided,
    but the source app doesn't exist

    """

    service = AppService()

    mock_app_dao_instance = mock_app_dao.return_value
    mock_app_dao_instance.check_app_by_id.return_value = 0

    with pytest.raises(GeneralException) as exc_info:
        service.create_app(mock_user_id, mock_request_data)

    assert exc_info.value.message["error"] == "App with given id does not exist"

    mock_app_dao_instance.check_app_by_id.assert_called_once_with(mock_request_data.source_app_id)
