import json

from .util import auth_token


def get_headers_info():
    (access_token, refresh_token) = auth_token()

    headers = {"Authorization": f"Bearer {access_token}"}

    return headers


def test_project_pd_version(client):
    headers = get_headers_info()

    # Create Project with problem defintion auto-generated version
    create_payload = {
        "id": 0,
        "name": "test project test case",
        "industry": "CPG",
        "project_status": 1,
        "reviewer": 2,
        "account": "test",
        "problem_area": "test cases",
        "content": {
            "stateProblem1": "<p>problem statement</p>\n",
            "statusQuo1": "",
            "statusQuo2": "",
            "statusQuo3": {"content": "", "attachments": []},
            "constraints": {},
            "successCriteria1": "",
            "successCriteria2": "",
            "successCriteria3": "",
        },
        "origin": "PDF",
    }

    create_resp = client.post(
        "/codex-api/projects",
        data=json.dumps(create_payload),
        headers=headers,
    )
    assert create_resp.status_code == 200

    # Store create response to use in below test cases
    pd_data = json.loads(create_resp.data)

    # Update the created project
    update_payload = {
        "id": pd_data["id"],
        "name": "test project test case",
        "industry": "CPG",
        "project_status": 1,
        "assignees": [],
        "reviewer": 2,
        "is_instance": False,
        "account": "test",
        "problem_area": "test cases",
        "origin": "PDF",
        "created_by": "Ira Shrivastava",
        "user_access": {"view": True, "edit": True, "delete": True},
        "content": {
            "stateProblem1": "<p>problem statement edited</p>\n",
            "statusQuo1": "",
            "statusQuo2": "",
            "statusQuo3": {"content": "", "attachments": []},
            "constraints": {},
            "successCriteria1": "",
            "successCriteria2": "",
            "successCriteria3": "",
        },
        "version_id": pd_data["version_id"],
    }

    update_resp = client.put(
        f"/codex-api/projects/{pd_data['id']}",
        data=json.dumps(update_payload),
        headers=headers,
    )

    assert update_resp.status_code == 200

    # View the project along with its current pd version
    show_resp = client.get(
        f"/codex-api/projects/{pd_data['id']}",
        headers=headers,
    )
    assert show_resp.status_code == 200

    # View the pd version list for a project
    show_versions_list = client.get(
        f"/codex-api/projects/{pd_data['id']}/versions?page=0&pageSize=10&sorted=[]&filtered=[]", headers=headers
    )

    assert show_versions_list.status_code == 200

    # View a particular pd version for a project
    show_version = client.get(f"/codex-api/projects/{pd_data['id']}/versions/{pd_data['version_id']}", headers=headers)

    assert show_version.status_code == 200

    # Create a new version for the project
    create_version_payload = {
        "id": pd_data["id"],
        "name": "test project test case",
        "industry": "CPG",
        "project_status": 1,
        "assignees": [],
        "reviewer": 2,
        "is_instance": False,
        "account": "test",
        "problem_area": "test cases",
        "origin": "PDF",
        "created_by": "Ira Shrivastava",
        "user_access": {"view": True, "edit": True, "delete": True},
        "content": {
            "stateProblem1": "<p>problem statement new version</p>\n",
            "statusQuo1": "",
            "statusQuo2": "",
            "statusQuo3": {"content": "", "attachments": []},
            "constraints": {},
            "successCriteria1": "",
            "successCriteria2": "",
            "successCriteria3": "",
        },
        "version_name": "version 1",
    }

    create_version = client.post(
        f"/codex-api/projects/{pd_data['id']}/versions", data=json.dumps(create_version_payload), headers=headers
    )

    assert create_version.status_code == 200

    create_version_resp = json.loads(create_version.data)

    # Set new version as current version
    current_version_data = {"version_id": create_version_resp["version_id"]}

    current_version = client.put(
        f"/codex-api/projects/{pd_data['id']}/versions", data=json.dumps(current_version_data), headers=headers
    )

    assert current_version.status_code == 200

    # Delete a specific version of project
    delete_version = client.delete(
        f"/codex-api/projects/{pd_data['id']}/versions/{pd_data['version_id']}", headers=headers
    )

    assert delete_version.status_code == 200

    # Create a new project along with version name
    project_version_data = {
        "id": 0,
        "name": "test 1",
        "industry": "Automotive",
        "project_status": 1,
        "reviewer": 2,
        "account": "test 1",
        "problem_area": "test 1",
        "content": {
            "stateProblem1": "<p>new project with version name</p>\n",
            "statusQuo1": "",
            "statusQuo2": "",
            "statusQuo3": {"content": "", "attachments": []},
            "constraints": {},
            "successCriteria1": "",
            "successCriteria2": "",
            "successCriteria3": "",
        },
        "origin": "PDF",
        "version_name": "version 1",
    }

    project_version_create = client.post("codex-api/projects", data=json.dumps(project_version_data), headers=headers)

    assert project_version_create.status_code == 200
