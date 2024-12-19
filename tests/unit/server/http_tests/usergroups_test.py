import json
import os
import sys

from test_case import ParametrizedTestCase

testdir = os.path.dirname(__file__)
srcdir = "../../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))


class UserGroupsTest(ParametrizedTestCase):
    def test_setup(self):
        self.assertEqual(True, True)

    def test_usergroups_list(self):
        response = self.params["app_test_client"].get("/codex-api/user-groups")

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].get("/codex-api/user-groups", headers=self.params["headers"])

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].get("/codex-api/user-groups", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(len(response_data), 3)

    def test_usergroup_create(self):
        response = self.params["app_test_client"].post(
            "/codex-api/user-groups",
            data="{}",
        )

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].post(
            "/codex-api/user-groups", data="{}", headers=self.params["headers"]
        )

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].post(
            "/codex-api/user-groups", data="{}", headers=self.params["headers"]
        )

        self.assertEqual(response.status_code, 422)

        response = self.params["app_test_client"].post(
            "/codex-api/user-groups",
            data='{"name": "Test"}',
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data["name"], "Test")

        response = self.params["app_test_client"].get("/codex-api/user-groups", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(len(response_data), 4)
        self.assertEqual(response_data[3]["name"], "super-user")
        self.assertEqual(response_data[3]["user_group_type"], "SYSTEM")
        self.assertEqual(response_data[2]["name"], "default-user")
        self.assertEqual(response_data[2]["user_group_type"], "SYSTEM")
        self.assertEqual(response_data[1]["name"], "Test Access Group rbac")
        self.assertEqual(response_data[1]["user_group_type"], "USER CREATED")
        self.assertEqual(response_data[0]["name"], "Test")
        self.assertEqual(response_data[0]["user_group_type"], "USER CREATED")

    def test_usergroup_show(self):
        response = self.params["app_test_client"].get("/codex-api/user-groups/0")

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].get("/codex-api/user-groups/0", headers=self.params["headers"])

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].post(
            "/codex-api/user-groups",
            data='{"name": "Test"}',
            headers=self.params["headers"],
        )

        response_data = json.loads(response.data)
        user_group_id = response_data["id"]

        response = self.params["app_test_client"].get("/codex-api/user-groups/0", headers=self.params["headers"])

        self.assertEqual(response.status_code, 404)

        response = self.params["app_test_client"].get(
            f"/codex-api/user-groups/{user_group_id}", headers=self.params["headers"]
        )

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data["name"], "Test")
        self.assertEqual(response_data["data_prep"], False)
        self.assertEqual(response_data["model_train"], False)
        self.assertEqual(response_data["model_pipelines"], False)
        self.assertEqual(response_data["app_builder"], False)
        self.assertEqual(response_data["rbac"], False)

    def test_usergroup_update(self):
        response = self.params["app_test_client"].post("/codex-api/user-groups/0", data="{}")

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].post(
            "/codex-api/user-groups/0",
            data="asda;123 asd 123",
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].post(
            "/codex-api/user-groups",
            data='{"name": "Test"}',
            headers=self.params["headers"],
        )

        response_data = json.loads(response.data)
        user_group_id = response_data["id"]

        response = self.params["app_test_client"].post(
            f"/codex-api/user-groups/{user_group_id}",
            data="asda;123 asd 123",
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 422)

        response = self.params["app_test_client"].post(
            f"/codex-api/user-groups/{user_group_id}",
            data="{}",
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 500)

        response = self.params["app_test_client"].post(
            f"/codex-api/user-groups/{user_group_id}",
            data='{"name": "Test Updated", "data_prep": true, "model_train": true}',
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data)["status"], True)

        response = self.params["app_test_client"].get(
            f"/codex-api/user-groups/{user_group_id}", headers=self.params["headers"]
        )

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data["name"], "Test Updated")
        self.assertEqual(response_data["data_prep"], True)
        self.assertEqual(response_data["model_train"], True)
        self.assertEqual(response_data["model_pipelines"], False)
        self.assertEqual(response_data["app_builder"], False)
        self.assertEqual(response_data["rbac"], False)

    def test_usergroup_delete(self):
        response = self.params["app_test_client"].delete("/codex-api/user-groups/0")

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].delete("/codex-api/user-groups/0", headers=self.params["headers"])

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].post(
            "/codex-api/user-groups",
            data='{"name": "Test"}',
            headers=self.params["headers"],
        )

        response_data = json.loads(response.data)
        user_group_id = response_data["id"]

        response = self.params["app_test_client"].delete(
            f"/codex-api/user-groups/{user_group_id}", headers=self.params["headers"]
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data)["deleted_rows"], 1)

        response = self.params["app_test_client"].get(
            f"/codex-api/user-groups/{user_group_id}", headers=self.params["headers"]
        )

        self.assertEqual(response.status_code, 404)

        response = self.params["app_test_client"].post(
            f"/codex-api/user-groups/{user_group_id}",
            data="{}",
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 404)

        response = self.params["app_test_client"].get("/codex-api/user-groups", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(len(response_data), 3)

    def tearDown(self):
        self.params["test_fixtures"].deleteAllTestData()
