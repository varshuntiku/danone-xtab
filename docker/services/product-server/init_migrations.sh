#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

export FLASK_APP=main

echo "CODEX PRODUCT >>> Init migrating database"

cd api
flask db init

cd ..