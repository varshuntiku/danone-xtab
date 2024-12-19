import os
import sys
import unittest

from connectors.postgres import PostgresDatabase
from flask import Flask
from helpers import CodexEnvParams

testdir = os.path.dirname(__file__)
srcdir = "../../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("POSTGRES_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


class DatabasePostgresTest(unittest.TestCase):
    def setUp(self):
        self.env_params = CodexEnvParams()

    def test_setup(self):
        self.assertEqual(True, True)

    def test_database(self):
        pg_db = PostgresDatabase(False)
        logs = pg_db.getLogs()
        self.assertNotEqual(logs.find("Error: "), -1)

        pg_db = PostgresDatabase(app)
        logs = pg_db.getLogs()

        self.assertNotEqual(logs, "")

        self.assertEqual(logs.find("Error: "), -1)
