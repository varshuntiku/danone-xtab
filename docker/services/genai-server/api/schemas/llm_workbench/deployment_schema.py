from typing import Any, Optional

from api.constants.variables import ApprovalStatus, DeploymentType
from pydantic import (
    BaseModel,
    ConfigDict,
    ValidationInfo,
    field_validator,
    model_validator,
)


class LLMDeployedModelCreateSchema(BaseModel):
    base_model_id: int
    name: str
    description: Optional[str] = None
    endpoint: Optional[str] = None
    status: Optional[str] = None
    approval_status: Optional[str] = None
    progress: Optional[int] = None
    experiment_id: Optional[int] = None
    checkpoint_name: Optional[str] = None
    deployment_type: str
    model_params: Optional[dict] = None

    model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))

    @field_validator("deployment_type")
    @classmethod
    def validate_experiment_id_with_type(cls, value: str, info: ValidationInfo) -> str:
        if value == DeploymentType.EXPERIMENT.value and info.data["experiment_id"] is None:
            raise ValueError("experiment_id must be provided with deployment type of experiment")
        elif value == DeploymentType.CHECKPOINT.value and (
            info.data["checkpoint_name"] is None or info.data["experiment_id"] is None
        ):
            raise ValueError("checkpoint_name and experiment id must be provided with deployment type of checkpoint")
        return value

    @model_validator(mode="before")
    @classmethod
    def validate_int_based_fields(cls, values: Any) -> Any:
        # Setting default values based on Deployment Type
        if values["deployment_type"] == DeploymentType.CUSTOM.value:
            values["status"] = "Completed"
            values["approval_status"] = ApprovalStatus.APPROVED.value
            values["progress"] = 100
        return values

    class config:
        orm_mode = True


class LLMDeployedModelUpdateSchema(LLMDeployedModelCreateSchema):
    id: int
    base_model_id: Optional[int] = None
    deployment_type: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def validate_int_based_fields(cls, values: Any) -> Any:
        # Setting default values based on Deployment Type
        if values["deployment_type"] == DeploymentType.CUSTOM.value:
            values["status"] = "Completed"
            values["approval_status"] = ApprovalStatus.APPROVED.value
            values["progress"] = 100
        return values

    class config:
        orm_mode = True


class LLMDeployedModelExecuteSchema(BaseModel):
    id: int
    execution_type: str

    class config:
        orm_mode = True
