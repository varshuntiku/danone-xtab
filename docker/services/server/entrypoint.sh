#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

#!/bin/bash

echo "Waiting for postgres..."

while ! nc -z "$POSTGRES_SERVICE_NAME" "$POSTGRES_SERVICE_PORT"; do
  sleep 0.1
done

echo "PostgreSQL started"

cd api

flask db upgrade

cd ..

/usr/bin/supervisord