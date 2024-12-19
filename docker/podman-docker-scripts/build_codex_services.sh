#!/bin/bash

build_docker_image()
{
  echo "CODEX >>> Starting docker image build: $1"
  cd ./services/$1

  # Docker Registry
  REGISTRY_LINK=mathcodex.azurecr.io

  # Image Name
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

  docker build . -t $REGISTRY_LINK/$IMAGE$IMAGE_SUFFIX:latest --no-cache

  cd ../..
  echo "CODEX >>> Docker image built: $1"
}

if [ -z "$1" ]
  then
    echo "CODEX >>> No arguments supplied, building all docker images"
    for dir in "server" "client"
    do
        build_docker_image $dir
    done
  else
    build_docker_image $1
fi

echo "CODEX >>> Removing dangling docker images"
docker rmi $(docker images -f "dangling=true" -q)

echo "CODEX >>> Displaying docker images with label platform=codex"
docker images --filter "label=platform=codex"