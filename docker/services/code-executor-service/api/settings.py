import base64
from functools import lru_cache
from typing import Any, List

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# , Optional


class AppSettings(BaseSettings):
    # Add any base settings here
    # TOKEN_SECRET_KEY: str
    # SQLALCHEMY_DATABASE_URI: str
    DOCS_URL: str = "/docs"
    OPENAPI_URL: str = ""
    ROOT_PATH: str = "/"
    # AZURE_STORAGE_CONNECTION_STRING: Optional[str] = None
    # AZURE_BLOB_ROOT_URL: str
    # # BLOB_CONTAINER_NAME: Optional[str] = None
    # AZURE_OAUTH_TENANCY: Optional[str] = None
    # AZURE_OAUTH_APPLICATION_ID: Optional[str] = None
    # AZURE_OAUTH_SCOPE: str
    # AZURE_OAUTH_CLIENT_SECRET: str
    # DYNAMIC_EXEC_ENV_URL: str
    SHARE_EMAIL_SENDER: str = "no-reply@themathcompany.com"
    SHARE_EMAIL_PWD: str = "MathCo^90"
    # CLIENT_HTTP_ORIGIN: str = "http://localhost:3001"
    # SENDGRID_API_KEY: str
    # SENDGRID_EMAIL_SENDER: str
    API_VERSION: str = "0.0.1"
    APP_MODE: str = "dev"
    FOLDER_PATH: str = ""
    APP_NAME: str = "NUCLIOS EXECUTOR"
    JWT_ALGORITHM: str = "RS256"
    # JWT_PRIVATE_KEY_ENCODED: str
    # JWT_PUBLIC_KEY_ENCODED: str
    # JWT_ENCODE_ISSUER: str

    # FAILED_LOGIN_THRESHOLD: str | int
    # ACCOUNT_LOCKOUT_DURATION: str | int  # 30 min
    # ACCESS_TOKEN_EXPIRE_MINUTES: str | int  # 65 minutes
    # REFRESH_TOKEN_EXPIRE_MINUTES: str | int  # 14 days
    ALLOWED_ORIGINS: str | List[
        str
    ] = "http://localhost:3000,http://localhost:3001,http://localhost:3002,https://nuclios-gen-ai-dev.mathco.com"
    ALLOWED_METHODS: str | List[str] = "GET,POST,PUT,DELETE,OPTIONS"
    ALLOWED_HEADERS: str | List[str] = "Content-Type,Authorization"

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.development", "../.env", "../../.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @model_validator(mode="before")
    @classmethod
    def validate_int_based_fields(cls, values: Any) -> Any:
        # We are updating necessary input data from
        # str to int while validation.

        return values

    @model_validator(mode="before")
    @classmethod
    def validate_comma_separation_based_fields(cls, values: Any) -> Any:
        # We are updating necessary input data from str to
        # list(based on ,) while validation.
        values["ALLOWED_ORIGINS"] = values["ALLOWED_ORIGINS"].split(",")
        values["ALLOWED_METHODS"] = values["ALLOWED_METHODS"].split(",")
        values["ALLOWED_HEADERS"] = values["ALLOWED_HEADERS"].split(",")
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
