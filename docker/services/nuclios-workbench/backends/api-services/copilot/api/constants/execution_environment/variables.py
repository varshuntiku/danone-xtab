from enum import Enum


class InfraType(Enum):
    APPSERVICE = "appservice"
    K8 = "k8"
    VM = "vm"
    ACI = "aci"
    ACA = "aca"
    EBS = "ebs"


class HostingType(Enum):
    DEDICATED = "dedicated"
    SHARED = "shared"


class ExecutionEnvironmentType(Enum):
    DEFAULT = "default"
    CUSTOM = "custom"

    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))


class ExecutionEnvironmentCategory(Enum):
    UIAC_EXECUTOR = "uiac_executor"
    DS_WORKBENCH = "ds_workbench"

    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))


class ExecutionEnvironmentServiceType(Enum):
    CODE_EXECUTOR_SERVICE = "code-executor-service"
    JUPYTERHUB_USER_SERVICE = "jupyterhub-user-service"


class ExecutionEnvironmentCategoryServiceMapping(Enum):
    UIAC_EXECUTOR = ExecutionEnvironmentServiceType.CODE_EXECUTOR_SERVICE.value
    DS_WORKBENCH = ExecutionEnvironmentServiceType.JUPYTERHUB_USER_SERVICE.value


class ExecutionEnvironmentComputeType(Enum):
    SHARED = "shared"
    DEDICATED = "dedicated"

    @classmethod
    def list(cls):
        return list(map(lambda c: c.value, cls))


class SolutionBlueprintShareName(Enum):
    GOLDEN_SHARENAME = "solution-bp-repository"


class SolutionBlueprintType(Enum):
    GOLDEN = "golden-bps"
    DEFAULT = "default-bp"


CORE_PACKAGES = {
    "fastapi": "0.103.2",
    "pydantic": "2.4.2",
    "uvicorn": "0.23.2",
    "uvloop": "0.19.0",
    "pydantic-settings": "2.0.3",
    "https://stcodxllm.blob.core.windows.net/dsstore-builds/dsstore-0.5.8-py3-none-any.whl?sp=r&st=2024-08-22T05:20:11Z&se=2028-08-22T13:20:11Z&spr=https&sv=2022-11-02&sr=b&sig=NCgXRjOZWwh4E48QMDWDM21kALpH%2B2pFD5Yh3E77iMg%3D": "custom_package_url",
}


CORE_PACKAGES_DS_WORKBENCH = {
    "https://stcodxllm.blob.core.windows.net/dsstore-builds/dsstore-0.5.9-py3-none-any.whl?sp=r&st=2024-08-22T05:28:06Z&se=2028-08-22T13:28:06Z&spr=https&sv=2022-11-02&sr=b&sig=SYatentDCJ6Qbzd05Q2mTotSfuecKdaDvaod5HlWgeQ%3D": "custom_package_url",
}


DEFAULT_DEPENDENCIES = {
    "alembic": "1.13.1",
    "azure-storage-blob": "1.4.0",
    "azure-storage-file-share": "12.15.0",
    "boto3": "1.28.78",
    "dask": "2022.1.1",
    "dnspython": "2.2.1",
    "fastapi": "0.103.2",
    "gmaps": "0.9.0",
    "google-api-core": "2.17.0",
    "google-auth": "2.27.0",
    "html-sanitizer": "2.2.0",
    "httpcore": "1.0.2",
    "httpx": "0.25.2",
    "json5": "0.9.14",
    "kaleido": "0.2.1",
    "matplotlib": "3.8.2",
    "millify": "0.1.1",
    "mistune": "0.8.4",
    "msal": "1.26.0",
    "msrest": "0.7.1",
    "msrestazure": "0.6.4",
    "natsort": "8.4.0",
    "networkx": "3.1",
    "notebook-shim": "0.2.3",
    "numpy": "1.24.2",
    "openai": "1.3.4",
    "opencensus-ext-azure": "1.1.9",
    "opencv-python-headless": "4.7.0.72",
    "openpyxl": "3.0.7",
    "pandas": "1.5.3",
    "parquet": "1.3.1",
    "plotly": "5.8.0",
    "prometheus-client": "0.19.0",
    "psycopg2-binary": "2.9.5",
    "pyarrow": "7.0.0",
    "pycountry": "22.3.5",
    "pydantic": "2.4.2",
    "pydantic-settings": "2.0.3",
    "PyJWT": "2.7.0",
    "pymongo": "4.3.3",
    "pyodbc": "4.0.39",
    "python-dotenv": "1.0.0",
    "python-jose": "3.3.0",
    "scikit-learn": "1.2.1",
    "scipy": "1.10.1",
    "sendgrid": "6.9.7",
    "snowflake-connector-python": "2.7.6",
    "SQLAlchemy": "1.4.46",
    "starlette": "0.27.0",
    "statsmodels": "0.13.5",
    "uvicorn": "0.23.2",
    "Werkzeug": "2.0.3",
    "wordcloud": "1.9.2",
    "xlrd": "2.0.1",
}
