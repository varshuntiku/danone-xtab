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


def test_widget_group(client):
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    assert (
        client.get(
            "/codex-api/widget-groups",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )

    data = {
        "name": "test",
        "code": "test_code",
        "light_color": "yes",
        "dark_color": "no",
        "in_port": True,
        "out_port": True,
        "created_by": 1,
    }
    resp = client.post("/codex-api/widget-groups", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    resp = client.get("/codex-api/widget-groups/1", headers=headers)
    assert resp.status_code == 200

    resp = client.put("/codex-api/widget-groups/1", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200
