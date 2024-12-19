import json

from .util import auth_token


def get_headers_info():
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    return headers


def test_nac_user_role_create(client):
    headers = get_headers_info()

    data_create_1 = {"name": "test role 2", "role_permissions": [1, 2]}

    resp1 = client.post(
        "/codex-api/nac-user-roles",
        data=json.dumps(data_create_1),
        headers=headers,
    )
    assert resp1.status_code == 200

    data_create_2 = {}

    resp2 = client.post(
        "/codex-api/nac-user-roles",
        data=json.dumps(data_create_2),
        headers=headers,
    )
    assert resp2.status_code == 422


def test_nac_user_role_list(client):
    headers = get_headers_info()

    resp2 = client.get("/codex-api/nac-user-roles", headers=headers)
    assert resp2.status_code == 200


def test_show_nac_user_role(client):
    headers = get_headers_info()

    resp2 = client.get("/codex-api/nac-user-roles/2", headers=headers)
    assert resp2.status_code == 200

    resp2 = client.get("/codex-api/nac-user-roles/7", headers=headers)
    assert resp2.status_code == 404


def test_nac_user_role_update(client):
    headers = get_headers_info()

    data_update_1 = {"name": "test role edited", "role_permissions": [2]}

    resp2 = client.post("/codex-api/nac-user-roles/5", data=json.dumps(data_update_1), headers=headers)
    assert resp2.status_code == 200

    resp3 = client.post("/codex-api/nac-user-roles/7", data=json.dumps(data_update_1), headers=headers)
    assert resp3.status_code == 404

    resp4 = client.post("/codex-api/nac-user-roles/5", data=json.dumps({}), headers=headers)
    assert resp4.status_code == 500

    resp5 = client.post("/codex-api/nac-user-roles/5", data={}, headers=headers)
    assert resp5.status_code == 422


def test_nac_user_role_delete(client):
    headers = get_headers_info()

    resp2 = client.delete("/codex-api/nac-user-roles/6", headers=headers)
    assert resp2.status_code == 200

    resp3 = client.delete("/codex-api/nac-user-roles/7", headers=headers)
    assert resp3.status_code == 404


def test_nac_role_permissions(client):
    headers = get_headers_info()

    resp1 = client.get("/codex-api/nac-role-permissions", headers=headers)
    assert resp1.status_code == 200
