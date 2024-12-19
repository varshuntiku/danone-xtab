from unittest.mock import MagicMock, Mock, patch

from starlette.requests import Request
from tests.unit.comments.mocks.comment_mocks import (
    mock_add_comment_in_comment_controller,
    mock_edit_approval_controller,
)
from tests.unit.common.factories.apps.comment_factory import generate_comment_data
from tests.unit.common.mocks.user_mocks import mock_user


@patch("api.routes.apps.comments_route.CommentsController.add_comment", new_callable=Mock)
def test_unit_route_add_new_comment(mock_add_comment, client, monkeypatch):
    mock_add_comment.side_effect = mock_add_comment_in_comment_controller

    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)

    payload = generate_comment_data(app_id=123)
    response = client.post("nuclios-product-api/comments/app/screen/comment", json=payload)
    assert response.status_code == 200
    assert response.json() == {"status": "success", "comment_id": 123}


@patch("api.routes.apps.comments_route.CommentsController.edit_approval", new_callable=Mock)
def test_unit_route_edit_approval(mock_edit_approval, client, monkeypatch):
    mock_edit_approval.side_effect = mock_edit_approval_controller

    mock_request = MagicMock(spec=Request)
    mock_request.state.user = mock_user()

    monkeypatch.setattr("starlette.requests.Request.state", mock_request.state)

    payload = {"approval_id": 1, "status": "approved"}

    response = client.post("nuclios-product-api/comments/approval/edit/", json=payload)

    assert response.status_code == 200
    assert response.json() == {"status": "success", "approval_id": 1}
