#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import base64
import os
import pathlib

from pydantic import BaseSettings

# Project Directories
ROOT = pathlib.Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # Add any base settings here
    SQLALCHEMY_DATABASE_URI: str
    SQLALCHEMY_DATABASE_SCHEMA: str = "public"
    DEFAULT_LLM_MODEL_ID: str
    DEFAULT_EMBEDDING_MODEL_ID: str
    DOCS_URL: str = "/docs"
    AZURE_STORAGE_CONNECTION_STRING: str = None
    BLOB_CONTAINER_NAME: str = None
    AZURE_OAUTH_TENANCY: str = None
    AZURE_OAUTH_APPLICATION_ID: str = None
    JWT_ALGORITHM: str = "RS256"
    JWT_PUBLIC_KEY_ENCODED: str
    JWT_PRIVATE_KEY_ENCODED: str = "key"
    JWT_ENCODE_ISSUER: str
    OPTIMUS_API_KEY: str = None
    VECTOR_EMBEDDING_CONNECTION_STRING: str = None
    AZURE_DATABRICKS_PGVECTOR_PIPELINE_TOKEN: str = None
    AZURE_DATABRICKS_PGVECTOR_PIPELINE_JOB_ID: str = None
    AZURE_DATABRICKS_PGVECTOR_PIPELINE_URL: str = None
    UNSTRUCTURED_SCHEMA_NAME: str = None
    MINERVA_HOST_URL: str = None
    MINERVA_DOCS_CONTAINER_NAME: str = None
    COPILOT_CONTAINER_NAME: str = None
    IMAGE_UNSTRUCTURED_CONTAINER_NAME: str = None
    MINERVA_DATABRICKS_CONFIG_CONTAINER_NAME: str = None
    MINERVA_ENVIRONMENT_NAME: str = None
    AZURE_DEVOPS_ORGANIZATION_NAME: str = None
    AZURE_DEVOPS_PROJECT_NAME: str = None
    AZURE_DEVOPS_REPO: str = None
    AZURE_DEVOPS_BRANCH: str = None
    AZURE_DEVOPS_PAT: str = None
    GIT_PROVIDER: str = "AzureDevops"
    DEFAULT_TOOL_PATH: str = "/default_tool"
    DEFAULT_TOOL_PATH_V2: str = "/default_tool_v2"
    TOOL_DEFINITIONS_PATH: str = "/tool_definitions/"
    TOOL_DEPLOYMENTS_PATH: str = "/published_tools/"
    TOOL_DEPLOYMENTS_PATH_V2: str = "/published_tools_v2/"
    MINERVA_APPROVAL_USERS: str = None
    AWS_ACCESS_KEY_ID: str = None
    AWS_SECRET_ACCESS_KEY: str = None
    STORAGE_SERVICE: str = "AZURE_BLOB"
    DEE_ENV_BASE_URL: str = None
    COLOR_THEME: dict = {
        "light": {
            "primary_font_color": "#212121",
            "paper_bg_color": "#f1f1f1",
            "plot_bg_color": "rgba(0,0,0,0)",
            "grid_color": "#B3B3B3",
            "colorway": [
                "#8A8AF2",
                "#65D7C5",
                "#F5956B",
                "#F2D862",
                "#5BBAE5",
                "#BBE673",
                "#de577b",
                "#D3C6F7",
                "#3C90A9",
            ],
            "colorscale": "YlGnBu",
            "sunburst_font_color": "#377eb8",
        },
        "dark": {
            "primary_font_color": "#FFFFFF",
            "paper_bg_color": "rgba(0,0,0,0)",
            "plot_bg_color": "rgba(0,0,0,0)",
            "grid_color": "#B3B3B3",
            "colorway": [
                "#8A8AF2",
                "#65D7C5",
                "#F5956B",
                "#F2D862",
                "#5BBAE5",
                "#BBE673",
                "#de577b",
                "#D3C6F7",
                "#3C90A9",
            ],
            "colorscale": "YlGnBu",
            "sunburst_font_color": "#377eb8",
        },
    }
    CLIENT_EMAIL_DOMAIN: str = "@mathco.com"

    class Config:
        app_env = os.environ.get("ENV", "server")
        if app_env == "development":
            env_file = ".env.development"
        elif app_env == "test":
            env_file = ".env.test"

    # read public key
    @property
    def get_public_key(self) -> str:
        return base64.b64decode(self.JWT_PUBLIC_KEY_ENCODED)


def get_settings():
    return Settings()
