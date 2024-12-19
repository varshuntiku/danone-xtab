import json
import os
import sys

from test_case import ParametrizedTestCase

testdir = os.path.dirname(__file__)
srcdir = "../../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))


class AuthTest(ParametrizedTestCase):
    def test_setup(self):
        self.assertEqual(True, True)
        self.assertNotEqual(self.params["access_token"], "")

    def test_userinfo(self):
        headers = {"Authorization": "Bearer " + self.params["access_token"]}

        wrong_headers = {"Authorization": "Bearer Blah"}

        response = self.params["app_test_client"].get("/codex-api/user/get-info", headers=wrong_headers)

        self.assertEqual(response.status_code, 403)

        response = self.params["app_test_client"].get("/codex-api/user/get-info", headers=headers)

        self.assertEqual(response.status_code, 200)

        response_data = json.loads(response.data)
        self.assertEqual(response_data["username"], "system-app@themathcompany.com")
        self.assertEqual(response_data["first_name"], "System")
        self.assertEqual(response_data["last_name"], "Application")
        self.assertNotEqual(response_data["last_login"], "")
        self.assertNotEqual(response_data["last_login"], None)
        self.assertNotEqual(response_data["access_key"], "")
        self.assertNotEqual(response_data["access_key"], None)
        self.assertEqual(response_data["feature_access"]["data_prep"], False)
        self.assertEqual(response_data["feature_access"]["model_train"], False)
        self.assertEqual(response_data["feature_access"]["model_pipelines"], False)
        self.assertEqual(response_data["feature_access"]["app_builder"], False)
        self.assertEqual(response_data["feature_access"]["rbac"], False)

    def tearDown(self):
        self.params["connection"].execute(
            """
    DELETE FROM user_group_identifier;
    DELETE FROM user_group WHERE id > 2;
    DELETE FROM "user";
    """
        )
