#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

export FLASK_APP=main
export FLASK_RUN_PORT=8000
export FLASK_ENV=development

echo "CODEX >>> Migrating database"

cd api
flask db upgrade

echo "CODEX >>> Starting Webserver"

flask run

cd ..