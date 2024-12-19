import json
from typing import Annotated, List

from api.controllers.apps.app_controller import AppController
from api.middlewares.auth_middleware import (
    app_publish_required,
    app_user_info_required,
    authenticate_user,
    nac_role_info_required,
    platform_user_info_required,
    restricted_user_info_required,
)
from api.schemas import GenericResponseSchema
from api.schemas.apps.app_schema import (
    AppConfigResponseSchema,
    AppKpisResponseSchema,
    AppLogoResponseSchema,
    ApplyThemeRequestSchema,
    AppModulesRequestSchema,
    AppOverviewUpdateRequestSchema,
    AppOverviewUpdateResponseSchema,
    AppResponseSchema,
    AutoBuildScreenRequestSchema,
    AutoBuildScreenResponseSchema,
    AutoUpdateScreenRequestSchema,
    AutoUpdateScreenResponseSchema,
    CloneAppResponseSchema,
    CloneAppSchema,
    CreateAppRequestSchema,
    CreateAppResponseSchema,
    DeleteAppResponseSchema,
    GetSimulatorOutputRequestSchema,
    ProgressBarRequestSchema,
    ProgressBarResponseSchema,
    RearrangeWidgetsRequestSchema,
    RearrangeWidgetsResponseSchema,
    ReplicateAppRequestSchema,
    ReplicateAppResponseSchema,
    SetupAppRequestSchema,
    SetupAppResponseSchema,
    UpdateAppDetailsRequestSchema,
    UpdateUserAppsRequestData,
    UserAccessResponseSchema,
    UserAppIdsSchema,
    UserAppSchema,
)
from api.schemas.generic_schema import DataResponseSchema, MessageResponseSchema
from fastapi import APIRouter, Body, Header, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)

app_controller = AppController()


