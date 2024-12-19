import os
import sys
import unittest

import xmlrunner
from connector_tests.datasource_db_test import DatasourceDBTest
from connector_tests.datasource_fs_test import DatasourceFSTest
from connector_tests.db_postgres_test import DatabasePostgresTest
from global_tests.setup_test import TestSetup
from helpers import CodexEnvParams
from http_tests.auth_test import AuthTest
from http_tests.config.authentication import get_response_token
from http_tests.config.fixtures import TestFixtures
from http_tests.config.get_db_connection import CodexDBConnection
from http_tests.main_test import MainTest
from http_tests.usergroups_test import UserGroupsTest
from http_tests.users_test import UsersTest
from test_case import ParametrizedTestCase
from wsgi import app

testdir = os.path.dirname(__file__)
srcdir = "../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))

testdir = os.path.dirname(__file__)


def suite():
    # test_fixtures = TestFixtures(False, False, False)

    env_params = CodexEnvParams()
    codex_db_connection = CodexDBConnection()
    connection = codex_db_connection.get_db_connection(env_params.getEnvParam("POSTGRES_URI"))
    app_test_client = app.test_client()
    app_test_runner = app.test_cli_runner()
    access_token = get_response_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    params = {
        "app_test_client": app_test_client,
        "app_test_runner": app_test_runner,
        "env_params": env_params,
        "connection": connection,
        "access_token": access_token,
        "headers": headers,
        "test_fixtures": TestFixtures(app_test_client, connection, headers),
    }

    suite = unittest.TestSuite()

    suite.addTest(unittest.makeSuite(TestSetup))

    suite.addTest(unittest.makeSuite(DatabasePostgresTest))
    suite.addTest(unittest.makeSuite(DatasourceDBTest))
    suite.addTest(unittest.makeSuite(DatasourceFSTest))

    suite.addTest(ParametrizedTestCase.parametrize(MainTest, params=params))
    suite.addTest(ParametrizedTestCase.parametrize(AuthTest, params=params))

    suite.addTest(ParametrizedTestCase.parametrize(UsersTest, params=params))
    suite.addTest(ParametrizedTestCase.parametrize(UserGroupsTest, params=params))

    return suite


if __name__ == "__main__":
    xmlrunner.XMLTestRunner().run(suite())
