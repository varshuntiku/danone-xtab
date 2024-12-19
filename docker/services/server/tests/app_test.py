def test_basic(client):
    # assert client.get("/codex-product-api/info").status_code == 200
    assert client.get("/codex-api/").status_code == 200


def test_db_connect(client):
    resp = client.get("codex-api/info")
    assert b'"PostGreSQL: \\nPostgreSQL database connected\\n\\n"' in resp.data
