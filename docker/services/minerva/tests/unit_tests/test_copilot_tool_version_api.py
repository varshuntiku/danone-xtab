# import pytest
# from fastapi.testclient import TestClient
# from tests.mocks.auth import generate_jwt_token


# @pytest.mark.parametrize(
#     "test_client",
#     [{"auth_token": generate_jwt_token()}],
#     indirect=True,
# )
# def test_get_copilot_tool_versions(test_client):
#     response = test_client.get("/copilot_tool/tool/1/tool-version/list")
#     assert response.status_code == 200
