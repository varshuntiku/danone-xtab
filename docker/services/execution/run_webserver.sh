#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

export FLASK_APP=main
export FLASK_RUN_PORT=8002
export FLASK_ENV=development
# should be by default set as warning, at time of checking logs to debug set it as debug
# logger level values which can be used are: debug, info, warning, error, critical
export FLASK_LOGGER_LEVEL='debug'

cd api

echo "CODEX DYNAMIC VIZ EXECUTION ENV >>> Starting Webserver"

flask run

cd ..