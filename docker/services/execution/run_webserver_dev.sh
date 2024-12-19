#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

#!/bin/bash
source ~/.bashrc
conda activate codx_exec_service

# config file
cd api
rm -rf config.py
cp config_dev.py config.py
cd ..

# flask env variables
export FLASK_APP=main
export FLASK_RUN_PORT=8002
export FLASK_ENV=development
# should be by default set as warning, at time of checking logs to debug set it as debug
# logger level values which can be used are: debug, info, warning, error, critical
export FLASK_LOGGER_LEVEL='warning'

echo "CODEX DYNAMIC VIZ EXECUTION ENV >>> Starting Webserver"

gunicorn -k eventlet -b 0.0.0.0 -w 5 --timeout 960 api.main:app