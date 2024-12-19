# Codex

## DOCKER commands

```bash
cd docker

### docker build all images
./build_data_services.sh
./build_codex_services.sh

### docker run containers for all above images with dependencies
./run_image.sh

### check docker logs for server
docker logs server

### Test BACKEND and FRONTEND

#### Backed
curl localhost
curl localhost/info

#### Frontend - browser
http://localhost:5000

### docker kill containers
docker-compose down

# docker build individual codex service images
./build_codex_services.sh server
./build_codex_services.sh client
./build_codex_services.sh consumer

# docker build individual data service images
./build_data_services.sh analysis-db
./build_data_services.sh system-db
./build_data_services.sh consumption-db
./build_data_services.sh queue
./build_data_services.sh mlflow

```
