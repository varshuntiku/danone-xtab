#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import base64
import os

POSTGRES_URI = os.environ.get("POSTGRES_URI")
SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
SQLALCHEMY_TRACK_MODIFICATIONS = False
# SQLALCHEMY_ENGINE_OPTIONS = {
#    "pool_pre_ping": True,
#    "pool_recycle": 300,
# }
DATA_AZURE_CONNECTION_STRING = os.environ.get("DATA_AZURE_CONNECTION_STRING")
DATA_FOLDER_PATH = os.environ.get("DATA_FOLDER_PATH")
AZURE_STORAGE_CONNECTION_STRING = os.environ.get("AZURE_STORAGE_CONNECTION_STRING")
AZURE_BLOB_ROOT_URL = os.environ.get("AZURE_BLOB_ROOT_URL")
BACKEND_APP_URI = os.environ.get("BACKEND_APP_URI")
BACKEND_PLATFORM_API = os.environ.get("BACKEND_PLATFORM_API")
BACKEND_PRODUCT_APP_SECRET = os.environ.get("BACKEND_PRODUCT_APP_SECRET")
SHARE_EMAIL_SENDER = os.environ.get("SHARE_EMAIL")
SHARE_EMAIL_PWD = os.environ.get("SHARE_EMAIL_PWD")
TOKEN_SECRET_KEY = os.environ.get("TOKEN_SECRET_KEY")
CLIENT_HTTP_ORIGIN = os.environ.get("CLIENT_HTTP_ORIGIN")
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
SENDGRID_EMAIL_SENDER = os.environ.get("SENDGRID_EMAIL")
API_VERSION = os.environ.get("API_VERSION")
DATABRICK_INSTANCE_ID = "https://adb-1544790489405517.17.azuredatabricks.net"
DATABRICK_PAT = os.environ.get("DATABRICK_PAT")
DATABRICK_CLUSTER_ID = os.environ.get("DATABRICK_CLUSTER_ID")

# specify all origins that can make requests to this backend
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS").split(",")
HTTPS_FORCE = True
AZURE_OAUTH_TENANCY = os.environ.get("AZURE_OAUTH_TENANCY")
AZURE_OAUTH_APPLICATION_ID = os.environ.get("AZURE_OAUTH_APPLICATION_ID")
AZURE_OAUTH_CLIENT_SECRET = os.environ.get("AZURE_OAUTH_CLIENT_SECRET")
AZURE_OAUTH_SCOPE = os.environ.get("AZURE_OAUTH_SCOPE")

DYNAMIC_EXEC_ENV_URL = "https://codex-exec-prestage.azurewebsites.net/codex-exec-api"
CRYPTO_ENCRYPTION_KEY = base64.b64decode(os.environ.get("CRYPTO_ENCRYPTION_KEY"))

CHATGPT_OPENAI_BASE_URL = os.environ.get("CHATGPT_OPENAI_BASE_URL")
CHATGPT_OPENAI_MODEL = os.environ.get("CHATGPT_OPENAI_MODEL")
CHATGPT_OPENAI_API_VERSION = os.environ.get("CHATGPT_OPENAI_API_VERSION")
CHATGPT_OPENAI_KEY = os.environ.get("CHATGPT_OPENAI_KEY")

NUCLIOS_PRODUCT_ENABLE_SENTRY = os.environ.get("NUCLIOS_PRODUCT_ENABLE_SENTRY")
NUCLIOS_PRODUCT_ENABLE_APP_INSIGHTS = os.environ.get("NUCLIOS_PRODUCT_ENABLE_APP_INSIGHTS")

AZURE_FILESHARE_CONNECTION_STRING = os.environ.get("AZURE_FILESHARE_CONNECTION_STRING")
FILESHARE_NAME = os.environ.get("FILESHARE_NAME")
