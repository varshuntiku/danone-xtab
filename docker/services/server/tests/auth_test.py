import json

from .util import auth_token, store_token


def test_login(client):
    mimetype = "application/json"
    headers = {"Content-Type": mimetype, "Accept": mimetype}
    data = {
        "username": "test@themathcompany.com",
        "password": "demo123",
    }
    resp = client.post("/codex-api/login", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    response_data = json.loads(resp.data)
    store_token(response_data)


def test_login_unauth(client):
    data = {
        "username": "test@themathcompany.com",
        "password": "demo1231",
    }
    resp = client.post(
        "/codex-api/login",
        data=json.dumps(data),
        headers={"Content-Type": "application/json"},
    )
    assert resp.status_code == 401


def test_hierarchy_info(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/hierarchy/get-info",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_user_info(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/user/get-info",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )
