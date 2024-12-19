from .util import auth_token


def test_get_stories_by_app_id(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/app/1/stories", headers=headers).status_code == 200


def test_get_stories(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    assert client.get("/codex-product-api/stories", headers=headers).status_code == 200


# def test_get_stories_by_story_id(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     assert client.get("/codex-product-api/stories/1",
#                       headers=headers).status_code == 200


# def test_create_story(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     data = {
#         "app_id": [26],
#         "content": [{"name": "INDUSTRY VOLUME 2019",
#                      "description": "",
#                      "app_id": 26,
#                      "app_screen_id": 103,
#                      "app_screen_widget_id": 484,
#                      "app_screen_widget_value_id": 1093,
#                      "filter_data": "",
#                      "graph_data": ""
#                      }],
#         "description": "test11-02",
#         "email": "nirmal.raj@themathcompany.com",
#         "name": "test11-02",
#         "user_id": 0}

#     assert client.post("/codex-product-api/stories", data=json.dumps(data),
#                        headers=headers).status_code == 200


# def test_update_story(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     data = {
#         'app_id': [26],
#         'content': [{'name': "INDUSTRY VOLUME 2019",
#                      'description': "",
#                      'app_id': 26,
#                      'app_screen_id': 103,
#                      'app_screen_widget_id': 484,
#                      'app_screen_widget_value_id': 1093,
#                      'filter_data': "",
#                      'graph_data': ""
#                      }],
#         'description': "test11-02",
#         'email': "nirmal.raj@themathcompany.com",
#         'name': "test11-02",
#         'user_id': 0}

#     assert client.put("/codex-product-api/stories/1", data=json.dumps(data),
#                       headers=headers).status_code == 200


# def test_delete_story(client):
#     (access_token, refresh_token) = auth_token()
#     headers = {'Authorization': f'Bearer {access_token}'}

#     assert client.delete("/codex-product-api/stories/1",
#                          headers=headers).status_code == 200
