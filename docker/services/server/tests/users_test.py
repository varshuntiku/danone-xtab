import json

from .util import auth_token, store_token

# from ..api.blueprints.multi_factor_auth import generate_totp
# from unittest import mock


def test_users(client):
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    user_list_data = {"page": 0, "pageSize": 10, "sorted": [], "filtered": []}

    assert client.put("/codex-api/users/list", data=json.dumps(user_list_data), headers=headers).status_code == 200

    assert client.get("/codex-api/users/user-groups", headers=headers).status_code == 200
    user_group_data = {
        "all_projects": "",
        "app": True,
        "app_publish": "",
        "case_studies": True,
        "environments": "",
        "my_projects": "",
        "my_projects_only": True,
        "name": "coach",
        "rbac": "",
        "widget_factory": "",
    }
    assert client.post("/codex-api/user-groups", data=json.dumps(user_group_data), headers=headers).status_code == 200

    data = {
        "first_name": "test1",
        "last_name": "test2",
        "email_address": "testt@themathcompany.com",
        "created_by": 1,
        "access_key": True,
        "user_groups": [],
        "password": False,
        "restricted_user": True,
    }

    resp = client.post("/codex-api/users", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200 or resp.status_code == 409

    resp = client.post("/codex-api/users", data=json.dumps({}), headers=headers)
    assert resp.status_code == 422

    resp = client.post("/codex-api/users/update", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    resp = client.post("/codex-api/users/update", data=json.dumps({}), headers=headers)
    assert resp.status_code == 422

    assert client.get("/codex-api/users/1", headers=headers).status_code == 200

    resp = client.post("/codex-api/users/1", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200 or resp.status_code == 409


def test_users_email(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-api/users-email", headers=headers).status_code == 200


def test_generate_code(client):
    # Commenting until Sendgrid is back online
    data = {"email": "test@themathcompany.com"}

    x = client.post("/codex-api/user/generate-code", data=json.dumps(data))
    assert x.status_code == 200


def test_update_password(client):
    (access_token, refresh_token) = auth_token()

    headers_create = {"Authorization": f"Bearer {access_token}"}

    data_create = {
        "first_name": "test",
        "last_name": "user",
        "email_address": "testuser@themathcompany.com",
        "created_by": 1,
        "access_key": True,
        "user_groups": [],
        "password": "Codx@123",
        "restricted_user": False,
    }

    resp_create = client.post("/codex-api/users", data=json.dumps(data_create), headers=headers_create)

    assert resp_create.status_code == 200

    mimetype = "application/json"
    headers_login = {"Content-Type": mimetype, "Accept": mimetype}
    data_login = {
        "username": "testuser@themathcompany.com",
        "password": "Codx@123",
    }
    resp_login = client.post("/codex-api/login", data=json.dumps(data_login), headers=headers_login)
    assert resp_login.status_code == 200

    response_data = json.loads(resp_login.data)
    store_token(response_data)

    (access_token, refresh_token) = auth_token()

    headers_update = {"Authorization": f"Bearer {access_token}"}

    data_update_password = {
        "password": "Codx@123",
        "new_password": "Codx@123#",
        "confirm_password": "Codx@123#",
    }

    resp_update = client.post(
        "/codex-api/user/update-password",
        data=json.dumps(data_update_password),
        headers=headers_update,
    )

    assert resp_update.status_code == 200
