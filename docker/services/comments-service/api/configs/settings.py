import base64
from functools import lru_cache
from typing import Any, List

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    # Add any base settings here
    FASTAPI_ENV: str
    SQLALCHEMY_DATABASE_URI: str
    DOCS_URL: str
    REDOC_URL: str
    DATA_AZURE_CONNECTION_STRING: str
    DATA_FOLDER_PATH: str
    AZURE_BLOB_ROOT_URL: str
    AZURE_OAUTH_TENANCY: str
    AZURE_OAUTH_APPLICATION_ID: str
    AZURE_OAUTH_SCOPE: str
    AZURE_OAUTH_CLIENT_SECRET: str
    SHARE_EMAIL_SENDER: str
    SHARE_EMAIL_PWD: str
    API_VERSION: str
    APP_MODE: str
    FOLDER_PATH: str
    APP_NAME: str
    JWT_ALGORITHM: str
    JWT_PUBLIC_KEY_ENCODED: str
    ALLOWED_ORIGINS: str | List[str]
    ALLOWED_METHODS: str | List[str]
    ALLOWED_HEADERS: str | List[str]

    model_config = SettingsConfigDict(
        env_file=(".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    @model_validator(mode="before")
    @classmethod
    def validate_comma_separation_based_fields(cls, values: Any) -> Any:
        # We are updating necessary input data from str to list(based on ,) while validation.
        values["ALLOWED_ORIGINS"] = values["ALLOWED_ORIGINS"].split(",")
        values["ALLOWED_METHODS"] = values["ALLOWED_METHODS"].split(",")
        values["ALLOWED_HEADERS"] = values["ALLOWED_HEADERS"].split(",")
        return values

    # read public key
    @property
    def get_public_key(self) -> str:
        base64_bytes = self.JWT_PUBLIC_KEY_ENCODED.encode("ascii")
        message_bytes = base64.b64decode(base64_bytes)
        return message_bytes.decode("ascii")


@lru_cache()
def get_app_settings():
    return AppSettings()
