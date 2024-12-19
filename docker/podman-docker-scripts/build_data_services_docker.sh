#!/bin/bash

build_docker_image()
{
  echo "CODEX >>> Starting docker image build: $1"
  cd ./services/$1

  # Docker Registry
  REGISTRY_LINK=mathcodex.azurecr.io

  # Image Name
  IMAGE=codex-$1

  docker build . -t $REGISTRY_LINK/$IMAGE:latest --no-cache

  cd ../..
  echo "CODEX >>> Docker image built: $1"
}

if [ -z "$1" ]
  then
    echo "CODEX >>> No arguments supplied, building all docker images"
    for dir in "python-alpine" "system-db"
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