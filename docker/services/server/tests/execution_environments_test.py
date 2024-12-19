import json
import warnings

from .util import auth_token


def test_app(client):
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-api/execution-environments", headers=headers).status_code == 200

    data = {
        "name": "test",
        "requirements": "test1",
        "created_by": 1,
        "env_type": "test exec env",
        "py_version": 3.10,
        "config": {},
    }

    warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)

    resp = client.post("/codex-api/execution-environments", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    resp = client.post("/codex-api/execution-environments", data=json.dumps({}), headers=headers)
    assert resp.status_code == 422

    assert client.get("/codex-api/execution-environments/1", headers=headers).status_code == 200

    data = {
        "name": "test",
        "requirements": "tets1",
        "updated_by": 1,
        "config": {},
        "env_type": "test exec env",
        "py_version": 3.10,
    }

    resp = client.post("/codex-api/execution-environments/1", data=json.dumps(data), headers=headers)
    assert resp.status_code == 200

    assert client.delete("/codex-api/execution-environments/1", headers=headers).status_code == 200
