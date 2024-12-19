from .util import auth_token


def test_get_objectives(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/1/objectives", headers=headers).status_code == 200


def test_get_objective_steps(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/objectives/1/steps", headers=headers).status_code == 200
