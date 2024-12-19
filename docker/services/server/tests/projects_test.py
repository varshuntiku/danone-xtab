import json
import warnings

from .util import auth_token


def test_create(client):
    (access_token, refresh_token) = auth_token()

    data = {
        "name": "test",
        "industry": "demo",
        "project_status": 2,
        "assignees": [1],
        "reviewer": 2,
        "created_by": 1,
    }
    resp = client.post(
        "/codex-api/projects",
        data=json.dumps(data),
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert resp.status_code == 200

    resp = client.post(
        "/codex-api/projects",
        data=json.dumps({}),
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert resp.status_code == 422


def test_widget_list(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/projects/widgets",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_user_list(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/projects/users",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_show(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/projects/4",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
        ).status_code
        == 200
    )

    assert (
        client.get(
            "/codex-api/projects/null",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 404
    )


def test_update(client):
    (access_token, refresh_token) = auth_token()

    data = {
        "name": "test",
        "industry": "demo",
        "project_status": 2,
        "assignees": [1],
        "reviewer": 2,
        "updated_by": 2,
        "project": 1,
    }
    resp = client.put(
        "/codex-api/projects/4",
        data=json.dumps(data),
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
    )
    assert resp.status_code == 200


def test_notupdate(client):
    (access_token, refresh_token) = auth_token()

    data = {
        "name": "test",
        "industry": "demo",
        "project_status": 2,
        "assignees": [1],
        "reviewer": 2,
        "updated_by": 2,
        "project": 1,
    }
    resp = client.put(
        "/codex-api/projects/null",
        data=json.dumps(data),
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert resp.status_code == 404


def test_get_artifacts(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/projects/get-project-artifacts/1",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )

    assert (
        client.get(
            "/codex-api/projects/get-project-artifacts/null",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 404
    )


def test_list_projects(client):
    (access_token, refresh_token) = auth_token()

    assert client.get("/codex-api/projects", headers={"Authorization": f"Bearer {access_token}"}).status_code == 200


def test_reviewers_list(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/projects/reviewers",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_get_blueprint(client):
    (access_token, refresh_token) = auth_token()
    assert (
        client.get(
            "/codex-api/projects/get-project-blueprint/2",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_get_metadata(client):
    (access_token, refresh_token) = auth_token()
    assert (
        client.get(
            "/codex-api/projects/get-project-metadata/2",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_save_blueprint(client):
    (access_token, refresh_token) = auth_token()
    data = {
        "blueprint": {
            "id": "6bbb4140-a859-4e28-b7d1-ae6c71b955b5",
            "offsetX": 0,
            "offsetY": 0,
            "zoom": 100,
            "gridSize": 25,
            "links": [],
            "nodes": [],
        }
    }
    assert (
        client.post(
            "/codex-api/projects/save-project-blueprint/2",
            data=json.dumps(data),
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
        ).status_code
        == 200
    )


def test_save_metadata(client):
    (access_token, refresh_token) = auth_token()
    data = {
        "metadata": {
            "analytics_problem": "Currently the process is done manually and there are a lot of data discrepancies along with large wait time for the data load and refresh.",
            "business_opportunity": "The marketing team of a leading CPG organization are looking for a custom solution to move the data from their PoS systems to a central data warehouse",
        }
    }
    assert (
        client.put(
            "/codex-api/projects/save-project-metadata/2",
            data=json.dumps(data),
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
        ).status_code
        == 200
    )


def test_get_project_artifacts(client):
    (access_token, refresh_token) = auth_token()
    data = {"widget_id": "9eb6878f-856c-4c45-ae62-7da2211bf8a2"}
    assert (
        client.put(
            "/codex-api/projects/get-project-artifacts/2",
            data=json.dumps(data),
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
        ).status_code
        == 200
    )


def test_get_project(client):
    (access_token, refresh_token) = auth_token()
    data = {"problem": "Customer Support Planning", "industry": "Automotive"}
    assert (
        client.put(
            "/codex-api/projects/get-project",
            data=json.dumps(data),
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_get_comments(client):
    (access_token, refresh_token) = auth_token()
    data = {"widget_id": "9eb6878f-856c-4c45-ae62-7da2211bf8a2"}
    assert (
        client.put(
            "/codex-api/projects/get-comments/1",
            data=json.dumps(data),
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_create_comment(client):
    (access_token, refresh_token) = auth_token()
    data = {
        "widget_id": "9eb6878f-856c-4c45-ae62-7da2211bf8a2",
        "comment_text": "This is a test comment",
    }
    assert (
        client.put(
            "/codex-api/projects/add-comment/2",
            data=json.dumps(data),
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_delete_comment(client):
    (access_token, refresh_token) = auth_token()
    assert (
        client.put(
            "/codex-api/projects/delete-comment/1",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_get_code(client):
    (access_token, refresh_token) = auth_token()
    data = {"widget_id": "9eb6878f-856c-4c45-ae62-7da2211bf8a2"}
    assert (
        client.put(
            "/codex-api/projects/get-code/2",
            data=json.dumps(data),
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_save_code(client):
    (access_token, refresh_token) = auth_token()
    data = {"widget_id": "9eb6878f-856c-4c45-ae62-7da2211bf8a2", "code_text": ""}
    assert (
        client.put(
            "/codex-api/projects/save-code/2",
            data=json.dumps(data),
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_get_widget_components(client):
    (access_token, refresh_token) = auth_token()
    data = {"widget_id": "9eb6878f-856c-4c45-ae62-7da2211bf8a2"}
    assert (
        client.put(
            "/codex-api/projects/get-widget-components",
            data=json.dumps(data),
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_get_widget_components_fromid(client):
    (access_token, refresh_token) = auth_token()

    assert (
        client.get(
            "/codex-api/projects/get-widget-components/1",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_download_code(client):
    (access_token, refresh_token) = auth_token()

    warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)

    assert (
        client.get(
            "/codex-api/projects/download-code/2",
            headers={"Authorization": f"Bearer {access_token}"},
        ).status_code
        == 200
    )


def test_delete(client):
    (access_token, refresh_token) = auth_token()

    resp = client.delete("/codex-api/projects/4", headers={"Authorization": f"Bearer {access_token}"})
    assert resp.status_code == 200

    resp = client.delete("/codex-api/projects/null", headers={"Authorization": f"Bearer {access_token}"})
    assert resp.status_code == 404


# TODO: Need to find a way to test the following flows properly
# def test_save_project_artifact(client):
#     (access_token, refresh_token) = auth_token()
#     data = {
#         "data": {"9eb6878f-856c-4c45-ae62-7da2211bf8a2": [{"header": "data:image/png;base64", "blob_name": "widget_artifact_2_9eb6878f-856c-4c45-ae62-7da2211bf8a2_0"}]},
#         "name": "new-widget-name",
#         "widget_id": "9eb6878f-856c-4c45-ae62-7da2211bf8a2"
#     }
#     assert client.put("/codex-api/projects/save-project-artifact/2",
#                       data=json.dumps(data), headers={'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}).status_code == 200


# def test_delete_project_artifact(client):
#     (access_token, refresh_token) = auth_token()
#     assert client.delete("/codex-api/projects/delete-project-artifact/1",
#                       headers={'Authorization': f'Bearer {access_token}'}).status_code == 200


# def test_upload_config_params(client):
#     (access_token, refresh_token) = auth_token()
#     data = {
#         "widgets": {},
#         "tags": {}
#     }
#     assert client.put(f"/codex-api/projects/upload-config-params/{access_token}",
#                       data=json.dumps(data), headers={'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}).status_code == 200


# def test_delete_all(client):
#     (access_token, refresh_token) = auth_token()
#     assert client.put(f"/codex-api/projects/delete-iterations/{access_token}").status_code == 200


# def test_update_run_status(client):
#     (access_token, refresh_token) = auth_token()
#     data = {
#         "triggered_run_id": 1,
#         "status": ""
#     }
#     assert client.put(f"/codex-api/projects/update-run-status/{access_token}",
#                       data=json.dumps(data)).status_code == 200
