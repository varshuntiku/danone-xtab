import pytest
from tests.mocks.auth import generate_jwt_token


@pytest.mark.parametrize(
    "test_client",
    [{"auth_token": generate_jwt_token()}],
    indirect=True,
)
def test_get_info_endpoint(test_client):
    response = test_client.get("/user/get-info")
    assert response.status_code == 200
    assert response.json()["user_name"] == "copilot@ee.com"
