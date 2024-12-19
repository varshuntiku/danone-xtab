#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

POSTGRES_URI = "postgresql://db_user:p%40ssw0rd@localhost:5832/codex"
SQLALCHEMY_DATABASE_URI = "postgresql://db_user:p%40ssw0rd@localhost:5832/codex"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}
DATA_AZURE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=stcodxdev;AccountKey=4yyB8cZz/EMvRjzILCOB+iWYeVY09mmSyj8q6gUXh0rQ5fAN4nvxlv95RSOZt1MDmgB8iTQK9ad7+AStltcinA==;EndpointSuffix=core.windows.net"
DATA_FOLDER_PATH = "codex-data-local"
AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=stcodxdev;AccountKey=4yyB8cZz/EMvRjzILCOB+iWYeVY09mmSyj8q6gUXh0rQ5fAN4nvxlv95RSOZt1MDmgB8iTQK9ad7+AStltcinA==;EndpointSuffix=core.windows.net"
AZURE_BLOB_ROOT_URL = "https://stcodxdev.blob.core.windows.net/"
AZURE_DEVOPS_ORG_URL = "https://dev.azure.com/mathco-products"
AZURE_DEVOPS_REPO_PAT = "dnjygntwuiodrds6qkdcojp6bjcr2sefgc4y7zv2objk6j3wgbya"
AZURE_DEVOPS_PROJECT = "codex-widget-factory"
BACKEND_APP_URI = "http://localhost:8000/codex-api"
BACKEND_PRODUCT_APP_URI = "http://localhost:8001/codex-product-api"
BACKEND_PRODUCT_APP_SECRET = "codex-deployer"
QUEUE_AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=queuecodex;AccountKey=hdsNTjUBvL8z1LIYta7GV1O3EPS6nZ9UYtLEdZ/mp6nfW6YT11ZZ1MYgfgYxpsdZOTK0n2lxW2fMinumjTYDDQ==;EndpointSuffix=core.windows.net"
BACKGROUND_JOBS_QUEUE = "queue-codex"
APPS_DB_URI = "user=db_user password=p@ssw0rd host=localhost port=5832 dbname=codex_product"

SECRET_KEY = "codxauth"
DOWNLOAD_STORY_BLOB_ROOT = "https://storageaccountcodexb648.blob.core.windows.net/download-ppt"

TOKEN_SECRET_KEY = "ov+KHkKHj/L6Fo7lW5dWW0ov+ea6k+ly3hOuQOCseE3L8/Zh2q55x2V5nKAegji5R9XQ2B32DvEPmDsfmk3d/Q=="
# Outlook SMTP credentials
SHARE_EMAIL_SENDER = "no-reply@themathcompany.com"
SHARE_EMAIL_PWD = "MathCo^90"
#  Sendgrid credentials
SENDGRID_API_KEY = "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"
SENDGRID_EMAIL_SENDER = "devops@themathcompany.com"

# Execution Environment configuration
AZURE_DATABRICKS_DOMAIN = "https://adb-251255593389889.9.azuredatabricks.net"
AZURE_DATABRICKS_PERSONALACCESSTOKEN = "dapibc780e09799ceb175469abfc029edf06"
AZURE_DATABRICKS_INSTALL_CODX_WF_SCRIPTPATH = "dbfs:/FileStore/scripts/install-codx-wf.sh"
AZURE_DATABRICKS_INSTALL_CATS_SCRIPTPATH = "dbfs:/FileStore/scripts/install-cats.sh"
EXECUTION_FOLDER_PATH = "codx-execution-local"
EXECUTION_FOLDER_DATABRICKS_MOUNT = "codex_execution_local"

DYNAMIC_EXEC_ENV_URL = "http://localhost:8002/codex-exec-api"
DYNAMIC_VIZ_DOMAIN = "http://52.165.99.93/codx-exec-api"

# specify all origins that can make requests to this backend
# example = ["http://localhost:3001", "https://codex-products-test.azurewebsites.net"]
ALLOWED_ORIGINS = ["http://localhost:3001", "http://localhost:3000"]
HTTPS_FORCE = False
AZURE_OAUTH_TENANCY = "4bf30310-e4f1-4658-9e34-9e8a5a193ed1"
AZURE_OAUTH_APPLICATION_ID = "ab51dea7-e54a-4007-bfde-3404abf24dfc"

PLATFORM_ENABLE_SENTRY = False
PLATFORM_ENABLE_APP_INSIGHTS = False