@router.get(
    "/app/user-app",
    status_code=status.HTTP_200_OK,
    response_model=UserAppIdsSchema,
)
@authenticate_user
async def get_user_app_ids(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get the app ids related to the logged in user \n
    """
    logged_in_email = request.state.logged_in_email
    response = app_controller.get_user_app_ids(logged_in_email)
    return response


@router.get(
    "/app/user-access",
    status_code=status.HTTP_200_OK,
    response_model=UserAccessResponseSchema,
)
@authenticate_user
async def get_user_access(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to generate urls to access the apps if the logged in user has special access \n
    """
    return app_controller.get_user_access()


@router.get(
    "/app/{app_id}",
    status_code=status.HTTP_200_OK,
    response_model=AppConfigResponseSchema,
)
@authenticate_user
@app_user_info_required
@platform_user_info_required
@restricted_user_info_required
async def get_app_config(
    request: Request,
    app_id: int,
    codx_app_id: Annotated[str | None, Header(convert_underscores=False)] = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get app config by app id \n
    """
    user_id = request.state.user.id
    app_user = request.state.app_user_info
    platform_user = request.state.platform_user
    return app_controller.get_app_config(app_id, app_user, platform_user, user_id=user_id)


@router.post(
    "/app-admin/app",
    status_code=status.HTTP_200_OK,
    response_model=CreateAppResponseSchema,
)
@authenticate_user
@platform_user_info_required
@app_publish_required
@nac_role_info_required
async def create_app(
    request: Request,
    request_data: Annotated[
        CreateAppRequestSchema,
        Body(
            openapi_examples={
                "Create App": {
                    "summary": "Create a new app",
                    "description": "An **app** create using `Add Application`",
                    "value": {
                        "app_name": "New App",
                        "contact_email": "test@user.com",
                        "function_id": 1,
                        "industry_id": 1,
                        "is_connected_systems_app": False,
                        "nac_collaboration": True,
                    },
                },
                "Create Fresh App": {
                    "summary": "Create a fresh app from existing app",
                    "description": "An **app** created using `Create Fresh Version`",
                    "value": {"env_key": "preview", "source_app_id": 1},
                },
            }
        ),
    ],
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to create new app \n
    Example Request Parameters: \n
        {
            "summary": "Create a new app",
            "description": "An **app** create using `Add Application`",
            "value": {
                "app_name": "New App",
                "contact_email": "test@user.com",
                "function_id": 1,
                "industry_id": 1,
                "is_connected_systems_app": False,
                "nac_collaboration": True,
            },
        }
    """
    user_id = request.state.user.id
    return app_controller.create_app(user_id, request_data)


@router.post(
    "/app-admin/app/{app_id}/overview",
    status_code=status.HTTP_200_OK,
    response_model=AppOverviewUpdateResponseSchema,
)
@authenticate_user
@platform_user_info_required
@app_publish_required
@nac_role_info_required
async def update_app_overview(
    request: Request,
    request_data: AppOverviewUpdateRequestSchema,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to update app overview \n
    Example Request Parameters: \n
        {
            "app_name": "Test_app",
            "contact_email": "user@email.com",
            "logo_blob_name": "",
            "small_logo_blob_name": "",
            "description": "Testing the app update overview",
            "problem_area": "",
            "industry_id": 1,
            "function_id": 1,
        }
    """
    user_id = request.state.user.id
    return app_controller.update_app_overview(user_id, app_id, request_data)


@router.get(
    "/app/{app_id}/kpis",
    status_code=status.HTTP_200_OK,
    response_model=List[AppKpisResponseSchema],
)
@authenticate_user
@platform_user_info_required
async def get_app_kpi_list(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update app kpi list
    """
    access_token = token.credentials
    limit = 5
    return app_controller.get_app_kpi_list(request, access_token, app_id, limit)


@router.patch(
    "/app-admin/app/{app_id}/modules",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
@platform_user_info_required
@app_publish_required
@nac_role_info_required
async def save_app_modules(
    request: Request,
    request_data: AppModulesRequestSchema,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to save module info for a given app \n
    Example Request Parameters: \n
        {
            "modules": {
                "nac_collaboration": true,
                "user_mgmt": false,
                "dashboard": false,
                "fullscreen_mode": false,
                "alerts": false,
                "retain_filters": false,
                "application_manual_url": false,
                "manual_url": null,
                "user_mgmt_app_screen_level": 0,
                "data_story": false,
                "minerva": {
                    "enabled": false,
                    "tenant_id": null
                },
                "user_guide": false,
                "slice": false,
                "copilot": {
                    "app_id": null
                }
            }
        }
    """
    return app_controller.save_app_modules(request_data, app_id)


@router.get(
    "/app/{app_id}/get-logo",
    status_code=status.HTTP_200_OK,
    response_model=AppLogoResponseSchema,
)
async def get_app_logo(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get app logo by app id \n
    """
    return app_controller.get_app_logo(app_id)


@router.post(
    "/app-admin/app/{app_id}/apply-theme",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
@platform_user_info_required
@app_publish_required
@nac_role_info_required
async def apply_app_theme(
    request: Request,
    app_id: int,
    request_data: ApplyThemeRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    Updates app overview.
    Example Request Parameters: \n
        {
            "theme_id": 10
        }
    """
    return app_controller.apply_app_theme(app_id, request_data)


@router.put(
    "/app/{app_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def update_app_details(
    request: Request,
    app_id: int,
    request_data: UpdateAppDetailsRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the app details for the given app id \n
    Example Request Parameters: \n
        {
            "name": "Test_app",
            "logo_url": "",
            "small_logo_url": "",
            "description": "Testing the app update overview",
            "industry_id": 1,
            "function_id": 1,
            "blueprint_link": "",
            "orderby": 0,
            "config_link": "",
            "nac_collaboration": false,
            "is_connected_systems_app": false

        }
    """
    user_id = request.state.user.id
    return app_controller.update_app_details(app_id, user_id, request_data)


@router.get(
    "/applications",
    status_code=status.HTTP_200_OK,
    response_model=AppResponseSchema,
)
@authenticate_user
async def get_apps(
    request: Request,
    page: int = 0,
    pageSize: int = 10,
    filtered: str = "{}",
    project_id: int = 0,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get applications \n
    """
    query_params = {
        "pageSize": pageSize,
        "page": page,
        "filtered": json.loads(filtered),
    }
    if project_id:
        query_params["project_id"] = project_id
    return app_controller.get_apps(query_params)


@router.get(
    "/user-apps/{email_address}",
    status_code=status.HTTP_200_OK,
    response_model=List[UserAppSchema],
    tags=["User Management"],
)
@authenticate_user
async def get_user_apps(
    request: Request,
    email_address: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get the apps related to the given user email address \n
    """
    response = app_controller.get_user_apps(email_address)
    return response


@router.post(
    "/user-apps/{email_address}",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
    tags=["User Management"],
)
@authenticate_user
async def update_user_apps(
    request: Request,
    request_data: UpdateUserAppsRequestData,
    email_address: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the apps related to the given user email address \n
    Example Request Parameters: \n
        {
            "first_name": "John",
            "last_name": "Doe",
            "default_apps": [],
            "user_apps": []
        }
    """
    user_id = request.state.user.id
    response = app_controller.update_user_apps(user_id, email_address, request_data)
    return response


@router.get(
    "/app/{app_id}/export",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
@nac_role_info_required
async def download_app(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to export app
    """
    return app_controller.download_app(app_id)


@router.post("/app/import", status_code=status.HTTP_200_OK, response_model=CloneAppResponseSchema)
@authenticate_user
async def import_app(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to import app
    """
    form = await request.form()
    return await app_controller.import_app(request, form)


@router.post("/app/clone", status_code=status.HTTP_200_OK, response_model=CloneAppResponseSchema)
@authenticate_user
@nac_role_info_required
async def clone_app(
    request: Request,
    request_data: CloneAppSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to clone app
    Example Request Parameters:\n
    {
        "app_name": "app name",
        "industry": "industry name",
        "industry_id": 1234,
        "function": "function name",
        "function_id": 456,
        "contact_email": "user@email.com",
        "nac_collaboration": true,
        "is_connected_systems_app": true,
        "source_app_id": 1221,
        "user_id": 1482
    }
    """
    user_id = request.state.user.id
    return app_controller.clone_app(request_data, user_id)


@router.post(
    "/app/{app_id}/reset",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
@platform_user_info_required
@nac_role_info_required
async def reset_app(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to reset app
    """
    user_id = request.state.user.id
    return app_controller.reset_app(app_id, user_id)


@router.post(
    "/app/replicate",
    status_code=status.HTTP_200_OK,
    response_model=ReplicateAppResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def replicate_app(
    request: Request,
    request_data: ReplicateAppRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to reset app
    Example Request Parameters:\n
    {
        "copy_app_vars_flag": true,
        "destination_app_env": "prod",
        "destination_app_id": false,
        "source_app_id": 1221,
        "user_id": 1482
    }
    """
    user_id = request.state.user.id
    return app_controller.replicate_app(request_data, user_id)


@router.post(
    "/app-admin/{app_id}/setup-app",
    status_code=status.HTTP_200_OK,
    response_model=SetupAppResponseSchema,
)
@authenticate_user
@platform_user_info_required
@app_publish_required
async def setup_app_project(
    request: Request,
    request_data: SetupAppRequestSchema,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Adds the blueprint link to the given app id
    Example Request Parameters. \n
        {
            "project_id": 1
        }
    """
    return app_controller.setup_app_project(request_data, app_id)


@router.put(
    "/app/{app_id}/execute-code",
    status_code=status.HTTP_200_OK,
    response_model=DataResponseSchema,
)
@authenticate_user
@platform_user_info_required
@app_publish_required
async def get_simulator_output(
    request: Request,
    request_data: GetSimulatorOutputRequestSchema,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Returns the simulator ouputs for the given inputs, selected filters and code
    Example Request Parameters. \n
        {
            "inputs": {
                "CCI": {
                    "2020_Q1": 96.91,
                    "2020_Q2": 97.19,
                    "2020_Q3": 96.59,
                    "2020_Q4": 96.53
                },
                "PDI": {
                    "2020_Q1": 365624.3,
                    "2020_Q2": 366412.62,
                    "2020_Q3": 367404.78,
                    "2020_Q4": 369825.5
                },
                "Leading Difference in consecutive lockdowns ": {
                    "2020_Q1": 6,
                    "2020_Q2": 5.66,
                    "2020_Q3": 2.17,
                    "2020_Q4": 5.51
                },
                "Unemployment": {
                    "2020_Q1": 3.48,
                    "2020_Q2": 3.77,
                    "2020_Q3": 3.7,
                    "2020_Q4": 3.76
                },
                "Covid Waves": {
                    "2020_Q1": 0.27,
                    "2020_Q2": 0.16,
                    "2020_Q3": -0.19,
                    "2020_Q4": 0.27
                }
            },
            "code": "<CODE TO BE EXECUTED>",
            "selected_filters": null
        }
    """
    access_token = token.credentials
    user_info = request.state.user_info
    logged_in_email = request.state.logged_in_email
    return app_controller.get_simulator_output(app_id, access_token, user_info, logged_in_email, request_data)


@router.post(
    "/app/{app_id}/auto-build-screen",
    status_code=status.HTTP_200_OK,
    response_model=AutoBuildScreenResponseSchema,
)
@authenticate_user
async def auto_build_screen(request: Request, app_id: int, request_data: AutoBuildScreenRequestSchema):
    """
    Adds screen with layout and widget details \n
    Example Request Parameters \n
        {
            "screen_name": "Dashboard screen",
            "widgets": [],
            "layout": {
                "screen_orientation": "horizontal",
                "sections": 2,
                "section_cells": [
                    3,
                    1
                ]
            }
        }
    """
    user_id = request.state.user.id
    return app_controller.auto_build_screen(app_id, request_data, user_id)


@router.put(
    "/app/{app_id}/auto-update-screen-widgets",
    status_code=status.HTTP_200_OK,
    response_model=AutoUpdateScreenResponseSchema,
)
@authenticate_user
async def auto_update_screen_widgets(request: Request, app_id: int, request_data: AutoUpdateScreenRequestSchema):
    """
    Update screen widgets code and title given the respective app screen widget details \n
    Example Request Parameters \n
        {
            "screen_id": 1,
            "widgets": [{
                "id": 1,
                "widget_id": 2,
                "component_type": "kpi",
                "title": "Revenue",
                "code": "import json",
                "full_code": "import json"
            }]
        }
    """
    user_id = request.state.user.id
    return await app_controller.auto_update_screen_widgets(app_id, request_data, user_id)


@router.put(
    "/app/{app_id}/screen/{screen_id}/rearrange-widgets",
    status_code=status.HTTP_200_OK,
    response_model=RearrangeWidgetsResponseSchema,
)
@authenticate_user
async def update_widget_order(
    request: Request, app_id: int, screen_id: int, request_data: RearrangeWidgetsRequestSchema
):
    """
    Update the order of widgets based on the new widget index provided. \n
    Example Request: \n
    {
        "widgets": [
            {"id": 1, "widget_index": 0},
            {"id": 2, "widget_index": 1},
            {"id": 3, "widget_index": 2}
        ]
    }
    """
    user_id = request.state.user.id
    return app_controller.update_widget_order(app_id, screen_id, user_id, request_data)


@router.get(
    "/app/{app_id}/screen/{screen_id}/progress-bar",
    status_code=status.HTTP_200_OK,
    response_model=ProgressBarResponseSchema,
)
@authenticate_user
async def get_progress_bar(
    request: Request,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    user_id = request.state.user.id
    return app_controller.get_progress_bar(app_id, screen_id, user_id)


@router.post(
    "/app/{app_id}/screen/{screen_id}/progress-bar",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def progress_bar_update(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: ProgressBarRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    user_id = request.state.user.id
    return await app_controller.progress_bar_update(app_id, screen_id, user_id, request_data)


@router.delete(
    "/app/{app_id}",
    status_code=status.HTTP_200_OK,
    response_model=DeleteAppResponseSchema,
)
@authenticate_user
@platform_user_info_required
@app_publish_required
async def delete_app(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Deletes the project info for the given project id.
    """
    user_id = request.state.user.id
    return app_controller.delete_app(app_id, user_id)
