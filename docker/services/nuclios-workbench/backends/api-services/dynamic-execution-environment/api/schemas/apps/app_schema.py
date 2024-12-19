from typing import List, Optional

from pydantic import BaseModel


class AppConfigResponseSchema(BaseModel):
    id: int
    user_id: int | None
    env_apps: List[dict]
    environment: str | None
    name: str | None
    theme_id: int | None
    screens: List[dict]
    modules: dict
    industry: str | None
    function: str | None
    description: str | None
    blueprint_link: str | None
    config_link: str | None
    approach_url: str | bool | None
    logo_url: str | bool | None
    small_logo_url: str | bool | None
    logo_blob_name: str | None
    small_logo_blob_name: str | None
    story_count: int | None
    restricted_app: bool | None
    is_user_admin: bool | None
    permissions: dict | bool | None
    is_app_user: bool | None
    user_mgmt_access: bool | None
    contact_email: str | None
    problem_area: str | None
    industry_id: int | None
    function_id: int | None
    is_connected_systems_app: bool | None

    class config:
        orm_mode = True


class CreateAppRequestSchema(BaseModel):
    app_name: Optional[str] = None
    contact_email: Optional[str] = None
    function_id: Optional[int] = None
    industry_id: Optional[int] = None
    is_connected_systems_app: Optional[bool] = None
    nac_collaboration: Optional[bool] = None
    env_key: Optional[str] = None
    source_app_id: Optional[int] = None

    class config:
        orm_mode = True


class CreateAppResponseSchema(BaseModel):
    status: str
    app_id: int

    class config:
        orm_mode = True


class AppOverviewUpdateRequestSchema(BaseModel):
    app_name: str
    contact_email: str
    logo_blob_name: str | None
    small_logo_blob_name: str
    description: str
    problem_area: str
    industry_id: int
    function_id: int

    class config:
        orm_mode = True


class AppOverviewUpdateResponseSchema(BaseModel):
    status: str

    class config:
        orm_mode = True
