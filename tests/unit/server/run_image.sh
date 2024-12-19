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

podman-compose up -d --remove-orphans --force-recreate