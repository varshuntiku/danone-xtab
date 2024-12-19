import base64
from functools import lru_cache
from typing import Any, List, Optional

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    # Add any base settings here
    TOKEN_SECRET_KEY: str = ""
    CRYPTO_ENCRYPTION_KEY: str = b"YRwuXsgJ8_OnxlE63B3YLfqvghSclTYuixpEJm1_YAU="
    DYNAMIC_EXEC_ENV_EXECUTE_URL: str = "https://nuclios-gen-ai-dev.mathco.com/executorservice/execute"
    SQLALCHEMY_DATABASE_URI: str
    POSTGRES_URI: str = ""
    DOCS_URL: str = "/docs"
    INTERNAL_SERVICE_CONNECTION_ENABLED: bool = False
    ROOT_PATH: str = "/"
    AZURE_OAUTH_TENANCY: Optional[str] = None
    AZURE_OAUTH_APPLICATION_ID: Optional[str] = None
    JWT_ALGORITHM: str = "RS256"
    JWT_PRIVATE_KEY_ENCODED: str
    JWT_PUBLIC_KEY_ENCODED: str
    JWT_ENCODE_ISSUER: str
    FAILED_LOGIN_THRESHOLD: str | int = 5
    ACCOUNT_LOCKOUT_DURATION: str | int = 30
    ACCESS_TOKEN_EXPIRE_MINUTES: str | int = 65
    REFRESH_TOKEN_EXPIRE_MINUTES: str | int = 14
    ALLOWED_ORIGINS: str | List[str] = "http://localhost:3000,http://localhost:3001,https://nuclios-ui-dev.mathco.com"
    ALLOWED_METHODS: str | List[str] = ["*"]
    ALLOWED_HEADERS: str | List[str] = ["*"]
    API_VERSION: Optional[str]
    APP_MODE: Optional[str]
    FOLDER_PATH: Optional[str]
    APP_NAME: Optional[str]
    AZURE_FILE_SHARE_CONNECTION_STRING: Optional[str]
    KANIKO_SECRET_KEY_NAME: Optional[str]
    AD_CLIENT_ID: Optional[str]
    AD_CLIENT_SECRET: Optional[str]
    TENANT_ID: Optional[str]
    RESOURCE_GROUP: Optional[str]
    CLUSTER_NAME: Optional[str]
    NODEPOOL_NAME: Optional[str] = "llmpool"
    COPILOT_NODEPOOL_NAME: Optional[str] = ""
    SUBSCRIPTION_ID: Optional[str]
    ACR_URL: Optional[str]
    ACR_NAME: Optional[str]
    ACR_RG: Optional[str]
    DEPLOYMENT_NAMESPACE: Optional[str]
    JPHUB_DEPLOYMENT_NAMESPACE: Optional[str] = "jupyterhub-dev"
    APP_ENV: Optional[str] = "dev"
    INGRESS_SERVER_NAME: Optional[str]
    GATEWAY_BASE_URL: Optional[str]
    CERT_PATH: Optional[str]
    DEBUG: str | bool = False
    DSSTORE_BACKEND_URI: Optional[str] = "https://nuclios-gen-ai-dev.mathco.com/dsstore"
    RUN_PENDING_ENVS: str | bool = False
    COPILOT_SKILLSET_UPDATE_URL: Optional[
        str
    ] = "https://nuclios-minerva-dev.mathco.com/copilot_tool/published-tool/update-status"
    CLIENT_EMAIL_DOMAIN: Optional[str] = "@mathco.com"

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.development"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )

    @model_validator(mode="before")
    @classmethod
    def validate_int_based_fields(cls, values: Any) -> Any:
        # We are updating necessary input data from str to int while validation.
        values["FAILED_LOGIN_THRESHOLD"] = (
            int(values["FAILED_LOGIN_THRESHOLD"])
            if type(values["FAILED_LOGIN_THRESHOLD"]) is not int
            else values["FAILED_LOGIN_THRESHOLD"]
        )
        values["ACCOUNT_LOCKOUT_DURATION"] = (
            int(values["ACCOUNT_LOCKOUT_DURATION"])
            if type(values["ACCOUNT_LOCKOUT_DURATION"]) is not int
            else values["ACCOUNT_LOCKOUT_DURATION"]
        )
        values["ACCESS_TOKEN_EXPIRE_MINUTES"] = (
            int(values["ACCESS_TOKEN_EXPIRE_MINUTES"])
            if type(values["ACCESS_TOKEN_EXPIRE_MINUTES"]) is not int
            else values["ACCESS_TOKEN_EXPIRE_MINUTES"]
        )
        values["REFRESH_TOKEN_EXPIRE_MINUTES"] = (
            int(values["REFRESH_TOKEN_EXPIRE_MINUTES"])
            if type(values["REFRESH_TOKEN_EXPIRE_MINUTES"]) is not int
            else values["REFRESH_TOKEN_EXPIRE_MINUTES"]
        )
        return values

    @model_validator(mode="before")
    @classmethod
    def validate_comma_separation_based_fields(cls, values: Any) -> Any:
        # We are updating necessary input data from str to list(based on ,) while validation.
        values["ALLOWED_ORIGINS"] = values["ALLOWED_ORIGINS"].split(",")
        # values["ALLOWED_METHODS"] = values["ALLOWED_METHODS"].split(",")
        # values["ALLOWED_HEADERS"] = values["ALLOWED_HEADERS"].split(",")
        # values["ALLOWED_ORIGINS"] = ["*"]
        values["ALLOWED_METHODS"] = ["*"]
        values["ALLOWED_HEADERS"] = ["*"]
        return values

    # read private key
    @property
    def get_private_key(self) -> str:
        base64_bytes = self.JWT_PRIVATE_KEY_ENCODED.encode("ascii")
        message_bytes = base64.b64decode(base64_bytes)
        return message_bytes.decode("ascii")

    # read public key
    @property
    def get_public_key(self) -> str:
        base64_bytes = self.JWT_PUBLIC_KEY_ENCODED.encode("ascii")
        message_bytes = base64.b64decode(base64_bytes)
        return message_bytes.decode("ascii")


@lru_cache()
def get_app_settings():
    return AppSettings()
