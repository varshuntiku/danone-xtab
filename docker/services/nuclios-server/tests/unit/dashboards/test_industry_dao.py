from unittest.mock import MagicMock

from api.daos.dashboards.industry_dao import IndustryDao
from api.models.base_models import Industry
from api.schemas.dashboards.industry_schema import IndustryCreateRequestSchema
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_
from tests.unit.common.factories.dashboards.industry_factory import (
    generate_industry_data,
)
from tests.unit.dashboards.mocks.industry_mocks import mock_get_industry_response


def test_unit_dao_check_industry_by_name():
    mock_db_session = MagicMock(spec=Session)
    mock_query = mock_db_session.query.return_value
    mock_query.filter_by.return_value.count.return_value = 1
    industry_dao = IndustryDao(mock_db_session)

    result = industry_dao.check_industry_by_name(industry_name="Test Industry")
    assert result == 1

    mock_db_session.query.assert_called_once_with(Industry)
    mock_query.filter_by.assert_called_once_with(deleted_at=None, industry_name="Test Industry")


def test_unit_dao_create_industry():
    mock_db_session = MagicMock(spec=Session)

    mock_request_data = IndustryCreateRequestSchema(**generate_industry_data())

    industry_dao = IndustryDao(mock_db_session)

    # create a mock SQLAlchemey Industry model -- limits the mock obj
    # to contain only SQLAlchemy model methods and properties
    moock_industry = MagicMock(spec=Industry)
    mock_db_session.query.return_value.filter_by.return_value.first.return_value = moock_industry

    moock_industry.name = "Sources App Name"
    moock_industry.contact_email = "source@app.com"

    new_industry = industry_dao.create_industry(user_id=1, request_data=mock_request_data)

    mock_db_session.add.assert_called_once_with(new_industry)
    mock_db_session.commit.assert_called_once()
    assert isinstance(new_industry, Industry)
    assert new_industry.industry_name == mock_request_data.industry_name


def test_unit_dao_get_industries():
    # Create a mock DB session and query results
    mock_db_session = MagicMock(spec=Session)
    mock_query = mock_db_session.query.return_value
    mock_query.filter_by.return_value.order_by.return_value.all.return_value = mock_get_industry_response

    industry_dao = IndustryDao(mock_db_session)

    # Call the method being tested
    result = industry_dao.get_industries()

    # Assert: Validate the results
    assert len(result) == 2
    assert result[0]["industry_name"] == "Test Industry1"
    assert result[1]["industry_name"] == "Test Industry2"

    # Ensure the query methods were called correctly
    mock_db_session.query.assert_called_once_with(Industry)
    mock_query.filter_by.assert_called_once_with(deleted_at=None)
    mock_query.filter_by.return_value.order_by.assert_called_once()
    mock_query.filter_by.return_value.order_by.return_value.all.assert_called_once()


def test_unit_dao_check_industry_by_name_update():
    # Create a mock DB session and set up query responses
    mock_db_session = MagicMock(spec=Session)
    mock_query = mock_db_session.query.return_value
    mock_filter = mock_query.filter.return_value
    mock_filter.count.return_value = 1  # Simulate a query returning a count of 1

    industry_name = "Test Industry"
    industry_id = 1

    industry_dao = IndustryDao(mock_db_session)

    # Call the method being tested
    result = industry_dao.check_industry_by_name_update(industry_name, industry_id)

    # Assert: Validate the result
    assert result == 1  # Ensure the count returned by the method matches the expected result

    # Ensure the query methods were called correctly
    mock_db_session.query.assert_called_once_with(Industry)
    assert mock_query.filter.call_count == 1
    filter_args, _ = mock_query.filter.call_args
    assert len(filter_args) == 1
    # Verify that the filter has the correct conditions
    assert str(filter_args[0].compile(compile_kwargs={"literal_binds": True})) == str(
        and_(
            Industry.deleted_at.is_(None),
            Industry.industry_name == industry_name,
            Industry.id != industry_id,
        ).compile(compile_kwargs={"literal_binds": True})
    )


def test_unit_dao_update_industry():
    # Create a mock DB session and set up the necessary query responses
    mock_db_session = MagicMock(spec=Session)
    mock_db_session.query.return_value.filter_by.return_value.scalar.return_value = 2  # Max order value

    # Mock request data and user ID
    industry_id = 2
    user_id = 100
    mock_request_data = IndustryCreateRequestSchema(**generate_industry_data())

    # Mock the industry to be returned by `get_industry_by_id`
    mock_industry = MagicMock(spec=Industry)
    mock_industry.order = 5
    mock_industry.industry_name = "Old Industry"

    industry_dao = IndustryDao(mock_db_session)
    industry_dao.get_industry_by_id = MagicMock(return_value=mock_industry)

    # Call the method being tested
    updated_industry = industry_dao.update_industry(user_id, industry_id, mock_request_data)

    # Assert: Validate the industry was updated correctly
    assert updated_industry.industry_name == mock_request_data.industry_name
    assert updated_industry.color == mock_request_data.color
    assert updated_industry.level == mock_request_data.level
    assert updated_industry.updated_by == user_id

    mock_db_session.commit.assert_called_once()


def test_unit_dao_delete_industry():
    # Create a mock DB session
    mock_db_session = MagicMock(spec=Session)

    # Mock the user ID and industry ID
    industry_id = 2
    user_id = 100

    # Mock the industry to be returned by `get_industry_by_id`
    mock_industry = MagicMock(spec=Industry)

    # Mock the `get_industry_by_id` method
    industry_dao = IndustryDao(mock_db_session)
    industry_dao.get_industry_by_id = MagicMock(return_value=mock_industry)

    # Call the method being tested
    industry_dao.delete_industry(user_id, industry_id)

    # Assert: Validate the industry was marked as deleted and updated by the correct user
    assert mock_industry.deleted_by == user_id

    # Ensure commit was called once
    mock_db_session.commit.assert_called_once()

    # Ensure `get_industry_by_id` was called with the correct industry ID
    industry_dao.get_industry_by_id.assert_called_once_with(industry_id)

    # Ensure that in case of an exception, rollback is triggered (optional check)
    mock_db_session.rollback.assert_not_called()
