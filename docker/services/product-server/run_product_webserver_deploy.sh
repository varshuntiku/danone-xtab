#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
# This file is part of Codx.
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.
export FLASK_APP=main.py
cd /app/product/api
# flask db upgrade
cd ..
echo "CODEX >>> Starting Webserver"
set -e
service ssh start
gunicorn --bind=0.0.0.0:80 --workers=8 --threads 120 --worker-class eventlet --worker-connections 3000 --timeout 900 --access-logfile /var/log/gunicorn.access.log --error-logfile /var/log/gunicorn.error.log api.main:app
