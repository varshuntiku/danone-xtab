from unittest.mock import MagicMock, Mock, patch

from starlette.requests import Request
from tests.unit.app.mocks.app_mocks import mock_create_app_in_app_controller
from tests.unit.common.factories.apps.app_factory import generate_app_data
from tests.unit.common.mocks.user_mocks import mock_user


@patch(
    "api.routes.apps.app_route.AppController.create_app",
    new_callable=Mock,
)
def test_unit_route_create_new_app(mock_create_app, client, monkeypatch):
    mock_create_app.side_effect = mock_create_app_in_app_controller

    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)

    payload = generate_app_data(industry_id=1, function_id=1)

    response = client.post("nuclios-product-api/app-admin/app", json=payload)
    assert response.status_code == 200
    assert response.json() == {"status": "success", "app_id": 123}
