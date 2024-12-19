#!/bin/bash
CURRENT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
CURRENT_DIR=$(dirname $CURRENT_PATH)

echo "Creating required databases and datastores"
cd unit/server/
./run_image.sh
cd ../..

echo "Waiting for postgres..."

while ! nc -z localhost 5932; do
  sleep 0.1
done

# echo "PostgreSQL started"

# echo "Installing required libraries"
# pip3 install -r ../docker/services/server/requirements.txt
# pip3 install numpy
# pip3 install pandas==1.0.4
# pip3 install scipy==1.2.1
# pip3 install statsmodels==0.9.0
# pip3 install coverage==4.5.2
# pip3 install xmlrunner==1.7.7
# pip3 install adal==1.2.1
# pip3 install matplotlib==3.0.2

export POSTGRES_URI="postgresql://db_user:p@ssw0rd@localhost:5932/codex_test"
export POSTGRES_SERVICE_NAME="localhost"
export POSTGRES_SERVICE_PORT="5932"
export DATA_FOLDER_PATH="$CURRENT_DIR/docker/server_data"
export APP_FOLDER_PATH="$CURRENT_DIR/docker/services/server/api"
export AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=willbedeletedsoon;AccountKey=qa5A74pLx0IQxOJk4MGoQChO8kJW6u9rjUBQj8gOeL3bPADodK27ExoEMY/Gq1BIY1tDk9hEWQT+JcnhDO79SQ==;EndpointSuffix=core.windows.net"

# echo "Migrating Database"
# cd ../docker/services/server/
# python3 app/models.py db upgrade
# cd ../../../tests/

# echo "Running Unit Tests"
# python3 -m coverage run --source=../docker/services/server/app unit/server/suite.py
# python3 -m coverage report
# python3 -m coverage xml

# echo "Stopping databases and datastores"
# cd unit/server/
# ./stop_image.sh
# cd ../..

podman volume prune -f
