#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2024
# This file is part of Codx.
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

cd /app/code-executor-service
# cd ..
echo "CODEX >>> Starting Webserver"
# gunicorn api.main:app --workers 30 --threads 100 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:80 --timeout 900 --keep-alive 900 --log-level debug
uvicorn api.main:app --host 0.0.0.0 --port 80 --workers 30 --timeout-keep-alive 900