SQLALCHEMY_DATABASE_URI = "postgresql://db_user:p%40ssw0rd@codx-db-test.postgres.database.azure.com:5432/codex"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ENGINE_OPTIONS = (
    {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    },
)
SQLALCHEMY_BINDS = {
    "APP_DB": "postgresql://db_user:p%40ssw0rd@codx-db-test.postgres.database.azure.com:5432/codex_product"
}
APPS_DB_URI = (
    "user=db_user password=p%40ssw0rd host=codx-db-test.postgres.database.azure.com port=5432 dbname=codex_product"
)

PPT_DOWNLOAD_FUNCTION_URL = "https://codx-ppt-download.azurewebsites.net/api/PptDownload?code=7b2albkz14yfvvZyWpk3LJpO-tzAcEQ28MkvRpYHFe4QAzFuMmthQw=="
