import base64
from functools import lru_cache
from typing import Any, List, Optional

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    # Add any base settings here
    # Rate limit settings
    REDIS_HOST: str = ""
    REDIS_PASSWORD: str = ""
    RATE_LIMIT_ENABLED: bool = False
    BUCKET_CAPACITY: int = 0  # Maximum number of tokens in the bucket
    FILL_RATE: int = 0  # Tokens added per second
    BLACKLIST_DURATION: int = 0  # Duration in seconds
    FASTAPI_ENV: str
    TOKEN_SECRET_KEY: str
    SQLALCHEMY_DATABASE_URI: str
    # SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    DOCS_URL: str
    REDOC_URL: str
    DATA_AZURE_CONNECTION_STRING: str
    # AZURE_STORAGE_CONNECTION_STRING: str = ""
    DATA_FOLDER_PATH: str
    AZURE_BLOB_ROOT_URL: str
    # BLOB_CONTAINER_NAME: Optional[str] = None
    AZURE_OAUTH_TENANCY: str
    AZURE_OAUTH_APPLICATION_ID: str
    AZURE_OAUTH_SCOPE: str
    AZURE_OAUTH_CLIENT_SECRET: str
    DYNAMIC_EXEC_ENV_URL: str
    SHARE_EMAIL_SENDER: str
    SHARE_EMAIL_PWD: str
    CLIENT_HTTP_ORIGIN: str
    # SENDGRID_API_KEY: str
    # SENDGRID_EMAIL_SENDER: str
    API_VERSION: str
    APP_MODE: str
    FOLDER_PATH: str
    APP_NAME: str
    JWT_ALGORITHM: str
    JWT_PRIVATE_KEY_ENCODED: str
    JWT_PUBLIC_KEY_ENCODED: str
    JWT_ENCODE_ISSUER: str
    NUCLIOS_PRODUCT_ENABLE_SENTRY: bool
    APPINSIGHTS_INSTRUMENTATIONKEY: str
    NUCLIOS_PRODUCT_ENABLE_APP_INSIGHTS: bool
    SENTRY_DSN: str
    # OPTIMUS_API_KEY: Optional[str] = None
    # VECTOR_EMBEDDING_CONNECTION_STRING: Optional[str] = None
    # AZURE_DATABRICKS_PGVECTOR_PIPELINE_TOKEN: Optional[str] = None
    # AZURE_DATABRICKS_PGVECTOR_PIPELINE_JOB_ID: Optional[str] = None
    # AZURE_DATABRICKS_PGVECTOR_PIPELINE_URL: Optional[str] = None
    DATABRICK_INSTANCE_ID: str
    DATABRICK_PAT: str
    DATABRICK_CLUSTER_ID: str
    # DYNAMIC_EXEC_ENV_EXECUTE_URL: str = "http://localhost:8002/codex-exec-api/execute"
    # UNSTRUCTURED_SCHEMA_NAME: Optional[str] = None
    # MINERVA_HOST_URL: Optional[str] = None
    # MINERVA_DOCS_CONTAINER_NAME: Optional[str] = None
    FAILED_LOGIN_THRESHOLD: str | int
    ACCOUNT_LOCKOUT_DURATION: str | int  # 30 min
    ACCESS_TOKEN_EXPIRE_MINUTES: str | int  # 65 minutes
    REFRESH_TOKEN_EXPIRE_MINUTES: str | int  # 14 days
    ALLOWED_ORIGINS: str | List[str]
    ALLOWED_METHODS: str | List[str]
    ALLOWED_HEADERS: str | List[str]
    CHATGPT_OPENAI_BASE_URL: str
    CHATGPT_OPENAI_MODEL: str
    CHATGPT_OPENAI_API_VERSION: str
    CHATGPT_OPENAI_KEY: str
    CRYPTO_ENCRYPTION_KEY: str
    CLIENT_EMAIL_DOMAIN: Optional[str] = "@mathco.com"
    AZURE_FILE_SHARE_CONNECTION_STRING: str = ""
    FILESHARE_NAME: str = ""
    BACKEND_APP_URI: str
    GENAI_SERVER_BASE_URL: str = ""
    SAML_ENCRYPTION_KEY: str
    SESSION_SECRET: str
    DEFAULT_JUPYTERHUB_USER_IMAGE: str = "mathcodex.azurecr.io/jupyterhub-user-default:latest"
    SOCKET_BROKER_URI: str = ""
    SOCKET_MANAGER: str = ""
    KAFKA_SERVERS: str | List[str] = ""
    KAFKA_TOPIC: str = ""
    TABLEAU_BASE_URL: Optional[str] = "https://prod-apnortheast-a.online.tableau.com/api/3.24"

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.development", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
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
        values["ALLOWED_METHODS"] = values["ALLOWED_METHODS"].split(",")
        values["ALLOWED_HEADERS"] = values["ALLOWED_HEADERS"].split(",")
        values["KAFKA_SERVERS"] = values["KAFKA_SERVERS"].split(",") if "KAFKA_SERVERS" in values.keys() else ""
        return values

    @model_validator(mode="before")
    @classmethod
    def transform_crypto_encryption_key(cls, values: Any) -> Any:
        key = values.get("CRYPTO_ENCRYPTION_KEY")
        if 'b"' not in key:
            values["CRYPTO_ENCRYPTION_KEY"] = base64.b64decode(key)
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
