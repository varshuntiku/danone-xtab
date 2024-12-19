from datetime import datetime
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel


class Filter(BaseModel):
    id: str
    value: str


class ProjectsAjaxListRequestSchema(BaseModel):
    page: int
    pageSize: int
    sorted: List
    filtered: List[Filter]


class ProjectAjaxListSchema(BaseModel):
    id: int
    name: str
    industry: str
    function: str
    problem_area: str
    project_status: str
    assignees: List
    assignees_label: List
    reviewer: str
    casestudy_count: int
    origin: str
    created_by: str
    updated_by: str
    created_at: str
    updated_at: str
    account: str
    user_access: Dict
    pd_version_id: Optional[UUID] = None
    version_updated_at: Optional[datetime] = None


class ProjectsAjaxListResponseSchema(BaseModel):
    data: List[ProjectAjaxListSchema]
    page: int
    pages: int
    count: int


class ProjectsListSchema(BaseModel):
    id: int
    name: str
    industry: str
    function: str
    problem_area: str
    project_status: str
    assignees: List
    assignees_label: List
    reviewer: str
    casestudy_count: int
    origin: str
    created_by: str
    updated_by: str
    created_at: str
    updated_at: str


class UserAccessSchema(BaseModel):
    view: bool
    edit: bool
    delete: bool


class ProjectSchema(BaseModel):
    id: int
    name: str
    industry: str
    project_status: int
    assignees: List
    reviewer: int
    is_instance: bool
    account: str | None
    problem_area: str | None
    origin: str
    created_by: str
    user_access: UserAccessSchema
    content: Optional[Dict] = None
    version_id: Optional[UUID] = None
    version_updated_at: Optional[datetime] = None
    is_current: Optional[bool] = None
    version_name: Optional[str] = None


class CreateProjectRequestSchema(BaseModel):
    id: int
    name: str
    industry: str
    project_status: int = 1
    assignees: Optional[List] = None
    reviewer: int = 1
    account: str = None
    problem_area: str = None
    content: Dict
    origin: str = None
    version_name: str | bool = False


class CreateProjectResponseSchema(BaseModel):
    id: int
    name: str
    version_id: UUID
    version_updated_at: str | None


class GetVersionViewSchema(BaseModel):
    version_id: UUID
    version_name: str
    is_current: bool
    content: Dict
    created_by_user: str
    created_at: float
    updated_by_user: str
    version_updated_at: str | float | None


class ProblemDefinitionSchema(BaseModel):
    version_id: UUID
    version_name: str
    is_current: bool
    created_by_user: str
    created_at: float
    updated_by_user: str


class GetProblemDefinitionVersionResponseSchema(BaseModel):
    data: List[ProblemDefinitionSchema]
    page: int | None
    pages: int | None
    count: int | None
    pageSize: int | None
    hasNext: bool | None

    class config:
        orm_mode = True


class ProjectVersionCreateRequestSchema(BaseModel):
    id: int
    name: str
    industry: str
    project_status: int
    assignees: List
    reviewer: int
    is_instance: bool
    account: str | None
    problem_area: str | None
    origin: str
    created_by: str
    user_access: Dict
    content: Dict = {}
    version_id: UUID
    version_updated_at: str | None
    is_current: bool
    version_name: str
    project_id: int


class CreateVersionResponseSchema(BaseModel):
    message: str
    version_id: UUID


class SetVersionRequestSchema(BaseModel):
    version_id: UUID


class ProjectCreateFolder(BaseModel):
    folder_name: str


class UpdateProjectRequestSchema(BaseModel):
    id: int
    name: str
    industry: str
    project_status: int
    assignees: List
    reviewer: int
    is_instance: bool
    account: str | None
    problem_area: str | None
    origin: str
    created_by: str
    user_access: Dict
    content: Dict = {}
    version_id: UUID
    version_updated_at: datetime | None
    is_current: bool
    version_name: str


class DeleteProjectResponseSchema(BaseModel):
    project_deleted: int


class JupyterHubAccessTokenResponseSchema(BaseModel):
    token: str

    class config:
        orm_mode = True
