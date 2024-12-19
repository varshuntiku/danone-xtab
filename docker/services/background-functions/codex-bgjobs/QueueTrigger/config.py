SQLALCHEMY_DATABASE_URI = "postgresql://db_user:p@ssw0rd@localhost:5832/codex"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}
SQLALCHEMY_BINDS = {"APP_DB": "postgresql://db_user:p@ssw0rd@localhost:5832/codex_product"}
APPS_DB_URI = "user=db_user password=p@ssw0rd host=localhost port=5832 dbname=codex_product"

PPT_DOWNLOAD_FUNCTION_URL = "https://codex-ppt-download.azurewebsites.net/api/PptDownload?code=r5yM3aoyXfpboP1sXW9Bx4wMSRjux05AXqUVKm4Wcs3kuY0/0e3DJg=="
