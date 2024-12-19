import json

from .util import auth_token, get_execution_token


def test_create_alert(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    data = {
        "active": True,
        "alert_source_type": "Integrated Demand Forecasting >> Demand Sizing >> INDUSTRY VOLUME 2019",
        "alert_widget_type": "KPI",
        "app_id": 1,
        "app_screen_id": 1,
        "app_screen_widget_id": 1,
        "category": "extra_value",
        "condition": "above",
        "filter_data": '{"Time Frame":"CY 2020","Region":"USA","Industry":"Beer","Category":"All","Sub Category":"All"}',
        "message": "message",
        "receive_notification": True,
        "threshold": 30,
        "title": "Industry Volume Alert 3",
        "user_email": "test@themathcompany.com",
        "users": [
            1,
            {"name": "Test User1", "email": "test.user1@themathcompany.com", "id": "1"},
        ],
        "widget_url": "http://localhost:3001/app/26/demand-analysis/size-opportunity/demand-sizing",
        "widget_value": {
            "extra_dir": "down",
            "extra_value": "-2.2% YoY",
            "value": "424K Units",
            "alert_config": {
                "categories": {
                    "extra_value": {
                        "id": "extra_value",
                        "name": "Extra Value",
                        "value": 200,
                    },
                    "main_value": {
                        "id": "main_value",
                        "name": "Main Value",
                        "value": 300,
                    },
                }
            },
        },
    }

    resp1 = client.post("/codex-product-api/alerts", data=json.dumps(data), headers=headers)
    assert resp1.status_code == 200


def test_get_alerts(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/alerts", headers=headers).status_code == 200


def test_get_alerts_by_widget(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/alerts/widgets/1", headers=headers).status_code == 200


def test_update_alerts(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    data = {
        "active": True,
        "category": "extra_value",
        "condition": "above",
        "message": "null",
        "receive_notification": True,
        "threshold": 30,
        "title": "Industry Volume Alert 3 edited",
        "user_email": "test@themathcompany.com",
        "users": [],
        "widget_value": {
            "extra_dir": "down",
            "extra_value": "-2.2% YoY",
            "value": "424K Units",
            "alert_config": {
                "categories": {
                    "extra_value": {
                        "id": "extra_value",
                        "name": "Extra Value",
                        "value": 200,
                    },
                    "main_value": {
                        "id": "main_value",
                        "name": "Main Value",
                        "value": 300,
                    },
                }
            },
        },
    }
    assert client.put("/codex-product-api/alerts/1", data=json.dumps(data), headers=headers).status_code == 200


def test_update_alert_notifications(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    data = {"receive_notification": True}

    assert (
        client.put(
            "/codex-product-api/alerts/1/notification",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_delete_alert(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.delete("/codex-product-api/alerts/1", headers=headers).status_code == 200


def test_get_notifications(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/notification", headers=headers).status_code == 200


# def test_update_notification_read(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     data = {
#         "is_read": True
#     }


#     assert client.put("/codex-product-api/notification/1/read", data=data,
#                       headers=headers).status_code == 200
def test_custom_message(client):
    (execution_token) = get_execution_token()
    headers = {"authorization": f"Bearer {execution_token}"}
    data = {
        "app_id": 2,
        "screen_name": "Screenname",
        "widget_name": "GridTableUIAC",
        "progress_info": {"123": {"currentProgress": 100, "cancelled": True}},
    }
    assert client.post("/codex-product-api/widget/state", data=json.dumps(data), headers=headers).status_code == 200


def test_activate_alert(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    # data = {"appId": 26}

    assert client.get("/codex-product-api/alerts/26", headers=headers).status_code == 200


def test_mark_notification_read(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    data = {
        "notifications": [
            {
                "id": 1364,
                "app_id": 26,
                "alert_id": 469,
                "widget_id": 488,
                "title": "market_share Drop",
                "message": "The Market Share for new trial alert 5 has reached below 50",
                "is_read": False,
                "triggered_at": {"$date": 1649339532120},
                "widget_name": "Market Opportunity",
                "shared_by": None,
            }
        ]
    }

    assert (
        client.put(
            "/codex-product-api/notifications/read",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_widget_state(client):
    (execution_token) = get_execution_token()
    headers = {"authorization": f"Bearer {execution_token}"}
    data = {
        "app_id": 2,
        "screen_name": "Screenname",
        "widget_name": "GridTableUIAC",
        "progress_info": {"123": {"currentProgress": 100, "cancelled": True}},
    }
    assert client.post("/codex-product-api/widget/state", data=json.dumps(data), headers=headers).status_code == 200


# def test_get_filtered_notifications(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     assert client.get("/codex-product-api/notifications/filter",
#                       headers=headers).status_code == 200
