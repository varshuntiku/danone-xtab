#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import os

POSTGRES_URI = os.environ.get("POSTGRES_URI")
SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
SQLALCHEMY_TRACK_MODIFICATIONS = False
# SQLALCHEMY_ENGINE_OPTIONS = {
#     "pool_pre_ping": True,
#     "pool_recycle": 300,
#     "pool_size": 20,
#     "max_overflow": 10
# }
DATA_AZURE_CONNECTION_STRING = os.environ.get("DATA_AZURE_CONNECTION_STRING")
DATA_FOLDER_PATH = "codex-data-test"
AZURE_STORAGE_CONNECTION_STRING = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
AZURE_BLOB_ROOT_URL = os.environ.get("AZURE_BLOB_ROOT_URL")
AZURE_DEVOPS_ORG_URL = "https://dev.azure.com/mathco-products"
AZURE_DEVOPS_REPO_PAT = os.environ.get("AZURE_DEVOPS_REPO_PAT")
AZURE_DEVOPS_PROJECT = "codex-widget-factory"
BACKEND_APP_URI = os.environ.get("BACKEND_APP_URI")
BACKEND_PRODUCT_APP_URI = os.environ.get("BACKEND_PRODUCT_APP_URI")
BACKEND_PRODUCT_APP_SECRET = os.environ.get("BACKEND_PRODUCT_APP_SECRET")
QUEUE_AZURE_STORAGE_CONNECTION_STRING = os.environ.get("QUEUE_AZURE_STORAGE_CONNECTION_STRING")
BACKGROUND_JOBS_QUEUE = os.environ.get("BACKGROUND_JOBS_QUEUE")
EXECUTION_FOLDER_PATH = "codx-execution-test"
APPS_DB_URI = os.environ.get("APPS_DB_URI")

SECRET_KEY = os.environ.get("SECRET_KEY")
DOWNLOAD_STORY_BLOB_ROOT = os.environ.get("DOWNLOAD_STORY_BLOB_ROOT")

TOKEN_SECRET_KEY = os.environ.get("TOKEN_SECRET_KEY")

# Outlook SMTP credentials
SHARE_EMAIL_SENDER = "no-reply@themathcompany.com"
SHARE_EMAIL_PWD = os.environ.get("SHARE_EMAIL_PWD")
#  Sendgrid credentials
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
SENDGRID_EMAIL_SENDER = "devops@themathcompany.com"
API_VERSION = os.environ.get("API_VERSION")
# Execution Environment configuration
AZURE_DATABRICKS_DOMAIN = os.environ.get("AZURE_DATABRICKS_DOMAIN")
AZURE_DATABRICKS_PERSONALACCESSTOKEN = os.environ.get("AZURE_DATABRICKS_PERSONALACCESSTOKEN")
AZURE_DATABRICKS_INSTALL_CODX_WF_SCRIPTPATH = "dbfs:/FileStore/scripts/install-codx-wf.sh"
AZURE_DATABRICKS_INSTALL_CATS_SCRIPTPATH = "dbfs:/FileStore/scripts/install-cats.sh"
EXECUTION_FOLDER_DATABRICKS_MOUNT = "codex_execution_prestage"

# specify all origins that can make requests to this backend
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS").split(",")
HTTPS_FORCE = True
AZURE_OAUTH_TENANCY = os.environ.get("AZURE_OAUTH_TENANCY")
AZURE_OAUTH_APPLICATION_ID = os.environ.get("AZURE_OAUTH_APPLICATION_ID")
