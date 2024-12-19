import json
import os
import sys

from test_case import ParametrizedTestCase

testdir = os.path.dirname(__file__)
srcdir = "../../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))


class UsersTest(ParametrizedTestCase):
    def test_setup(self):
        self.assertEqual(True, True)

    def test_users_list(self):
        response = self.params["app_test_client"].get("/codex-api/users")

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].get("/codex-api/users", headers=self.params["headers"])

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].get("/codex-api/users", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(len(response_data), 1)

    def test_user_groups_list(self):
        response = self.params["app_test_client"].get("/codex-api/users/user-groups")

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].get("/codex-api/users/user-groups", headers=self.params["headers"])

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].get("/codex-api/users/user-groups", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(len(response_data), 3)

    def test_user_create(self):
        response = self.params["app_test_client"].post(
            "/codex-api/users",
            data="{}",
        )

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].post("/codex-api/users", data="{}", headers=self.params["headers"])

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].post("/codex-api/users", data="{}", headers=self.params["headers"])

        self.assertEqual(response.status_code, 422)

        response = self.params["app_test_client"].post(
            "/codex-api/users",
            data='{"first_name": "Test First","last_name": "Test Last","email_address": "test_first.test_last@themathcompany.com"}',
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data["first_name"], "Test First")

        response = self.params["app_test_client"].get("/codex-api/users", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(len(response_data), 2)
        self.assertEqual(response_data[0]["first_name"], "Test First")
        self.assertEqual(response_data[0]["last_name"], "Test Last")
        self.assertEqual(response_data[0]["user_groups"][0], {"id": 1, "name": "default-user"})

        self.assertEqual(response_data[1]["first_name"], "System")
        self.assertEqual(response_data[1]["last_name"], "Application")
        self.assertEqual(response_data[1]["user_groups"][0], {"id": 1, "name": "default-user"})

        response = self.params["app_test_client"].post(
            "/codex-api/users",
            data='{"first_name": "Super First","last_name": "Super Last","email_address": "super_first.super_last@themathcompany.com", "user_groups": ["2"]}',
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data["first_name"], "Super First")

        response = self.params["app_test_client"].get("/codex-api/users", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(len(response_data), 3)
        self.assertEqual(response_data[0]["first_name"], "Super First")
        self.assertEqual(response_data[0]["last_name"], "Super Last")
        self.assertEqual(response_data[0]["user_groups"][0], {"id": 1, "name": "default-user"})
        self.assertEqual(response_data[0]["user_groups"][1], {"id": 2, "name": "super-user"})

        self.assertEqual(response_data[1]["first_name"], "Test First")
        self.assertEqual(response_data[1]["last_name"], "Test Last")
        self.assertEqual(response_data[1]["user_groups"][0], {"id": 1, "name": "default-user"})

        self.assertEqual(response_data[2]["first_name"], "System")
        self.assertEqual(response_data[2]["last_name"], "Application")
        self.assertEqual(response_data[2]["user_groups"][0], {"id": 1, "name": "default-user"})

    def test_user_show(self):
        response = self.params["app_test_client"].get("/codex-api/users/0")

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].get("/codex-api/users/0", headers=self.params["headers"])

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].post(
            "/codex-api/users",
            data='{"first_name": "Test First","last_name": "Test Last","email_address": "test_first.test_last@themathcompany.com"}',
            headers=self.params["headers"],
        )

        response_data = json.loads(response.data)
        user_id = response_data["id"]

        response = self.params["app_test_client"].get("/codex-api/users/0", headers=self.params["headers"])

        self.assertEqual(response.status_code, 404)

        response = self.params["app_test_client"].get(f"/codex-api/users/{user_id}", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data["first_name"], "Test First")
        self.assertEqual(response_data["last_name"], "Test Last")
        self.assertEqual(response_data["email_address"], "test_first.test_last@themathcompany.com")
        self.assertEqual(response_data["user_groups"][0], 1)

    def test_user_update(self):
        response = self.params["app_test_client"].post("/codex-api/users/0", data="{}")

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].post(
            "/codex-api/users/0",
            data="asda;123 asd 123",
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].post(
            "/codex-api/users",
            data='{"first_name": "Test First","last_name": "Test Last","email_address": "test_first.test_last@themathcompany.com"}',
            headers=self.params["headers"],
        )

        response_data = json.loads(response.data)
        user_id = response_data["id"]

        response = self.params["app_test_client"].post(
            f"/codex-api/users/{user_id}",
            data="asda;123 asd 123",
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 422)

        response = self.params["app_test_client"].post(
            f"/codex-api/users/{user_id}", data="{}", headers=self.params["headers"]
        )

        self.assertEqual(response.status_code, 500)

        response = self.params["app_test_client"].post(
            f"/codex-api/users/{user_id}",
            data='{"first_name": "Test First Updated","last_name": "Test Last Updated","email_address": "test_first.test_last@themathcompany.com","user_groups":[1,2]}',
            headers=self.params["headers"],
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data)["status"], True)

        response = self.params["app_test_client"].get(f"/codex-api/users/{user_id}", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data["first_name"], "Test First Updated")
        self.assertEqual(response_data["last_name"], "Test Last Updated")
        self.assertEqual(response_data["email_address"], "test_first.test_last@themathcompany.com")
        self.assertEqual(response_data["user_groups"][0], 1)
        self.assertEqual(response_data["user_groups"][1], 2)

    def test_user_delete(self):
        response = self.params["app_test_client"].delete("/codex-api/users/0")

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].delete("/codex-api/users/0", headers=self.params["headers"])

        self.assertEqual(response.status_code, 403)

        self.params["test_fixtures"].createGroupAndAccess("rbac")

        response = self.params["app_test_client"].post(
            "/codex-api/users",
            data='{"first_name": "Test First","last_name": "Test Last","email_address": "test_first.test_last@themathcompany.com"}',
            headers=self.params["headers"],
        )

        response_data = json.loads(response.data)
        user_id = response_data["id"]

        response = self.params["app_test_client"].delete(f"/codex-api/users/{user_id}", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data)["deleted_rows"], 1)

        response = self.params["app_test_client"].get(f"/codex-api/users/{user_id}", headers=self.params["headers"])

        self.assertEqual(response.status_code, 404)

        response = self.params["app_test_client"].post(
            f"/codex-api/users/{user_id}", data="{}", headers=self.params["headers"]
        )

        self.assertEqual(response.status_code, 404)

        response = self.params["app_test_client"].get("/codex-api/users", headers=self.params["headers"])

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(len(response_data), 1)

    def tearDown(self):
        self.params["test_fixtures"].deleteAllTestData()
