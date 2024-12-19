import json

from .util import auth_token, get_nac_token


def test_default_pylist(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/dynamic-execution-environments/default", headers=headers).status_code == 200


def test_list(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/dynamic-execution-environments", headers=headers).status_code == 200


def test_create(client):
    (access_token, refresh_token) = auth_token()
    (nac_access_token) = get_nac_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "nac_access_token": f"{nac_access_token}",
    }

    data = {
        "name": "Execution Env1",
        "requirements": "numpy\nrequests\njson",
        "py_version": "3.9.2",
    }

    assert (
        client.post(
            "/codex-product-api/dynamic-execution-environments",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_show(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/dynamic-execution-environments/1", headers=headers).status_code == 200
    assert client.get("/codex-product-api/dynamic-execution-environments/5000", headers=headers).status_code == 404


# def test_start(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     assert client.get("/codex-product-api/dynamic-execution-environments/1/start",
#                       headers=headers).status_code == 200


def test_update(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    data = {
        "name": "Execution Env",
        "requirements": "requests\nnumpy",
        "py_version": "3.9.2",
    }

    assert (
        client.put(
            "/codex-product-api/dynamic-execution-environments/5000",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 404
    )

    assert (
        client.put(
            "/codex-product-api/dynamic-execution-environments/1",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_update_app_env_id(client):
    (access_token, refresh_token) = auth_token()
    (nac_access_token) = get_nac_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "nac_access_token": f"{nac_access_token}",
    }

    data = {"app_id": 500, "exec_env_id": 1}

    assert (
        client.put(
            "/codex-product-api/dynamic-execution-environments/app",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 500
    )

    data = {"app_id": 1, "exec_env_id": 1}

    assert (
        client.put(
            "/codex-product-api/dynamic-execution-environments/app",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_get_app_env_id(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/dynamic-execution-environments/app/1", headers=headers).status_code == 200


def test_delete(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.delete("/codex-product-api/dynamic-execution-environments/5000", headers=headers).status_code == 500

    assert client.delete("/codex-product-api/dynamic-execution-environments/1", headers=headers).status_code == 200
