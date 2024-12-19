import json

from api.config import AZURE_BLOB_ROOT_URL

from .util import auth_token, get_nac_token


def test_get_archived_uiacs(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app-admin/app/26/archived-uiac/list", headers=headers).status_code == 200


def test_get_guide(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app-admin/app/1/screen/1/user-guide", headers=headers).status_code == 200


def test_save_guide(client):
    (access_token, refresh_token) = auth_token()
    (nac_access_token) = get_nac_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "nac_access_token": f"{nac_access_token}",
    }

    data = {
        "guide_name": "Test Guide",
        "guide_type": "word",
        "guide_url": f"{AZURE_BLOB_ROOT_URL}test-user-guides/Guide.docx",
    }

    assert (
        client.post(
            "/codex-product-api/app-admin/app/1/screen/1/user-guide",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_update_guide(client):
    (access_token, refresh_token) = auth_token()
    (nac_access_token) = get_nac_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "nac_access_token": f"{nac_access_token}",
    }

    request_data = {
        "data": [
            {
                "guide_name": "Test Guide Edit",
                "guide_type": "word",
                "guide_url": f"{AZURE_BLOB_ROOT_URL}test-user-guides/Guide.docx",
            }
        ]
    }

    assert (
        client.put(
            "/codex-product-api/app-admin/app/1/screen/1/user-guide",
            data=json.dumps(request_data),
            headers=headers,
        ).status_code
        == 200
    )


def test_get_archived_filter_uiacs(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert (
        client.get(
            "/codex-product-api/app-admin/app/1/archived-filter-uiac/list",
            headers=headers,
        ).status_code
        == 200
    )
