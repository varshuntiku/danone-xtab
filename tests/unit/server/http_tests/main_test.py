import os
import sys

from test_case import ParametrizedTestCase

testdir = os.path.dirname(__file__)
srcdir = "../../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))


class MainTest(ParametrizedTestCase):
    def test_setup(self):
        self.assertEqual(True, True)

    def test_index(self):
        response = self.params["app_test_client"].get("/codex-api/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode("utf-8"), "Welcome to the CODEX !\n")

    def test_info(self):
        response = self.params["app_test_client"].get("/codex-api/info")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode("utf-8").find("Error: "), -1)
        self.assertNotEqual(response.data.decode("utf-8").find("PostGreSQL: "), -1)
        self.assertNotEqual(response.data.decode("utf-8").find("MongoClient"), -1)
        self.assertNotEqual(response.data.decode("utf-8").find("RedisDB: "), -1)

    def test_userinfo_withoutauth(self):
        response = self.params["app_test_client"].get("/codex-api/user/get-info")

        self.assertEqual(response.status_code, 403)
