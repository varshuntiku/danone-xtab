# LLM Configurator Infra Manager

This package providers a wrapper for connecting and interaction with Kubernetes cluster. It exposes interfaces that can used to perform operations on Kubernetes cluster such as node management, pod management etc.

## Setup

1.  Install **[Poetry](https://python-poetry.org/docs/)** for managing dependencies & package build:
    `curl -sSL https://install.python-poetry.org | python3 -`

2.  Verify installation: `poetry --version`

3.  Download the kubernetes **config** file from the following [CoDx Document Library](https://themathcompany.sharepoint.com/sites/CoDxEnvFiles/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FCoDxEnvFiles%2FShared%20Documents%2Flocal%2Fgenai%2Dserver&viewid=a149fd60%2D6ad1%2D44aa%2Da366%2D88f1d07751ea):

4.  Add the _config_ file into infra-manager folder

5.  Install dependencies: `poetry install`

6.  Activate the Python environment: `poetry shell`

7.  Set the Python Path for the package: `export PYTHONPATH=<PATH_TO_infra-manager_PACKAGE>:$PYTHONPATH`

## Build Package

1. To build the package run the following:
   `poetry build`

2. Verify the build in _dist_ folder

## Test Package

To Test the package run the following command
`python -m infra_manager.test`

# test