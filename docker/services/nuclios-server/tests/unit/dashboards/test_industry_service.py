from unittest.mock import patch

from api.constants.dashboards.industry_error_messages import IndustryErrors
from api.dtos.dashboards.industry_dto import IndustryDTO
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import Industry
from api.schemas.dashboards.industry_schema import IndustryCreateRequestSchema
from api.services.dashboards.industry_service import IndustryService
from fastapi import status
from tests.unit.common.factories.dashboards.industry_factory import (
    generate_industry_data,
)
from tests.unit.dashboards.mocks.industry_mocks import mock_delete_industry_response

mock_user_id = 1


@patch("api.services.dashboards.industry_service.IndustryDao")
def test_unit_service_create_industry(mock_industry_dao):
    mock_request_data = IndustryCreateRequestSchema(**generate_industry_data())
    mock_industry = Industry(**generate_industry_data())

    mock_industry_dto = IndustryDTO(mock_industry)
    service = IndustryService()

    # Mock the DAO methods to return actual data, not MagicMock
    mock_industry_dao_instance = mock_industry_dao.return_value
    mock_industry_dao_instance.check_industry_by_name.return_value = 0  # Industry name does not exist
    mock_industry_dao_instance.create_industry.return_value = mock_industry  # Return mock_industry

    # Call the service method
    created_industry_dto = service.create_industry(mock_user_id, mock_request_data)

    # Compare the actual data in both DTOs
    assert created_industry_dto.__dict__ == mock_industry_dto.__dict__

    # Ensure DAO methods are called correctly
    mock_industry_dao_instance.check_industry_by_name.assert_called_once_with(mock_request_data.industry_name)
    mock_industry_dao_instance.create_industry.assert_called_once_with(mock_user_id, mock_request_data)


@patch("api.services.dashboards.industry_service.IndustryDao")
def test_unit_service_create_industry_name_exists(mock_industry_dao):
    service = IndustryService()
    mock_request_data = IndustryCreateRequestSchema(**generate_industry_data())

    # Mock the DAO instance methods
    mock_industry_dao_instance = mock_industry_dao.return_value
    mock_industry_dao_instance.check_industry_by_name.return_value = 1  # Industry name already exists

    # Test if GeneralException is raised when industry name already exists
    try:
        service.create_industry(mock_user_id, mock_request_data)
    except GeneralException as exc:
        assert exc.status_code == status.HTTP_400_BAD_REQUEST
        assert exc.message == IndustryErrors.INDUSTRY_NAME_ALREADY_EXISTS_ERROR.value

    # Assert that the create_industry method wasn't called due to the exception
    mock_industry_dao_instance.create_industry.assert_not_called()


@patch("api.services.dashboards.industry_service.IndustryDao")
def test_unit_service_get_industries(mock_industry_dao):
    service = IndustryService()
    mock_industry_1 = Industry(**generate_industry_data())
    mock_industry_2 = Industry(**generate_industry_data())

    mock_industry_dto_1 = IndustryDTO(mock_industry_1)
    mock_industry_dto_2 = IndustryDTO(mock_industry_2)
    # Mock the DAO methods to return actual data, not MagicMock
    mock_industry_dao_instance = mock_industry_dao.return_value
    mock_industry_dao_instance.get_industries.return_value = [
        mock_industry_1,
        mock_industry_2,
    ]  # Return mock industries

    # Call the service method
    industries_dto_list = service.get_industries()

    # Compare the actual data in both DTO lists
    assert len(industries_dto_list) == 2
    assert industries_dto_list[0].__dict__ == mock_industry_dto_1.__dict__
    assert industries_dto_list[1].__dict__ == mock_industry_dto_2.__dict__

    # Ensure DAO methods are called correctly
    mock_industry_dao_instance.get_industries.assert_called_once()


@patch("api.services.dashboards.industry_service.IndustryDao")
def test_unit_service_update_industry(mock_industry_dao):
    # Generate mock request and industry data
    mock_request_data = IndustryCreateRequestSchema(**generate_industry_data())
    mock_industry = Industry(**generate_industry_data())

    # Create mock IndustryDTO from the mock industry
    mock_industry_dto = IndustryDTO(mock_industry)

    # Initialize the service
    service = IndustryService()

    # Mock the DAO methods to return actual data, not MagicMock
    mock_industry_dao_instance = mock_industry_dao.return_value
    mock_industry_dao_instance.check_industry_exist_by_id.return_value = 1
    mock_industry_dao_instance.check_industry_by_name_update.return_value = 0
    mock_industry_dao_instance.update_industry.return_value = (
        mock_industry  # Ensure update returns the real industry object
    )

    industry_id = 2

    # Call the service method
    updated_industry_dto = service.update_industry(mock_user_id, industry_id, mock_request_data)

    # Debug print statements

    # Compare the actual data in both DTOs
    assert updated_industry_dto.__dict__ == mock_industry_dto.__dict__

    # Ensure DAO methods are called correctly
    mock_industry_dao_instance.check_industry_exist_by_id.assert_called_once_with(industry_id)
    mock_industry_dao_instance.check_industry_by_name_update.assert_called_once_with(
        mock_request_data.industry_name, industry_id
    )


@patch("api.services.dashboards.industry_service.IndustryDao")
def test_unit_service_delete_industry(mock_industry_dao):
    # Initialize the service
    service = IndustryService()

    # Mock the DAO methods to return actual data, not MagicMock
    mock_industry_dao_instance = mock_industry_dao.return_value
    mock_industry_dao_instance.check_industry_exist_by_id.return_value = 1
    mock_industry_dao_instance.delete_industry.return_value = None

    industry_id = 2

    # Call the service method
    delete_industry_response = service.delete_industry(mock_user_id, industry_id)
    assert delete_industry_response == mock_delete_industry_response
    # Ensure DAO methods are called correctly
    mock_industry_dao_instance.check_industry_exist_by_id.assert_called_once_with(industry_id)
