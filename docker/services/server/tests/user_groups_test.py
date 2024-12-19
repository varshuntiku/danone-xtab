import json

from .util import auth_token


def test_user_group(client):
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    assert (
        client.get(
            "/codex-api/users/user-groups",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )
    data = {
        "name": "widget-factory",
        "data_prep": True,
        "model_train": True,
        "model_pipelines": True,
        "app_builder": True,
        "app_publish": True,
        "rbac": True,
        "user_group_type": 1,
    }

    resp = client.post("/codex-api/user-groups", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    resp = client.post("/codex-api/user-groups", data=json.dumps({}), headers=headers)
    assert resp.status_code == 422

    resp = client.get("/codex-api/user-groups/3", headers=headers)
    assert resp.status_code == 200

    data = {
        "name": "widget-factory",
        "data_prep": True,
        "model_train": True,
        "model_pipelines": True,
        "app_builder": True,
        "app_publish": False,
        "rbac": True,
        "user_group_type": 1,
    }
    resp = client.put("/codex-api/user-groups/3", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    resp = client.put("/codex-api/user-groups/null", data=json.dumps(data), headers=headers)
    assert resp.status_code == 404

    resp = client.delete("/codex-api/user-groups/3", headers=headers)
    assert resp.status_code == 200

    resp = client.delete("/codex-api/user-groups/null", headers=headers)
    assert resp.status_code == 404
