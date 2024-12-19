#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

echo "CODEX >>> Migrating database"

cd api
rm -rf config.py
cp config_stage.py config.py
flask db upgrade
cd ..

echo "CODEX >>> Starting Webserver"

#gunicorn --bind=0.0.0.0 --workers=8 --timeout 960 api.main:app

gunicorn -k eventlet -b 0.0.0.0 -w 5 --timeout 960 --ssl-version=TLSv1_2 --ciphers='DEFAULT:!aNULL:!eNULL:!MD5:!3DES:!DES:!RC4:!IDEA:!SEED:!aDSS:!SRP:!PSK' api.main:app
