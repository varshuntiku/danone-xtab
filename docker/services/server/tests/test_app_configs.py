from .util import auth_token


def test_app(client):
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-api/app-configs/1", headers=headers).status_code == 200

    assert client.get("/codex-api/app-configs/environments", headers=headers).status_code == 200
