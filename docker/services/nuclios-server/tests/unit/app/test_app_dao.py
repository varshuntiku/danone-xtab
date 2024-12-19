from unittest.mock import MagicMock

from api.daos.apps.app_dao import AppDao
from api.models.base_models import App, AppProjectMapping
from api.schemas.apps.app_schema import CreateAppRequestSchema
from sqlalchemy.orm import Session
from tests.unit.common.factories.apps.app_factory import generate_app_data


def test_unit_dao_link_app_to_project():
    mock_db_session = MagicMock(spec=Session)

    app_dao = AppDao(mock_db_session)

    app_dao.link_app_to_project(app_id=1, project_id=100)

    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()

    app_project_mapping = mock_db_session.add.call_args[0][0]
    assert isinstance(app_project_mapping, AppProjectMapping)
    assert app_project_mapping.app_id == 1
    assert app_project_mapping.project_id == 100


def test_unit_dao_check_app_by_id():
    mock_db_session = MagicMock(spec=Session)
    mock_query = mock_db_session.query.return_value
    mock_query.filter_by.return_value.count.return_value = 1  # Simulate app found

    app_dao = AppDao(mock_db_session)

    result = app_dao.check_app_by_id(app_id=1)
    assert result == 1

    # test if the correct SQLAlchemy methods were called
    mock_db_session.query.assert_called_once_with(App)
    mock_query.filter_by.assert_called_once_with(id=1, deleted_at=None)


def test_unit_dao_create_app_from_source_app():
    mock_db_session = MagicMock(spec=Session)

    mock_request_data = CreateAppRequestSchema(
        **generate_app_data(),
        source_app_id=10,
        env_key="production",
    )

    app_dao = AppDao(mock_db_session)

    # create a mock SQLAlchemey App model -- limits the mock obj
    # to contain only SQLAlchemy model methods and properties
    mock_source_app = MagicMock(spec=App)
    mock_db_session.query.return_value.filter_by.return_value.first.return_value = mock_source_app

    mock_source_app.name = "Sources App Name"
    mock_source_app.contact_email = "source@app.com"

    new_app = app_dao.create_app_from_source_app(user_id=1, request_data=mock_request_data)

    mock_db_session.add.assert_called_once_with(new_app)
    mock_db_session.commit.assert_called_once()

    print("new app name", new_app.name, mock_source_app.name)
    assert new_app.name == mock_source_app.name
    assert new_app.contact_email == mock_source_app.contact_email
