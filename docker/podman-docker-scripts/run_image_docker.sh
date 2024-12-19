#!/bin/bash
# SET THE FOLLOWING VARIABLES
# docker registry
REGISTRY_LINK=mathcodex.azurecr.io

# BRANCH set up
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ -z "$BRANCH" ]
  then
    IMAGE_SUFFIX=""
  else
    if [ "$BRANCH" = "master" ]
      then
        IMAGE_SUFFIX=""
      else
        if [ "$BRANCH" = "HEAD" ]
          then
            IMAGE_SUFFIX=""
          else
            IMAGE_SUFFIX="-$BRANCH"
        fi
    fi
fi

if [ "$IMAGE_SUFFIX" = "HEAD" ]
  then
      IMAGE_SUFFIX=""
fi

export POSTGRES_IMAGE="$REGISTRY_LINK/codex-system-db:latest"
export SERVER_IMAGE="$REGISTRY_LINK/codex-server$IMAGE_SUFFIX:latest"
export CLIENT_IMAGE="$REGISTRY_LINK/codex-client$IMAGE_SUFFIX:latest"

export POSTGRES_URI="postgresql://db_user:p@ssw0rd@codex-system-db-service:5432/codex"
export POSTGRES_SERVICE_NAME="codex-system-db-service"
export POSTGRES_SERVICE_PORT="5432"
export DATA_AZURE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=willbedeletedsoon;AccountKey=qa5A74pLx0IQxOJk4MGoQChO8kJW6u9rjUBQj8gOeL3bPADodK27ExoEMY/Gq1BIY1tDk9hEWQT+JcnhDO79SQ==;EndpointSuffix=core.windows.net"
export DATA_FOLDER_PATH="codex-data-dev"
export APP_FOLDER_PATH="/api"
export BACKEND_APP_URI="http://localhost/codex-api"
export AZURE_BLOB_ROOT_URL="https://willbedeletedsoon.blob.core.windows.net/"
export AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=willbedeletedsoon;AccountKey=qa5A74pLx0IQxOJk4MGoQChO8kJW6u9rjUBQj8gOeL3bPADodK27ExoEMY/Gq1BIY1tDk9hEWQT+JcnhDO79SQ==;EndpointSuffix=core.windows.net"

docker-compose up -d --remove-orphans --force-recreate