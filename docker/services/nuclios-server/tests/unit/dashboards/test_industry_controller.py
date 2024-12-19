from types import SimpleNamespace
from unittest.mock import MagicMock, patch

from api.controllers.dashboards.industry_controller import IndustryController
from api.schemas.dashboards.industry_schema import IndustryCreateRequestSchema
from tests.unit.common.factories.dashboards.industry_factory import (
    generate_industry_data,
)
from tests.unit.dashboards.mocks.industry_mocks import (
    mock_create_industry_response,
    mock_delete_industry_response,
    mock_get_industry_response,
    mock_update_industry_response,
)

# Mocked data for the test
mock_user_id = 1
mock_request_data = IndustryCreateRequestSchema(**generate_industry_data())

# Wrap the mock response in SimpleNamespace to make it behave like an object


@patch("api.controllers.dashboards.industry_controller.IndustryService")
def test_unit_controller_create_new_industry(mock_industry_service):
    # setup
    controller = IndustryController()
    mock_industry_obj = SimpleNamespace(**mock_create_industry_response)
    # mock service methods used by controller
    # create a mock to handle context manager - mocks __enter__ and __exit__
    mock_industry_service_instance = MagicMock()
    mock_industry_service_instance.create_industry.return_value = mock_industry_obj
    mock_industry_service.return_value.__enter__.return_value = mock_industry_service_instance

    response = controller.create_industry(mock_user_id, mock_request_data)

    assert response["message"] == "Industry Created Successfully"
    assert response["industry_data"].dict() == mock_create_industry_response

    mock_industry_service_instance.create_industry.assert_called_once_with(mock_user_id, mock_request_data)


@patch("api.controllers.dashboards.industry_controller.IndustryService")
def test_unit_controller_get_industries(mock_industry_service):
    """
    Test the get_industries method of IndustryController
    """
    # Arrange: Create the controller
    controller = IndustryController()

    # Serialize the actual response to match expected dictionary format
    # Mock the return value from the service
    mock_industries = [
        SimpleNamespace(**mock_get_industry_response[0]),
        SimpleNamespace(**mock_get_industry_response[1]),
    ]
    # Setup mock service methods using context manager (__enter__ and __exit__)
    mock_industry_service_instance = MagicMock()
    mock_industry_service_instance.get_industries.return_value = mock_industries
    mock_industry_service.return_value.__enter__.return_value = mock_industry_service_instance

    # Act: Call the method being tested
    response = controller.get_industries()
    serialized_response = [industry.dict() for industry in response]
    # Assert: Validate the results
    assert isinstance(serialized_response, list)
    assert len(serialized_response) == len(mock_get_industry_response)
    # Ensure that the result matches the mock data
    assert serialized_response == [
        {
            "id": 1,
            "industry_name": "Test Industry1",
            "parent_industry_id": None,
            "logo_name": "Other Industry",
            "horizon": "horizontal",
            "order": 10,
            "level": None,
            "color": None,
            "description": "",
        },
        {
            "id": 2,
            "industry_name": "Test Industry2",
            "parent_industry_id": None,
            "logo_name": "Other Industry",
            "horizon": "horizontal",
            "order": 11,
            "level": None,
            "color": None,
            "description": "",
        },
    ]


@patch("api.controllers.dashboards.industry_controller.IndustryService")
def test_unit_controller_update_industry(mock_industry_service):
    # setup
    controller = IndustryController()
    mock_industry_obj = SimpleNamespace(**mock_update_industry_response)
    # mock service methods used by controller
    # create a mock to handle context manager - mocks __enter__ and __exit__
    mock_industry_service_instance = MagicMock()
    mock_industry_service_instance.update_industry.return_value = mock_industry_obj
    mock_industry_service.return_value.__enter__.return_value = mock_industry_service_instance
    industry_id = 2
    response = controller.update_industry(mock_user_id, industry_id, mock_request_data)
    assert response["message"] == "Updated successfully"
    assert response["industry_data"].dict() == mock_update_industry_response

    mock_industry_service_instance.update_industry.assert_called_once_with(mock_user_id, industry_id, mock_request_data)


@patch("api.controllers.dashboards.industry_controller.IndustryService")
def test_unit_controller_delete_industry(mock_industry_service):
    # setup
    controller = IndustryController()
    mock_reponse_obj = SimpleNamespace(**mock_delete_industry_response)
    # mock service methods used by controller
    # create a mock to handle context manager - mocks __enter__ and __exit__
    mock_industry_service_instance = MagicMock()
    mock_industry_service_instance.delete_industry.return_value = mock_reponse_obj
    mock_industry_service.return_value.__enter__.return_value = mock_industry_service_instance
    mock_industry_id = 1
    response = controller.delete_industry(mock_user_id, mock_industry_id)

    assert response.message == " deleted successfully"

    mock_industry_service_instance.delete_industry.assert_called_once_with(mock_user_id, mock_industry_id)
