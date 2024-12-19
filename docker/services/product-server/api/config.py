#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx. Test
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

POSTGRES_URI = "postgresql://db_user:p%40ssw0rd@localhost:5432/codex_product"
SQLALCHEMY_DATABASE_URI = "postgresql://db_user:p%40ssw0rd@localhost:5432/codex_product"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ENGINE_OPTIONS = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}
DATA_AZURE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=stcodxdev;AccountKey=4yyB8cZz/EMvRjzILCOB+iWYeVY09mmSyj8q6gUXh0rQ5fAN4nvxlv95RSOZt1MDmgB8iTQK9ad7+AStltcinA==;EndpointSuffix=core.windows.net"
DATA_FOLDER_PATH = "codex-products-local"
AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=stcodxdev;AccountKey=4yyB8cZz/EMvRjzILCOB+iWYeVY09mmSyj8q6gUXh0rQ5fAN4nvxlv95RSOZt1MDmgB8iTQK9ad7+AStltcinA==;EndpointSuffix=core.windows.net"
AZURE_BLOB_ROOT_URL = "https://stcodxdev.blob.core.windows.net/"
BACKEND_APP_URI = "http://localhost:8001/codex-product-api"
BACKEND_PLATFORM_API = "http://localhost:8000/codex-api"
BACKEND_PRODUCT_APP_SECRET = "codex-deployer"
SHARE_EMAIL_SENDER = "no-reply@themathcompany.com"
SHARE_EMAIL_PWD = "MathCo^90"
TOKEN_SECRET_KEY = "ov+KHkKHj/L6Fo7lW5dWW0ov+ea6k+ly3hOuQOCseE3L8/Zh2q55x2V5nKAegji5R9XQ2B32DvEPmDsfmk3d/Q=="
CLIENT_HTTP_ORIGIN = "http://localhost:3001"
SENDGRID_API_KEY = "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"
SENDGRID_EMAIL_SENDER = "devops@themathcompany.com"
API_VERSION = "3.5.0"
DATABRICK_INSTANCE_ID = "https://adb-251255593389889.9.azuredatabricks.net"
DATABRICK_PAT = "dapi14fd9ac1b37ba493a444acf4d05c5e97"
DATABRICK_CLUSTER_ID = "0412-060905-i2gld2p8"

DYNAMIC_EXEC_ENV_EXECUTE_URL = "http://localhost:8002/codex-exec-api/execute"
# specify all origins that can make requests to this backend
# example = ["https://codex-client-test.azurewebsites.net", "https://codex-products-test.azurewebsites.net"]
ALLOWED_ORIGINS = ["http://localhost:3001", "http://localhost:3000"]
HTTPS_FORCE = False

AZURE_OAUTH_TENANCY = "4bf30310-e4f1-4658-9e34-9e8a5a193ed1"
AZURE_OAUTH_APPLICATION_ID = "ab51dea7-e54a-4007-bfde-3404abf24dfc"
AZURE_OAUTH_SCOPE = "2ff814a6-3304-4ab8-85cb-cd0e6f879c1d"
AZURE_OAUTH_CLIENT_SECRET = "7jd8Q~TRh0UYGKPCb3zfHGtVd6~UDCmhneo98aOU"
DYNAMIC_EXEC_ENV_URL = "http://localhost:8002/codex-exec-api"

CRYPTO_ENCRYPTION_KEY = b"YRwuXsgJ8_OnxlE63B3YLfqvghSclTYuixpEJm1_YAU="

CHATGPT_OPENAI_BASE_URL = "https://minervatexttosql.openai.azure.com"
CHATGPT_OPENAI_MODEL = "gpt-35-16k"
CHATGPT_OPENAI_API_VERSION = "2023-07-01-preview"
CHATGPT_OPENAI_KEY = "eb5760d8736941a4ada8413b9145026f"

NUCLIOS_PRODUCT_ENABLE_SENTRY = False
NUCLIOS_PRODUCT_ENABLE_APP_INSIGHTS = False

AZURE_FILESHARE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=stinnovation;AccountKey=IZ/09VllySsqQ0m0OF8XC1j199twF2AOlmslUAxf6K+slKdzfHgLvkJVVe7gfsezxBCWrjSnAksO+AStvLc5Aw==;EndpointSuffix=core.windows.net"
FILESHARE_NAME = "dev1"
