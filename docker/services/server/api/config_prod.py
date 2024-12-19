# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import os

POSTGRES_URI = os.environ.get("POSTGRES_URI")
SQLALCHEMY_DATABASE_URI = os.environ.get("POSTGRES_URI")
SQLALCHEMY_TRACK_MODIFICATIONS = False
# SQLALCHEMY_ENGINE_OPTIONS = {
#    "pool_pre_ping": True,
#    "pool_recycle": 300,
# }
DATA_AZURE_CONNECTION_STRING = os.environ.get("DATA_AZURE_CONNECTION_STRING")
DATA_FOLDER_PATH = "codx-data-prod"
AZURE_STORAGE_CONNECTION_STRING = os.environ.get("DATA_AZURE_CONNECTION_STRING")
AZURE_BLOB_ROOT_URL = os.environ.get("AZURE_BLOB_ROOT_URL")
AZURE_DEVOPS_ORG_URL = os.environ.get("AZURE_DEVOPS_ORG_URL")
AZURE_DEVOPS_REPO_PAT = os.environ.get("AZURE_DEVOPS_REPO_PAT")
AZURE_DEVOPS_PROJECT = "codex-widget-factory"
BACKEND_APP_URI = os.environ.get("BACKEND_APP_URI")
BACKEND_PRODUCT_APP_URI = os.environ.get("BACKEND_PRODUCT_APP_URI")
BACKEND_PRODUCT_APP_SECRET = os.environ.get("BACKEND_PRODUCT_APP_SECRET")
QUEUE_AZURE_STORAGE_CONNECTION_STRING = os.environ.get("DATA_AZURE_CONNECTION_STRING")
BACKGROUND_JOBS_QUEUE = os.environ.get("BACKGROUND_JOBS_QUEUE")
EXECUTION_FOLDER_PATH = os.environ.get("EXECUTION_FOLDER_PATH")
APPS_DB_URI = os.environ.get("APPS_DB_URI")

SECRET_KEY = os.environ.get("SECRET_KEY")
DOWNLOAD_STORY_BLOB_ROOT = os.environ.get("DOWNLOAD_STORY_BLOB_ROOT")

TOKEN_SECRET_KEY = os.environ.get("TOKEN_SECRET_KEY")

# Outlook SMTP credentials
SHARE_EMAIL_SENDER = "no-reply@mathco.com"
SHARE_EMAIL_PWD = os.environ.get("SHARE_EMAIL_PWD")
#  Sendgrid credentials
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
SENDGRID_EMAIL_SENDER = "devops@mathco.com"
API_VERSION = os.environ.get("API_VERSION")
# Execution Environment configuration
AZURE_DATABRICKS_DOMAIN = "https://adb-251255593389889.9.azuredatabricks.net"
AZURE_DATABRICKS_PERSONALACCESSTOKEN = os.environ.get("AZURE_DATABRICKS_PERSONALACCESSTOKEN")
AZURE_DATABRICKS_INSTALL_CODX_WF_SCRIPTPATH = os.environ.get("AZURE_DATABRICKS_INSTALL_CODX_WF_SCRIPTPATH")
AZURE_DATABRICKS_INSTALL_CATS_SCRIPTPATH = os.environ.get("AZURE_DATABRICKS_INSTALL_CATS_SCRIPTPATH")
EXECUTION_FOLDER_DATABRICKS_MOUNT = "codex_execution_prestage"

# specify all origins that can make requests to this backend
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS").split(",")
HTTPS_FORCE = True
AZURE_OAUTH_TENANCY = os.environ.get("AZURE_OAUTH_TENANCY")
AZURE_OAUTH_APPLICATION_ID = os.environ.get("AZURE_OAUTH_APPLICATION_ID")
