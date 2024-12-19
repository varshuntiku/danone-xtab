from typing import Optional

from pydantic import BaseModel, root_validator


class LLMDeployedModelMetaData(BaseModel):
    id: int
    name: str
    description: str | None = None
    model_id: int
    model_name: str | None = None
    model_type: str | None = None
    deployment_type: str | None = None
    source: str | None = None
    status: Optional[str] = None
    progress: Optional[int] = None
    approval_status: Optional[str] = None
    is_active: Optional[bool] = None


class LLMDeployedModelResponse(LLMDeployedModelMetaData):
    model_params: dict
    endpoint: str


class LLMDeployedModelCreatePayload(BaseModel):
    name: str
    model_id: int
    endpoint: str
    description: Optional[str] = None
    model_params: dict = {}


class LLMDeployedModelUpdatePayload(BaseModel):
    name: Optional[str]
    model_id: Optional[int]
    endpoint: Optional[str]
    description: Optional[str]
    model_params: Optional[dict]

    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("one of industry, organization, description, personas or copilot_config must have a value")
        return v


class LLMModelInfo(LLMDeployedModelMetaData):
    endpoint: Optional[str]
    model_params: Optional[dict]
    type: str | None
