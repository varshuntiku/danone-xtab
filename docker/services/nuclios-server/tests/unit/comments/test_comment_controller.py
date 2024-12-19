from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from api.controllers.apps.comments_controller import CommentsController
from api.schemas.apps.comments_schema import (
    ApprovalEditRequestSchema,
    CommentAddRequestSchema,
)
from fastapi import BackgroundTasks
from tests.unit.comments.mocks.comment_mocks import mock_create_app_id_response
from tests.unit.common.factories.apps.comment_factory import generate_comment_data

mock_user_id = 1
mock_request_data = CommentAddRequestSchema(**generate_comment_data())


@pytest.mark.asyncio
@patch("api.controllers.apps.comments_controller.CommentsService")
async def test_unit_controller_add_new_comment(mock_comments_service):
    controller = CommentsController()

    mock_background_tasks = BackgroundTasks()
    mock_comment_service_instance = MagicMock()
    mock_comment_service_instance.add_comment = AsyncMock(return_value=mock_create_app_id_response)
    mock_comments_service.return_value.__enter__.return_value = mock_comment_service_instance

    response = await controller.add_comment(mock_user_id, mock_request_data, mock_background_tasks)

    response = response.__dict__
    assert response["status"] == "success"
    assert response["comment_id"] == mock_create_app_id_response

    mock_comment_service_instance.add_comment.assert_called_once_with(
        mock_user_id, mock_request_data, mock_background_tasks
    )


mock_approval_request_data = ApprovalEditRequestSchema(approval_id=1, status="approved")


@patch("api.controllers.apps.comments_controller.CommentsService")
def test_unit_controller_edit_approval(mock_comments_service):
    controller = CommentsController()

    mock_comment_service_instance = MagicMock()
    mock_comment_service_instance.edit_approval.return_value = 1
    mock_comments_service.return_value.__enter__.return_value = mock_comment_service_instance

    response = controller.edit_approval(mock_user_id, mock_approval_request_data)

    response = response.__dict__
    assert response["status"] == "success"
    assert response["approval_id"] == 1

    mock_comment_service_instance.edit_approval.assert_called_once_with(
        user_id=mock_user_id, request_data=mock_approval_request_data
    )
