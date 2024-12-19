import json

from .util import auth_token


def test_instance_list(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/casestudies/1",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_instance_user_list(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/casestudies/1/users",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_show_instance(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/casestudies/1/1",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_update_instance(client):
    (access_token, refresh_token) = auth_token()
    data = {"name": "test1"}

    assert (
        client.put(
            "/codex-api/casestudies/1/1",
            data=json.dumps(data),
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_delete_instance(client):
    (access_token, refresh_token) = auth_token()
    assert (
        client.delete(
            "/codex-api/casestudies/1/1",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


# def test_create_instance(client):
#     (access_token, refresh_token) = auth_token()
#     data = {
#         "name": "test",
#         "project_status": 2,
#         "reviewer": 1
#     }

#     assert client.post("/codex-api/casestudies/1",
#                       data=json.dumps(data), headers={'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}).status_code == 200
