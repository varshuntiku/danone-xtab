#!/bin/sh
set -ex

push_docker_image()
{
  # SET THE FOLLOWING VARIABLES
  # docker registry
  REGISTRY_LINK=mathcodex.azurecr.io

  # --- PostGreSQL image ---docker
  # image name
  IMAGE=codex-$1

  docker tag $REGISTRY_LINK/$IMAGE:latest $REGISTRY_LINK/$IMAGE:$2
  docker push $REGISTRY_LINK/$IMAGE:$2
  docker push $REGISTRY_LINK/$IMAGE:latest
}

if [ -z "$2" ]
  then
    for dir in "python-alpine" "system-db"
    do
        push_docker_image $dir $1
    done
  else
    push_docker_image $1 $2
fi

docker images --filter "label=platform=codex"