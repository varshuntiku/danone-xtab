async def mock_add_comment_in_comment_controller(*args, **kwargs):
    # returns a mock response for app creation
    return {"status": "success", "comment_id": 123}


def mock_edit_approval_controller(*args, **kwargs):
    return {"status": "success", "approval_id": 1}


mock_create_app_id_response = 123
mock_link_app_response = {"status": "success"}
mock_app_id = 123
mock_user_id = 1
