from enum import Enum
from typing import Any, List, Optional

from api.constants.execution_environment.variables import (
    ExecutionEnvironmentCategory,
    ExecutionEnvironmentType,
    HostingType,
    InfraType,
)
from pydantic import BaseModel, ValidationInfo, field_validator, model_validator


class ExecutionEnvironmentpackageSchema(BaseModel):
    name: str
    version: str

    @model_validator(mode="before")
    @classmethod
    def validate_fields(cls, values: Any) -> Any:
        if not values["version"]:
            raise ValueError("Version should be valid value.")
        return values


class ExecutionEnvironmentCreateSchema(BaseModel):
    name: str
    cloud_provider_id: int = 1
    infra_type: str = InfraType.K8.value
    hosting_type: Optional[str] = HostingType.SHARED.value
    compute_id: Optional[int] = None
    env_type: str = ExecutionEnvironmentType.CUSTOM.value
    run_time: str = "python"
    run_time_version: str = "3.10"
    replicas: int = 1
    packages: List[ExecutionEnvironmentpackageSchema]
    index_url: Optional[str] = None
    env_category: str = ExecutionEnvironmentCategory.UIAC_EXECUTOR.value
    compute_type: str = None
    project_id: int = None

    @model_validator(mode="before")
    @classmethod
    def validate_fields(cls, values: Any) -> Any:
        if values["infra_type"].lower() == InfraType.K8.value:
            if "hosting_type" not in values or values["hosting_type"] is None:
                raise ValueError("Hosting Type for selected Infra Type is required.")
            else:
                if values["hosting_type"].lower() == HostingType.DEDICATED.value:
                    if "compute_id" not in values or values["compute_id"] is None:
                        raise ValueError("compute_id is required for selected Hosting Type.")
        return values

    @field_validator("env_type")
    @classmethod
    def validate_env_type(cls, value: str, info: ValidationInfo) -> str:
        if value not in ExecutionEnvironmentType.list():
            raise ValueError("Please enter valid env_type value.")
        # else:
        #     if value == ExecutionEnvironmentType.DEFAULT.value:
        #         raise ValueError("Selected Execution Type is not available at this time.")
        return value

    class config:
        orm_mode = True


class AppEnvMappingSchema(BaseModel):
    app_id: int
    env_id: int | bool | None

    class Config:
        orm_mode = True


class ExecutionEnvironmentPackagesListValidatorSchema(BaseModel):
    packages: List[ExecutionEnvironmentpackageSchema]
    name: str = ""
    run_time: Optional[str] = "python"
    run_time_version: Optional[str] = "3.10"
    index_url: Optional[str] = None

    class Config:
        orm_mode = True


class ExecutionEnvironmentUpdateSchema(BaseModel):
    name: str
    # cloud_provider_id: int = 1
    # infra_type: Optional[str] = InfraType.K8.value
    # hosting_type: Optional[str] = HostingType.SHARED.value
    # compute_id: Optional[int] = None
    # run_time: Optional[str] = "python"
    # run_time_version: Optional[str] = "3.10"
    # replicas: Optional[int] = 1
    packages: Optional[List[ExecutionEnvironmentpackageSchema]] = None
    index_url: Optional[str] = None
    # @model_validator(mode="before")
    # @classmethod
    # def validate_fields(cls, values: Any) -> Any:
    #     if values["infra_type"].lower() == InfraType.K8.value:
    #         if "hosting_type" not in values or values["hosting_type"] is None:
    #             raise ValueError("Hosting Type for selected Infra Type is required.")
    #         else:
    #             if values["hosting_type"].lower() == HostingType.DEDICATED.value:
    #                 if "compute_id" not in values or values["compute_id"] is None:
    #                     raise ValueError("compute_id is required for selected Hosting Type.")
    #     return values

    class config:
        orm_mode = True


class ExecutionEnvironmentPackagesSchema(BaseModel):
    run_time: str = "python"
    run_time_version: str = "3.10"
    replicas: int = 1
    packages: List[ExecutionEnvironmentpackageSchema]
    index_url: Optional[str] = None


class ExecutionEnvironmentDeploymentSchema(BaseModel):
    name: str
    env_id: int
    uuid: str
    namespace: str


class ExecutionEnvironmentApprovalSchema(BaseModel):
    action_type: str


class ExecutionEnvironmentActions(str, Enum):
    start = "start"
    stop = "stop"
