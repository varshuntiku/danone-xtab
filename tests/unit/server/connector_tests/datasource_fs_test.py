import os
import sys
import unittest

from connectors.datasource import DatasourceFileStorage
from helpers import CodexEnvParams

testdir = os.path.dirname(__file__)
srcdir = "../../../../docker/services/server/app"
sys.path.insert(0, os.path.abspath(os.path.join(testdir, srcdir)))


class DatasourceFSTest(unittest.TestCase):
    def setUp(self):
        self.env_params = CodexEnvParams()

    def test_setup(self):
        self.assertEqual(True, True)

    def test_datasource_connection(self):
        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.test_connection(
            self.env_params.getEnvParam("AZURE_STORAGE_CONNECTION_STRING"),
            "codex-unittest",
        )
        logs = datasource_fs.getLogs()

        self.assertEqual(
            logs,
            """Datasource file storage connected
Datasource file storage container connected
- Blob name: binary_classification_data.csv
- Blob name: unemp_rate.csv
""",
        )

    def test_datasource_blobexists(self):
        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.test_blob_exists(
            self.env_params.getEnvParam("AZURE_STORAGE_CONNECTION_STRING"),
            "codex-unittest",
            "binary_classification_data.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertEqual(
            logs,
            """Datasource file storage connected
Datasource file storage container connected
Datasource file storage blob content exists:
binary_classification_data.csv
""",
        )

        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.test_blob_exists(
            "blah-wrong-connection-uri",
            "codex-unittest",
            "binary_classification_data.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertNotEqual(logs.find("Error: "), -1)

    def test_datasource_blobnotexists(self):
        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.test_blob_exists(
            self.env_params.getEnvParam("AZURE_STORAGE_CONNECTION_STRING"),
            "codex-unittest",
            "wrong_blob_name.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertEqual(
            logs,
            """Datasource file storage connected
Datasource file storage container connected
Datasource file storage blob content does not exist
""",
        )

    def test_datasource_copyblobexists(self):
        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.copy_blob(
            self.env_params.getEnvParam("AZURE_STORAGE_CONNECTION_STRING"),
            "codex-unittest",
            "binary_classification_data.csv",
            "./binary_classification_data.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertEqual(
            logs,
            """Datasource file storage connected
Datasource file storage container connected
Datasource file storage blob content copied:
./binary_classification_data.csv
""",
        )
        os.remove("./binary_classification_data.csv")

    def test_datasource_copyblobnotexists(self):
        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.copy_blob(
            "blah-wrong-connection-uri",
            "codex-wrong-test",
            "wrong_blob_name.csv",
            "./wrong_blob_name.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertNotEqual(logs.find("Error: "), -1)

        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.copy_blob(
            self.env_params.getEnvParam("AZURE_STORAGE_CONNECTION_STRING"),
            "codex-unittest",
            "wrong_blob_name.csv",
            "./wrong_blob_name.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertNotEqual(
            logs.find("Error: The specified blob does not exist. ErrorCode: BlobNotFound"),
            -1,
        )
        os.remove("./wrong_blob_name.csv")

    def test_datasource_testquery(self):
        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.test_query(
            self.env_params.getEnvParam("AZURE_STORAGE_CONNECTION_STRING"),
            "codex-unittest",
            "binary_classification_data.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertEqual(
            logs,
            """Datasource file storage connected
Datasource file storage container connected
Datasource file storage blob content headers:
cust_id
age
job
marital
education
default
balance
housing
loan
contact
day
month
duration
campaign
pdays
previous
poutcome
y
""",
        )

    def test_datasource_testquerynotexists(self):
        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.test_query(
            self.env_params.getEnvParam("AZURE_STORAGE_CONNECTION_STRING"),
            "codex-unittest",
            "wrong_blob_name.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertNotEqual(
            logs.find("Error: The specified blob does not exist. ErrorCode: BlobNotFound"),
            -1,
        )

    def test_datasource_runquery(self):
        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        data_rows = datasource_fs.run_query(
            self.env_params.getEnvParam("AZURE_STORAGE_CONNECTION_STRING"),
            "codex-unittest",
            "binary_classification_data.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertEqual(
            logs,
            """Datasource file storage connected
Datasource file downloaded
Datasource data created
Datasource file deletion
""",
        )
        self.assertEqual(len(data_rows), 4521)

    def test_datasource_runquerynotexists(self):
        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.run_query(
            self.env_params.getEnvParam("AZURE_STORAGE_CONNECTION_STRING"),
            "codex-unittest",
            "wrong_blob_name.csv",
        )
        logs = datasource_fs.getLogs()

        self.assertNotEqual(logs.find("Error:"), -1)
