SQLALCHEMY_DATABASE_URI = "postgresql://db_user:p%40ssw0rd@codex-db-stage.postgres.database.azure.com:5432/codex"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}
SQLALCHEMY_BINDS = {
    "APP_DB": "postgresql://db_user:p%40ssw0rd@codex-db-stage.postgres.database.azure.com:5432/codex_product"
}
APPS_DB_URI = (
    "user=db_user password=p%40ssw0rd host=codex-db-stage.postgres.database.azure.com port=5432 dbname=codex_product"
)

PPT_DOWNLOAD_FUNCTION_URL = "https://codex-ppt-download.azurewebsites.net/api/PptDownload?code=r5yM3aoyXfpboP1sXW9Bx4wMSRjux05AXqUVKm4Wcs3kuY0/0e3DJg=="
