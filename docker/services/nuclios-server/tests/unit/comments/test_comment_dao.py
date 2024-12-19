from unittest.mock import AsyncMock, MagicMock

import pytest
from api.daos.apps.comments_dao import (
    ApprovalAddSchema,
    ApprovalEditRequestSchema,
    Comment,
    CommentAddRequestSchema,
    CommentsDao,
)
from fastapi import BackgroundTasks

# Replace with actual import


@pytest.mark.asyncio
async def test_unit_dao_add_comment():
    # Mock dependencies
    mock_db_session = MagicMock()
    mock_users_dao = MagicMock()
    mock_notifications_dao = MagicMock()
    mock_background_tasks = BackgroundTasks()

    # Mock request data
    request_data = CommentAddRequestSchema(
        app_id=1,
        app_screen_id=1,
        widget_id=1,
        comment_text="This is a test comment",
        attachments=[],
        tagged_users=[1, 2],
        status="active",
        bookmarked=False,
        mode="task",  # Mode is 'task' to trigger approval-related logic
        filters={},
        link=None,
        widget_name="Test Widget",
        approvals=[ApprovalAddSchema(user_id=1, name="test_user", status="pending")],
    )

    # Mock DAO methods
    mock_users_dao.get_user_by_id.side_effect = lambda user_id: MagicMock(
        email_address=f"user{user_id}@example.com",
        full_name=f"User {user_id}",
    )
    mock_notifications_dao.bulk_save_notification_objects = MagicMock()

    # Mock async methods
    mock_add_approval = AsyncMock(return_value=[123])
    mock_create_filter_and_generate_link = AsyncMock(return_value="http://example.com/updated-link")
    mock_send_approval_notifications = MagicMock()
    mock_send_comment_notifications = MagicMock()

    # Initialize DAO
    comments_dao = CommentsDao(mock_db_session)
    comments_dao.users_doa = mock_users_dao
    comments_dao.notifications_dao = mock_notifications_dao

    # Replace async methods in the DAO
    comments_dao.add_approval = mock_add_approval
    comments_dao.create_filter_and_generate_link = mock_create_filter_and_generate_link
    comments_dao.send_approval_notifications = mock_send_approval_notifications
    comments_dao.send_comment_notifications = mock_send_comment_notifications

    # Call the method under test
    result = await comments_dao.add_comment(
        user_id=1, request_data=request_data, background_tasks=mock_background_tasks
    )

    # Assertions
    assert result is not None
    assert mock_users_dao.get_user_by_id.call_count == 4
    assert isinstance(result, Comment)
    mock_users_dao.get_user_by_id.assert_any_call(1)
    mock_users_dao.get_user_by_id.assert_any_call(2)
    mock_db_session.add.assert_called_once()
    mock_db_session.commit.assert_called_once()

    # Verify `add_approval` and `send_approval_notifications` were invoked
    mock_add_approval.assert_called_once_with(request_data.approvals, result.id)
    mock_send_approval_notifications.assert_called_once_with(
        request_data.approvals, result, "http://example.com/updated-link"
    )
    mock_send_comment_notifications.assert_called_once()


def test_unit_dao_edit_approval():
    mock_db_session = MagicMock()
    request_data = ApprovalEditRequestSchema(
        approval_id=1,
        status="approved",
    )
    comments_dao = CommentsDao(mock_db_session)

    edited_approval_id = comments_dao.edit_approval(user_id=1, request_data=request_data)
    mock_db_session.add.assert_called_once()  # Ensure the comment is added to the DB
    mock_db_session.commit.assert_called_once()

    assert edited_approval_id is not None


# Replace with the actual import


@pytest.mark.asyncio
async def test_unit_dao_add_approval():
    # Mock the database session
    mock_db_session = MagicMock()

    # Prepare request data
    request_data = [
        ApprovalAddSchema(user_id=1, name="test_user", status="pending"),
        ApprovalAddSchema(user_id=2, name="another_user", status="approved"),
    ]

    # Initialize the DAO
    comments_dao = CommentsDao(mock_db_session)

    # Call the `add_approval` method
    approval_ids = await comments_dao.add_approval(request_data, comment_id=1)

    # Assertions
    # Verify the add method was called for each approval
    assert mock_db_session.add.call_count == len(request_data)
    for i, call in enumerate(mock_db_session.add.call_args_list):
        added_approval = call[0][0]
        assert added_approval.user_id == request_data[i].user_id
        assert added_approval.name == request_data[i].name
        assert added_approval.status == request_data[i].status
        assert added_approval.comment_id == 1

    # Verify commit was called once
    mock_db_session.commit.assert_called_once()

    # Ensure returned IDs match the expected number of approvals
    assert len(approval_ids) == len(request_data)
