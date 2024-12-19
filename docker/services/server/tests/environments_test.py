import json

from .util import auth_token


def test_app(client):
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-api/environments", headers=headers).status_code == 200

    data = {"name": "test", "created_by": 1}
    resp = client.post("/codex-api/environments", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    resp = client.post("/codex-api/environments", data=json.dumps({}), headers=headers)
    assert resp.status_code == 422

    assert client.get("/codex-api/environments/1", headers=headers).status_code == 200

    data = {"name": "test", "updated_by": 1}
    resp = client.post("/codex-api/environments/1", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    assert client.delete("/codex-api/environments/1", headers=headers).status_code == 200
