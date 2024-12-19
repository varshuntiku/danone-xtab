from pydantic import BaseModel


class GetDynamicExecutionEnvListSchema(BaseModel):
    id: int
    name: str
    requirements: str
    py_version: str
    status: bool
    created_by: str
    updated_by: str
    created_at: str
    updated_at: str


class GetDynamicExecutionEnvByAppSchema(BaseModel):
    app_id: int
    dynamic_env_id: int | None


class UpdateDynamicExecutionEnvRequestSchema(BaseModel):
    exec_env_id: int
    app_id: int


class UpdateDynamicExecutionEnvResponseSchema(BaseModel):
    app_id: int
    dynamic_env_id: int


class CreateDynamicExecutionEnvRequestSchema(BaseModel):
    name: str
    requirements: str
    py_version: str
    created_by: int


class CreateDynamicExecutionEnvResponseSchema(BaseModel):
    id: int
    name: str


class UpdateDynamicExecEnvDetailRequestSchema(BaseModel):
    id: int
    name: str
    requirements: str
    py_version: str


class DefaultExecutionEnvSchema(BaseModel):
    requirements: str
    py_version: str
