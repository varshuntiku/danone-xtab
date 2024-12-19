from unittest.mock import MagicMock, Mock, patch

from starlette.requests import Request
from tests.unit.common.factories.dashboards.industry_factory import (
    generate_industry_data,
)
from tests.unit.common.mocks.user_mocks import mock_user
from tests.unit.dashboards.mocks.industry_mocks import (
    mock_create_industry_in_dashboard_controller,
    mock_delete_industry_in_dashboard_controller,
    mock_get_industry_in_dashboard_controller,
    mock_update_industry_in_dashboard_controller,
)


@patch(
    "api.routes.dashboards.industry_route.IndustryController.create_industry",
    new_callable=Mock,
)
def test_unit_route_create_industries(mock_create_industry, client, monkeypatch):
    mock_create_industry.side_effect = mock_create_industry_in_dashboard_controller

    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)

    payload = generate_industry_data()

    response = client.post("nuclios-product-api/industry", json=payload)
    assert response.status_code == 201
    assert response.json() == {
        "message": "Industry Created Successfully",
        "industry_data": {
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
    }


@patch(
    "api.routes.dashboards.industry_route.IndustryController.get_industries",
    new_callable=Mock,
)
def test_unit_route_get_industries(mock_get_industry, client, monkeypatch):
    mock_get_industry.side_effect = mock_get_industry_in_dashboard_controller

    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)

    response = client.get("nuclios-product-api/industry")
    assert response.status_code == 200
    assert response.json() == [
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


@patch(
    "api.routes.dashboards.industry_route.IndustryController.update_industry",
    new_callable=Mock,
)
def test_unit_route_update_industry(mock_get_industry, client, monkeypatch):
    mock_get_industry.side_effect = mock_update_industry_in_dashboard_controller

    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)
    industry_id = 2
    payload = generate_industry_data()
    response = client.put(f"nuclios-product-api/industry/{industry_id}", json=payload)
    assert response.status_code == 200
    assert response.json() == {
        "message": "Updated successfully",
        "industry_data": {
            "id": 2,
            "industry_name": "Test Industry1",
            "parent_industry_id": None,
            "logo_name": "Other Industry",
            "horizon": "horizontal",
            "order": 10,
            "level": None,
            "color": None,
            "description": "",
        },
    }


@patch(
    "api.routes.dashboards.industry_route.IndustryController.delete_industry",
    new_callable=Mock,
)
def test_unit_route_delete_industry(mock_delete_industry, client, monkeypatch):
    mock_delete_industry.side_effect = mock_delete_industry_in_dashboard_controller

    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)

    response = client.delete("nuclios-product-api/industry/1")
    assert response.status_code == 200
    assert response.json() == {"message": " deleted successfully"}
