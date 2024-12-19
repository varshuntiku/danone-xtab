from typing import Any, Dict, List, Optional

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
    subscription_type: str | None

    class config:
        orm_mode = True


class CreateAppRequestSchema(BaseModel):
    app_name: Optional[str] = None
    contact_email: Optional[str] = None
    function_id: Optional[int] = None
    industry_id: Optional[int] = None
    top_navbar: Optional[bool] = None
    is_connected_systems_app: Optional[bool] = None
    nac_collaboration: Optional[bool] = None
    env_key: Optional[str] = None
    source_app_id: Optional[int] = None
    project_id: Optional[int] = None

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
    nac_collaboration: bool
    top_navbar: bool

    class config:
        orm_mode = True


class AppOverviewUpdateResponseSchema(BaseModel):
    status: str

    class config:
        orm_mode = True


class AppKpisResponseSchema(BaseModel):
    name: str
    data: Optional[Any] = None
    config: Dict

    class config:
        orm_mode = True


class AppModulesRequestSchema(BaseModel):
    modules: Optional[Dict] = None
    responsibilities: Optional[List] = None


class AppLogoResponseSchema(BaseModel):
    logo_url: str | bool

    class config:
        orm_mode = True


class UserAccessResponseSchema(BaseModel):
    status: str
    special_access_urls: Dict

    class config:
        orm_mode = True


class ApplyThemeRequestSchema(BaseModel):
    theme_id: int | None

    class config:
        orm_mode = True


class UpdateAppDetailsRequestSchema(BaseModel):
    name: Optional[str] = ""
    logo_url: Optional[str] | bool = None
    small_logo_url: Optional[str] | bool = None
    description: Optional[str] | bool = ""
    industry_id: Optional[int] | bool
    function_id: Optional[int] | bool
    blueprint_link: Optional[str] | bool = None
    orderby: Optional[int] = 0
    config_link: Optional[str] | bool = None
    nac_collaboration: Optional[bool] = False
    is_connected_systems_app: Optional[bool] = False

    class config:
        orm_mode = True


class AppSchema(BaseModel):
    id: int
    name: str | None
    description: str | bool | None
    industry: str | None
    function: str | bool | None
    config_link: str | bool | None
    blueprint_link: str | bool | None
    orderby: int | None
    logo_url: str | bool | None
    small_logo_url: str | bool | None
    environment: str | None
    industry_id: int | None
    function_id: int | None
    nac_collaboration: bool | None
    is_connected_systems_app: bool | None

    class config:
        orm_mode = True


class AppResponseSchema(BaseModel):
    data: List[AppSchema]
    page: int | None
    pages: int | None
    count: int | None
    pageSize: int | None
    hasNext: bool | None

    class config:
        orm_mode = True


class UserAppSchema(BaseModel):
    id: int
    name: str
    app_user_id: int

    class config:
        orm_mode = True


class UpdateUserAppsRequestData(BaseModel):
    first_name: str | None  # Check whether all these params are optional
    last_name: str | None
    default_apps: List | None
    user_apps: List | None

    class config:
        orm_mode = True


class UserAppIdsSchema(BaseModel):
    status: str
    app_id: List[int] | int | bool
    landing_url: str

    class config:
        orm_mode = True


class CloneAppSchema(BaseModel):
    app_name: str
    industry: str
    industry_id: int
    function: str
    function_id: int
    contact_email: str | None
    nac_collaboration: Optional[bool] = False
    top_navbar: Optional[bool] = False
    is_connected_systems_app: Optional[bool] = False
    source_app_id: int | None
    user_id: int | None
    project_id: int | None = None
    app_variables: bool | None = False
    app_functions: bool | None = False

    class config:
        orm_mode = True


class CloneAppResponseSchema(BaseModel):
    app_id: int


class ReplicateAppResponseSchema(BaseModel):
    new_app_id: int

    class config:
        orm_mode = True


class ReplicateAppRequestSchema(BaseModel):
    copy_app_vars_flag: bool
    destination_app_env: str | bool | None
    destination_app_id: int | bool | None
    source_app_id: int
    user_id: int

    class config:
        orm_mode = True


class SetupAppRequestSchema(BaseModel):
    project_id: int


class SetupAppResponseSchema(BaseModel):
    status: str
    blueprint_link: str


class GetSimulatorOutputRequestSchema(BaseModel):
    inputs: Any = None
    code: str
    selected_filters: Optional[Any] = None


class ScreenLayoutSchema(BaseModel):
    screen_orientation: str
    sections: int
    section_cells: List[int]

    class config:
        orm_mode = True


class AutoBuildScreenRequestSchema(BaseModel):
    screen_name: str
    widgets: List[Dict]
    layout: Optional[ScreenLayoutSchema] = None
    screen_id: Optional[int] = None

    class config:
        orm_mode = True


class AutoBuildScreenResponseSchema(BaseModel):
    message: str
    url: str | None
    screen_id: int | None
    widget_ids_mapping: Dict | None

    class config:
        orm_mode = True


class AutoUpdateScreenRequestSchema(BaseModel):
    screen_id: int
    widgets: List[Dict]

    class config:
        orm_mode = True


class RearrangeWidgetsRequestSchema(BaseModel):
    widgets: List[Dict]

    class config:
        orm_mode = True


class AutoUpdateScreenResponseSchema(BaseModel):
    message: str
    extra_info: Optional[dict] = None

    class config:
        orm_mode = True


class RearrangeWidgetsResponseSchema(BaseModel):
    message: str
    widgets: List[Dict]

    class config:
        orm_mode = True


class ProgressBarRequestSchema(BaseModel):
    # title: Optional[str] = None
    # stage: int
    message: str
    # status: str
    # total_stages: int
    completed: bool
    # stage_descriptions: Optional[List] = None
    stage_percentage: int
    type: Optional[str] = None


class ProgressBarResponseSchema(BaseModel):
    # stage: int
    message: str
    # status: str
    # total_stages: int
    completed: bool
    # title: str
    # stage_descriptions: List | None
    stage_percentage: int | None
    type: str | None
    screen_id: int
    screen_name: str
    screens: List


class DeleteAppResponseSchema(BaseModel):
    app_deleted: int
