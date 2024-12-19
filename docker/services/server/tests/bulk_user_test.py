import io

from .util import auth_token


def test_bulk_users(client):
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.get("/codex-api/bulk/lists/users", headers=headers).status_code == 200

    file_name = "fake-text-stream.txt"
    data = {"file": (io.BytesIO(b"some initial text data"), file_name)}
    response = client.post("/codex-api/bulk/users", data=data, headers=headers)
    assert response.status_code == 400
