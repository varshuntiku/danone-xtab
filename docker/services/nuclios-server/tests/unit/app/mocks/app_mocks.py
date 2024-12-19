def mock_create_app_in_app_controller(*args, **kwargs):
    # returns a mock response for app creation
    return {"status": "success", "app_id": 123}


mock_create_app_id_response = 123  # Mock new app ID
mock_link_app_response = {"status": "success"}
mock_app_id = 123
mock_user_id = 1
