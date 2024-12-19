import json

from .util import auth_token, get_nac_token

# from unittest.mock import patch


def test_basic(client):
    assert client.get("/codex-product-api/").status_code == 200


def test_db_connect(client):
    resp = client.get("codex-product-api/info")
    assert b"PostGreSQL: \nPostgreSQL database connected\n\n" in resp.data


# @patch("api.middlewares.httpx.get")
def test_app_id(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    # mock_get.return_value.ok = True
    # mock_get.return_value.json.return_value = {"is_restricted_user": False}

    assert client.get("/codex-product-api/app/1", headers=headers).status_code == 200


def test_app_withOutId(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/null", headers=headers).status_code == 404


def test_app_withoutHeaders(client):
    assert client.get("/codex-product-api/app/1").status_code == 401


def test_get_user_app_id(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/user-app", headers=headers).status_code == 200


def test_get_user_special_access(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/user-access", headers=headers).status_code == 200


def test_get_app_list(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/get-apps", headers=headers).status_code == 200


def test_get_app_by_name(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/get-app-by-name/Marketing", headers=headers).status_code == 200
    assert (
        json.loads(client.get("/codex-product-api/app/get-app-by-name/Marketing", headers=headers).data)[0]["app_id"]
        == 1
    )


# @patch("api.middlewares.httpx.get")
def test_get_app_config(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    # mock_get.return_value.ok = True
    # mock_get.return_value.json.return_value = {"is_restricted_user": False}

    assert client.get("/codex-product-api/app/1", headers=headers).status_code == 200


def test_get_screens(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/1/screens", headers=headers).status_code == 200


def test_get_filters(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/1/screens/1/filters", headers=headers).status_code == 200


def test_get_screen_config(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/1/screens/1/overview", headers=headers).status_code == 200


def test_get_dynamic_filters(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {"selected": {}}

    assert (
        client.post(
            "/codex-product-api/app/1/screens/1/dynamic-filters",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_get_dynamic_actions(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {"filter_state": {}}

    assert (
        client.post(
            "/codex-product-api/app/1/screens/1/dynamic-actions",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_screen_action_handler(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {"filter_state": {}, "action_param": {}, "action_type": {}}

    assert (
        client.post(
            "/codex-product-api/app/1/screens/1/action_handler",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_get_widgets(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/1/screens/1/widgets", headers=headers).status_code == 200


def test_get_multi_widget(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {"widget": {"id": 1, "widget_key": ""}, "filters": {}}

    assert (
        client.put(
            "/codex-product-api/app/1/screens/1/multi-widget",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_update_widget_data(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    from api.models import AppScreenWidgetValue

    app_screen_widget_value = AppScreenWidgetValue.query.filter_by(app_id=1).first()

    data = {
        "widget_value_id": 1,
        "user_email": "test@themathcompany.com",
        "data": "test",
    }
    assert (
        client.put(
            f"/codex-product-api/update-data/{str(app_screen_widget_value.access_token)}",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_get_widget(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    data = {"widget": {"widget_key": "2018", "id": "1"}, "filters": []}

    assert (
        client.put(
            "/codex-product-api/app/1/screens/1/widget",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_get_simulator_output(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    data = {"inputs": [], "selected_filters": [], "code": ""}

    assert (
        client.put(
            "/codex-product-api/app/1/execute-code",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_update_app_details(client):
    (access_token, refresh_token) = auth_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    data = {
        "industry_id": 1,
        "function_id": 1,
        "name": "test",
        "description": "test",
        "blueprint_link": "test",
        # "orderby": "string",
        "config_link": "string",
        "small_logo_url": "string",
        "logo_url": "string",
    }

    assert client.put("/codex-product-api/app/1", data=json.dumps(data), headers=headers).status_code == 200


def test_get_dynamic_action_response(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {
        "widget_value_id": 1,
        "action_type": "string",
        "data": "string",
        "filters": [],
        "formData": {},
    }

    assert (
        client.post(
            "/codex-product-api/app/1/screens/1/execute-dynamic-action",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_get_app_kpi_list(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/1/kpis", headers=headers).status_code == 200


def test_get_screen_filters(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/2/screen/1/filter/uiac", headers=headers).status_code == 200


def test_get_screen_actions(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/1/screen/1/action/uiac", headers=headers).status_code == 200


def test_get_screen_widget_code(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/1/screen/1/widget/1/uiac", headers=headers).status_code == 200


def test_replicate_app(client):
    (access_token, refresh_token) = auth_token()
    (nac_access_token) = get_nac_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "nac_access_token": f"{nac_access_token}",
    }
    data = {"source_app_id": 2, "user_id": 2}

    assert client.post("/codex-product-api/app/replicate", data=json.dumps(data), headers=headers).status_code == 200


def test_clone_app(client):
    (access_token, refresh_token) = auth_token()
    (nac_access_token) = get_nac_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "nac_access_token": f"{nac_access_token}",
    }
    data = {
        "app_name": "App Name 1",
        "industry": "Retail",
        "industry_id": 1,
        "function": "Pricing",
        "function_id": 1,
        "contact_email": "test@test.com",
        "source_app_id": 1,
        "user_id": 1,
    }

    assert client.post("/codex-product-api/app/clone", data=json.dumps(data), headers=headers).status_code == 200


# @patch("api.middlewares.httpx.get")
def test_reset_app(client):
    (access_token, refresh_token) = auth_token()
    (nac_access_token) = get_nac_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "nac_access_token": f"{nac_access_token}",
    }

    # mock_get.return_value.ok = True
    # mock_get.return_value.json.return_value = {
    #     "user_id": 1,
    #     "username": "test@themathcompany.com",
    # }

    app_reset = client.post("/codex-product-api/app/1/reset", headers=headers)
    assert app_reset.status_code == 403


# def test_import_app(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {"Authorization": f"Bearer {access_token}", 'Content-Type': 'multipart/form-data'}
#     file = "exported_app.txt"
#     data = {
#         'file': (open(file, 'rb'), file),
#         "name": "app_name",
#         "function": "",
#         "industry": ""
#         }
#     assert (
#         client.post("/codex-product-api/app/import", data=data, headers=headers).status_code
#         == 200
#         )
