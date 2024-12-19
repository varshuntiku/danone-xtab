#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import os

POSTGRES_URI = "postgresql://db_user:p%40ssw0rd@codex-db-stage.postgres.database.azure.com:6432/codex"
SQLALCHEMY_DATABASE_URI = "postgresql://db_user:p%40ssw0rd@codex-db-stage.postgres.database.azure.com:6432/codex"
SQLALCHEMY_TRACK_MODIFICATIONS = False
# SQLALCHEMY_ENGINE_OPTIONS = {
#    "pool_pre_ping": True,
#    "pool_recycle": 300,
#    "pool_size": 20,
#    "max_overflow": 10
# }
DATA_AZURE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=willbedeletedsoon;AccountKey=qa5A74pLx0IQxOJk4MGoQChO8kJW6u9rjUBQj8gOeL3bPADodK27ExoEMY/Gq1BIY1tDk9hEWQT+JcnhDO79SQ==;EndpointSuffix=core.windows.net"
DATA_FOLDER_PATH = "codex-data-stage"
AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=willbedeletedsoon;AccountKey=qa5A74pLx0IQxOJk4MGoQChO8kJW6u9rjUBQj8gOeL3bPADodK27ExoEMY/Gq1BIY1tDk9hEWQT+JcnhDO79SQ==;EndpointSuffix=core.windows.net"
AZURE_BLOB_ROOT_URL = "https://willbedeletedsoon.blob.core.windows.net/"
AZURE_DEVOPS_ORG_URL = "https://dev.azure.com/mathco-products"
AZURE_DEVOPS_REPO_PAT = os.environ.get("AZURE_DEVOPS_REPO_PAT")
AZURE_DEVOPS_PROJECT = "codex-widget-factory"
BACKEND_APP_URI = "https://codex-api-stage.azurewebsites.net/codex-api"
BACKEND_PRODUCT_APP_URI = "https://codex-products-api-stage.azurewebsites.net/codex-product-api"
BACKEND_PRODUCT_APP_SECRET = "codex-deployer-stage"
QUEUE_AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=queuecodex;AccountKey=hdsNTjUBvL8z1LIYta7GV1O3EPS6nZ9UYtLEdZ/mp6nfW6YT11ZZ1MYgfgYxpsdZOTK0n2lxW2fMinumjTYDDQ==;EndpointSuffix=core.windows.net"
BACKGROUND_JOBS_QUEUE = "queue-codex-stage"
EXECUTION_FOLDER_PATH = "codx-execution-stage"
APPS_DB_URI = (
    "user=db_user password=p@ssw0rd host=codex-db-stage.postgres.database.azure.com port=6432 dbname=codex_product"
)

SECRET_KEY = "codxauth"
DOWNLOAD_STORY_BLOB_ROOT = "https://codxpptdown.blob.core.windows.net/download-ppt"

TOKEN_SECRET_KEY = "ov+KHkKHj/L6Fo7lW5dWW0ov+ea6k+ly3hOuQOCseE3L8/Zh2q55x2V5nKAegji5R9XQ2B32DvEPmDsfmk3d/Q=="
# Outlook SMTP credentials
SHARE_EMAIL_SENDER = "no-reply@themathcompany.com"
SHARE_EMAIL_PWD = "MathCo^90"
#  Sendgrid credentials
SENDGRID_API_KEY = "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"
SENDGRID_EMAIL_SENDER = "devops@themathcompany.com"
API_VERSION = "3.0.0"
# Execution Environment configuration
AZURE_DATABRICKS_DOMAIN = "https://adb-251255593389889.9.azuredatabricks.net"
AZURE_DATABRICKS_PERSONALACCESSTOKEN = "dapibc780e09799ceb175469abfc029edf06"
AZURE_DATABRICKS_MOUNT_SCRIPTPATH = "dbfs:/FileStore/scripts/mount-exec-blob-stage.sh"
EXECUTION_FOLDER_PATH = "codx-execution-stage"
EXECUTION_FOLDER_DATABRICKS_MOUNT = "codex_execution_stage"


# specify all origins that can make requests to this backend
# ALLOWED_ORIGINS = ["https://codex-client-stage.azurewebsites.net", "https://codex-products-stage.azurewebsites.net"]
HTTPS_FORCE = True
AZURE_OAUTH_TENANCY = "4bf30310-e4f1-4658-9e34-9e8a5a193ed1"
AZURE_OAUTH_APPLICATION_ID = "ab51dea7-e54a-4007-bfde-3404abf24dfc"
