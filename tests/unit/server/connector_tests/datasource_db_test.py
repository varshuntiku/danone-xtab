import os
import sys
import unittest

from connectors.datasource import DatasourceDatabase
from helpers import CodexEnvParams
from sqlalchemy import create_engine

testdir = os.path.dirname(__file__)
srcdir = "../../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))


class DatasourceDBTest(unittest.TestCase):
    def setUp(self):
        self.env_params = CodexEnvParams()
        self.engine = create_engine(self.env_params.getEnvParam("POSTGRES_URI"))
        self.connection = self.engine.connect()
        self.connection.execute(
            """
    CREATE TABLE public.test_table (
      id integer NOT NULL,
      name character varying(80) NOT NULL
    );
    INSERT INTO public.test_table (id, name)
    VALUES  ('1', 'name1'),
            ('2', 'name2'),
            ('3','name3');
    """
        )

    def test_setup(self):
        self.assertEqual(True, True)

    def test_datasource_connection(self):
        datasource_db = DatasourceDatabase()
        datasource_db.test_connection(self.env_params.getEnvParam("POSTGRES_URI"))
        logs = datasource_db.getLogs()

        self.assertNotEqual(logs, "")
        self.assertEqual(logs.find("Error: "), -1)

    def test_datasource_testquery(self):
        datasource_db = DatasourceDatabase()

        datasource_db.test_query(self.env_params.getEnvParam("POSTGRES_URI"), "SELECT id FROM wrong_table")
        logs = datasource_db.getLogs()

        self.assertNotEqual(logs.find("Error: "), -1)

        datasource_db = DatasourceDatabase()
        datasource_db.test_query(
            self.env_params.getEnvParam("POSTGRES_URI"),
            "SELECT id, name FROM test_table",
        )
        logs = datasource_db.getLogs()

        self.assertEqual(
            logs,
            """Datasource database connected
Result row: (1, 'name1')
Datasource database closed
""",
        )
        self.assertEqual(logs.find("Error: "), -1)

    def test_datasource_query_limit(self):
        datasource_db = DatasourceDatabase()
        rows = datasource_db.run_query(
            self.env_params.getEnvParam("POSTGRES_URI"),
            "SELECT id, name FROM test_table",
            1,
        )
        logs = datasource_db.getLogs()

        self.assertEqual(
            logs,
            """Datasource database connected
Datasource database closed
""",
        )
        self.assertEqual(logs.find("Error: "), -1)
        self.assertEqual(len(rows), 1)

    def test_datasource_query_nolimit(self):
        datasource_db = DatasourceDatabase()
        rows = datasource_db.run_query(
            self.env_params.getEnvParam("POSTGRES_URI"),
            "SELECT id, name FROM test_table",
        )
        logs = datasource_db.getLogs()

        self.assertEqual(
            logs,
            """Datasource database connected
Datasource database closed
""",
        )
        self.assertEqual(logs.find("Error: "), -1)
        self.assertEqual(len(rows), 3)

    def tearDown(self):
        self.connection.execute("DROP TABLE public.test_table;")
        self.connection.close()
