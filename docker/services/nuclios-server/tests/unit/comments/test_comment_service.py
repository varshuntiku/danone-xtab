from unittest.mock import patch

from api.schemas.apps.comments_schema import (
    ApprovalEditRequestSchema,
    CommentAddRequestSchema,
)
from api.services.apps.comments_service import CommentsService
from tests.unit.comments.mocks.comment_mocks import mock_app_id, mock_user_id
from tests.unit.common.factories.apps.comment_factory import generate_comment_data

mock_request_data = CommentAddRequestSchema(**generate_comment_data())


@patch("api.services.apps.comments_service.CommentsDao")
def test_add_comment(mock_comments_dao):
    service = CommentsService()

    mock_comments_dao_instance = mock_comments_dao.return_value
    mock_comments_dao_instance.add_comment.return_value.id = mock_app_id

    created_comment_id = service.add_comment(mock_user_id, mock_request_data)

    assert created_comment_id == mock_app_id

    mock_comments_dao_instance.add_comment.assert_called_once_with(mock_user_id, mock_request_data)


mock_request_data = ApprovalEditRequestSchema(approval_id=1, status="approved")


@patch("api.services.apps.comments_service.CommentsDao")
def test_edit_approval(mock_comments_dao):
    service = CommentsService()

    mock_comments_dao_instance = mock_comments_dao.return_value
    mock_comments_dao_instance.edit_approval.return_value.id = 1

    edited_approval_id = service.edit_approval(mock_user_id, mock_request_data)

    assert edited_approval_id == 1

    mock_comments_dao_instance.edit_approval.assert_called_once_with(mock_user_id, mock_request_data)
