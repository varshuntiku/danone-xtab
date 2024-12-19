import json

from .util import auth_token


def test_widgets(client):
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-api/widgets", headers=headers).status_code == 200

    assert client.get("/codex-api/widgets/widget-groups", headers=headers).status_code == 200

    data = {"name": "demo_1", "group_id": 1, "created_by": 2}

    resp = client.post("/codex-api/widgets", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    resp = client.post("/codex-api/widgets", data=json.dumps({}), headers=headers)
    assert resp.status_code == 422

    resp = client.get("/codex-api/widgets/1", headers=headers)
    assert resp.status_code == 200

    data = {"name": "test_1", "group_id": 1, "updated_by": 2}

    resp = client.post("/codex-api/widgets/1", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    resp = client.get("/codex-api/widgets/null", data=json.dumps({}), headers=headers)
    assert resp.status_code == 404

    resp = client.delete("/codex-api/widgets/1", headers=headers)
    assert resp.status_code == 200

    resp = client.delete("/codex-api/widgets/null", headers=headers)
    assert resp.status_code == 404

    resp = client.get("/codex-api/widgets/get-code-details/1/'TEST'", headers=headers)
    assert resp.status_code == 200

    data = {
        "repo": "test",
        "branch": "test",
        "path": "test",
        "tag": "test",
    }

    resp = client.post(
        "/codex-api/widgets/save-code-details/1/'TEST'",
        data=json.dumps(data),
        headers=headers,
    )
    assert resp.status_code == 200

    resp = client.post(
        "/codex-api/widgets/save-code-details/1/'TEST'",
        data=json.dumps({}),
        headers=headers,
    )
    assert resp.status_code == 500

    assert client.get("/codex-api/widgets/get-artifacts/1", headers=headers).status_code == 200

    resp = client.put("/codex-api/widgets/save-artifact/1", data=json.dumps({}), headers=headers)
    assert resp.status_code == 422

    resp = client.put("/codex-api/widgets/preview-code/1", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    resp = client.put("/codex-api/widgets/preview-code/1", data=json.dumps({}), headers=headers)
    assert resp.status_code == 422
