import json

from .util import auth_token


def test_get_industry(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/industry", headers=headers).status_code == 200
    assert json.loads(client.get("/codex-product-api/industry", headers=headers).data)[0]["parent_industry_id"] == 1
    assert json.loads(client.get("/codex-product-api/industry", headers=headers).data)[1]["parent_industry_id"] is None


def test_create_industry(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    data = {
        "id": "",
        "industry_name": "CPG",
        "logo_name": "CPG",
        "order": "1",
        "horizon": "horizontal",
    }
    data1 = {
        "id": "",
        "industry_name": "Cars",
        "logo_name": "Automotive",
        "order": "1",
        "horizon": "horizontal",
        "parent_industry_id": 1,
    }

    assert client.post("/codex-product-api/industry", data=json.dumps(data), headers=headers).status_code == 200
    assert client.post("/codex-product-api/industry", data=json.dumps(data1), headers=headers).status_code == 400


# def test_update_industry(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     data = {"id": 1, "industry_name": "CPG2", "logo_name": "CPG",
#             "order": "1", "horizon": "horizontal"}

#     assert client.put("/codex-product-api/industry/1", data=json.dumps(data),
#                       headers=headers).status_code == 200


def test_delete_industry(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.delete("/codex-product-api/industry/1", headers=headers).status_code == 200


def test_get_function(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/function", headers=headers).status_code == 200
    assert json.loads(client.get("/codex-product-api/function", headers=headers).data)[0]["parent_function_id"] == 1
    assert json.loads(client.get("/codex-product-api/function", headers=headers).data)[1]["parent_function_id"] is None


def test_create_function(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    data = {
        "description": "desc",
        "function_id": "",
        "function_name": "function",
        "industry_id": 1,
        "logo_name": "CPGRevenueManagementIcon",
        "order": "1",
    }
    data1 = {
        "description": "desc",
        "function_id": "",
        "function_name": "function",
        "industry_id": 1,
        "logo_name": "CPGRevenueManagementIcon",
        "order": "1",
        "parent_function_id": 1,
    }

    assert client.post("/codex-product-api/function", data=json.dumps(data), headers=headers).status_code == 200
    assert client.post("/codex-product-api/function", data=json.dumps(data1), headers=headers).status_code == 200


# def test_update_function(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     data = {'description': "desc", 'function_id': 2,
#             'function_name': "test",
#             'industry_id': 1,
#             'logo_name': "CPGRevenueManagementIcon",
#             'order': '20'}

#     assert client.put("/codex-product-api/function/2", data=json.dumps(data),
#                       headers=headers).status_code == 200


def test_delete_function(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.delete("/codex-product-api/function/1", headers=headers).status_code == 200


def test_get_apps(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/applications", headers=headers).status_code == 200


# def test_get_apps_by_industry(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     assert client.get("/codex-product-api/industry/CPG/apps",
#                       headers=headers).status_code == 200


def test_get_user_apps_hierarchy(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/user-apps-hierarchy", headers=headers).status_code == 200


def test_get_user_apps(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.get("/codex-product-api/user-apps/someemail@gmai.com", headers=headers).status_code == 200
    assert client.get("/codex-product-api/user-apps/", headers=headers).status_code == 404


def test_update_user_apps(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {
        "first_name": "My Name",
        "last_name": "Surname",
        "email_address": "someemail@gmai.com",
        "default_apps": [],
        "user_apps": [],
    }
    data1 = {
        "first_name": "My Name",
        "last_name": "Surname",
        "email_address": "someemail@gmai.com",
        "default_apps": [],
        "user_apps": [1],
    }
    data2 = {
        "first_name": "My Name",
        "last_name": "Surname",
        "email_address": "someemail@gmai.com",
        "default_apps": [1],
        "user_apps": [],
    }
    data3 = {
        "first_name": "My Name",
        "last_name": "Surname",
        "email_address": "someemail@gmai.com",
        "default_apps": [1],
        "user_apps": [1],
    }
    data4 = {
        "first_name": "My Name",
        "last_name": "Surname",
        "email_address": "someemail@gmai.com",
        "default_apps": [173, 536, 383, 534],
        "user_apps": [536, 383, 307],
    }

    assert (
        client.post(
            "/codex-product-api/user-apps/someemail@gmai.com",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/codex-product-api/user-apps/someemail@gmai.com",
            data=json.dumps(data1),
            headers=headers,
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/codex-product-api/user-apps/someemail@gmai.com",
            data=json.dumps(data2),
            headers=headers,
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/codex-product-api/user-apps/someemail@gmai.com",
            data=json.dumps(data3),
            headers=headers,
        ).status_code
        == 200
    )
    assert (
        client.post(
            "/codex-product-api/user-apps/someemail@gmai.com",
            data=json.dumps(data4),
            headers=headers,
        ).status_code
        == 404
    )
