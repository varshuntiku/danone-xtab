import json

from .util import auth_token


def test_getstories_appid(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.get("/codex-product-api/app/1/stories", headers=headers).status_code == 200
    assert client.get("/codex-product-api/app/one/stories", headers=headers).status_code == 404


def test_getstories_list(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.get("/codex-product-api/stories", headers=headers).status_code == 200


def test_create_story(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {
        "email": "test@themathcompany.com",
        "name": "teststory",
        "description": "test",
        "app_id": "2",
        "story_type": "TESSTORY",
        "content": [],
    }
    assert client.post("/codex-product-api/stories", data=json.dumps(data), headers=headers).status_code == 200


def test_getstory_details(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.get("/codex-product-api/stories/1", headers=headers).status_code == 200
    assert client.get("/codex-product-api/stories/8", headers=headers).status_code == 404


def test_update_story(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {
        "email": "gokul.rayankula@themathcompany.com",
        "name": "test story dev 7th",
        "description": "test 7th",
        "story_id": 1,
        "app_id": [1],
        "update": {
            "pages": [
                {
                    "pIndex": 0,
                    "id": 188,
                    "layoutId": 1,
                    "style": {
                        "gridTemplateAreas": "\n                    'h h h h'\n                    '. v v .'\n                    '. v v .'\n                    '. v v .'\n                    't t t t'\n                "
                    },
                    "layoutProps": {
                        "sections": [
                            {
                                "component": "header",
                                "gridArea": "h",
                                "dataKey": "h1",
                                "rowCount": 1,
                                "colCount": 4,
                                "top": 0.1,
                                "left": 0.1,
                                "height": 1,
                                "width": 15.8,
                            },
                            {
                                "component": "visualContent",
                                "gridArea": "v",
                                "dataKey": "v1",
                                "rowCount": 3,
                                "colCount": 2,
                                "top": 1.2,
                                "left": 3,
                                "height": 6.6,
                                "width": 9,
                            },
                            {
                                "component": "text",
                                "gridArea": "t",
                                "dataKey": "t1",
                                "rowCount": 1,
                                "colCount": 4,
                                "top": 7.9,
                                "left": 0.1,
                                "height": 1,
                                "width": 15.8,
                            },
                        ]
                    },
                    "data": {
                        "v1": 205,
                        "h1": {"html": "<p>est AddT</p>\n", "rootStyle": {}},
                    },
                },
            ]
        },
        "delete": [],
        "add": [],
    }
    assert client.put("/codex-product-api/stories/1", data=json.dumps(data), headers=headers).status_code == 200


# def test_schedule_story(client):
#     (access_token,refresh_token)= auth_token()
#     headers={'Authorization':f'Bearer {access_token}'}
#     data={"email":"test@themathcompany.com","story_id":"8","isScheduled":"true" ,"noOfOccurances":"1" ,"frequency": "Month",
#             "startDate": "2023-02-02T12:36:00:000Z","endDate": "2023-02-12T12:36:00:000Z","time": "2023-02-02T12:36:00:453Z","days": [],"occuringOn":"First" ,"occuringAt": "Monday"}
#     baddata={}
#     assert client.post("/codex-product-api/stories/schedule",data=json.dumps(data),
#                       headers=headers).status_code==200
# assert client.post("/codex-product-api/stories/schedule",data=json.dumps(baddata)
#                   headers=headers).status_code==500


def test_shared_storylist(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.get("/codex-product-api/stories/1/shared", headers=headers).status_code == 200


def test_shared_userlist(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.get("/codex-product-api/stories/1/users", headers=headers).status_code == 200


def test_give_access(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {
        "email": "test@themathcompany.com",
        "story_id": "1",
        "read": True,
        "write": True,
        "delete": True,
    }
    assert (
        client.post(
            "/codex-product-api/stories/give-access",
            data=json.dumps(data),
            headers=headers,
        ).status_code
        == 200
    )


def test_get_userslist(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.get("/codex-product-api/stories/get-user-emails", headers=headers).status_code == 200


def test_get_layoutinfo(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.get("/codex-product-api/stories/layout", headers=headers).status_code == 200
    assert client.get("/codex-product-api/stories/layout/1", headers=headers).status_code == 200


def test_delete_story(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert (
        client.delete(
            "/codex-product-api/stories/105?stories_list=[%7B%22story_id%22:1,%22app_ids%22:[2]%7D]",
            headers=headers,
        ).status_code
        == 200
    )


def test_delete_layout(client):
    (access_token, refresh_token) = auth_token()
    headers = {"Authorization": f"Bearer {access_token}"}
    assert client.delete("/codex-product-api/stories/layout/8", headers=headers).status_code == 200


# def test_share_story(client):
#     (access_token,refresh_token)= auth_token()
#     headers={'Authorization':f'Bearer {access_token}'}
#     data={"isLink":False,"isAattachment":False,"recipients":['gokul.rayankula@themathcompany.com'],"story_id":8}
#     assert client.post("/codex-product-api/stories/share",data=json.dumps(data),
#                       headers=headers).status_code==200

# def test_recreate_snapshot(client):
#     (access_token,refresh_token)= auth_token()
#     headers={'Authorization':f'Bearer {access_token}'}
#     data={"email":"","story_id":"","read":"","write":"","delete":""}
#     assert client.post("/codex-product-api/stories/schedule/<int:story_id>",data=json.dumps(data)
#                       headers=headers).status_code=200

# def test_published_story(client):
#     (access_token,refresh_token)= auth_token()
#     headers={'Authorization':f'Bearer {access_token}'}
#     assert client.get("/codex-product-api/stories/published",
#                       headers=headers).status_code==200


# def test_add_layout(client):
#     (access_token,refresh_token)= auth_token()
#     headers={'Authorization':f'Bearer {access_token}'}
#     data={"layout_style":{"gridTemplateAreas": "\n                    'h h h h'\n                    'v v t t'\n                    'v v t t'\n                    'v v t t'\n                    'k k k k'\n                "},
#     "layout_props":{
#   "sections": [
#     {
#       "component": "header",
#       "gridArea": "h",
#       "dataKey": "h1",
#       "rowCount": 1,
#       "colCount": 4,
#       "top": 0.1,
#       "left": 0.1,
#       "height": 1,
#       "width": 15.8
#     },
#     {
#       "component": "visualContent",
#       "gridArea": "v",
#       "dataKey": "v1",
#       "rowCount": 3,
#       "colCount": 2,
#       "top": 1.2,
#       "left": 0.1,
#       "height": 6.6,
#       "width": 7.85
#     },
#     {
#       "component": "text",
#       "gridArea": "t",
#       "dataKey": "t1",
#       "rowCount": 3,
#       "colCount": 2,
#       "top": 1.2,
#       "left": 8.05,
#       "height": 6.6,
#       "width": 7.85
#     },
#     {
#       "component": "keyFinding",
#       "gridArea": "k",
#       "dataKey": "k1",
#       "rowCount": 1,
#       "colCount": 4,
#       "top": 7.9,
#       "left": 0.1,
#       "height": 1,
#       "width": 15.8
#     }
#   ]
# },"thumbnail_blob_name":"","layout_name":""}
#     assert client.post("/codex-product-api/stories/layout",data=json.dumps(data),
#                       headers=headers).status_code==200

# def test_update_layout(client):
#     (access_token,refresh_token)= auth_token()
#     headers={'Authorization':f'Bearer {access_token}'}
#     data={"email":"","story_id":"","read":"","write":"","delete":""}
#     assert client.put("/codex-product-api/stories/layout/1",data=json.dumps(data),
#                       headers=headers).status_code==200
