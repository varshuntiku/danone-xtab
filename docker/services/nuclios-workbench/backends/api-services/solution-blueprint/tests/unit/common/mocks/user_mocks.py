def mock_user():
    """Mock user that returns user"""

    class MockUser:
        id = 1
        first_name = "gilman"
        last_name = "fishers"
        email_address = "gilman_fishers@urilmazaki.com"

    return MockUser()
