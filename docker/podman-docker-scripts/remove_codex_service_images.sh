#!/bin/sh
set -ex

remove_docker_image()
{
  # SET THE FOLLOWING VARIABLES
  # docker registry
  REGISTRY_LINK=mathcodex.azurecr.io

  # --- PostGreSQL image ---docker
  # image name
  IMAGE=codex-$1

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

  docker rmi --force $REGISTRY_LINK/$IMAGE$IMAGE_SUFFIX:latest
}

if [ -z "$1" ]
  then
    for dir in "server" "client"
    do
        remove_docker_image $dir
    done
  else
    remove_docker_image $1
fi

docker images --filter "label=platform=codex"