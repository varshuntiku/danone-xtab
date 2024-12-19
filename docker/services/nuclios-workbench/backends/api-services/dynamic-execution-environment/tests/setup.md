# Setting up Tests

## Prerequisities

1. Install Podman: https://podman.io/docs/installation
2. Install Podman-compose using pip: `sudo pip3 install podman-compose`

## Installation

1. [Optional] Create a new Conda environment: `conda create -n <ENVName> python=3.10.9`
2. [Optional] Activate Environment: `conda activate <EnvName>`
3. Install dependencies: `pip install -r requirements-test.txt`
4. Start the test DB server: `sudo podman-compose -f nucliostestdb-compose.yaml up -d`
5. [Optional] You can check the connection with DBeaver or pgAdmin.

## Run tests

1. Run Tests: `./run_tests.sh`
2. Run specific tests with markers: `./run_tests.sh model`
