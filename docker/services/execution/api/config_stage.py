#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

# Azure oauth credentials for authentication
AZURE_OAUTH_TENANCY = "4bf30310-e4f1-4658-9e34-9e8a5a193ed1"
AZURE_OAUTH_APPLICATION_ID = "ab51dea7-e54a-4007-bfde-3404abf24dfc"

# Product server connection string
PRODUCT_SERVER_SQLALCHEMY_DATABASE_URI = (
    "postgresql://db_user@codx-db-stage:p%40ssw0rd@codx-db-stage.postgres.database.azure.com:5432/codex_product"
)
PRODUCT_SERVER_SCHEMA = "public"
