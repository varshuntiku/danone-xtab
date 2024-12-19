from typing import Annotated, List

from api.controllers.apps.screen_controller import ScreenController
from api.helpers.generic_helpers import GenericHelper
from api.middlewares.auth_middleware import (
    app_publish_required,
    authenticate_user,
    nac_role_info_required,
    platform_user_info_required,
)
from api.schemas import GenericDataResponseSchema, GenericResponseSchema
from api.schemas.apps.screen_schema import (
    CreateAppScreenRequestSchema,
    CreateAppScreenResponseSchema,
    CreateScreenRequestSchema,
    GetLayoutOptionsResponse,
    GetScreensSchema,
    GetSystemWidgetResponseSchema,
    InsertLayoutOptionsRequestResponse,
    SaveUserGuideRequestSchema,
    ScreenOverviewDetailSchema,
    UpdateLayoutOptionsRequestResponse,
    UpdateScreenComment,
    UpdateScreenOverviewRequestSchema,
    UpdateScreenRequestSchema,
    UpdateUserGuideRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Header, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)

screen_controller = ScreenController()
generic_helper = GenericHelper()


@router.get(
    "/app/{app_id}/screens",
    status_code=status.HTTP_200_OK,
    response_model=List,
)
@authenticate_user
async def get_screens(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Generates a list of all the screens and it's info associated with the given app_id. \n
    """
    return screen_controller.get_screens(app_id)


@router.get(
    "/app/{app_id}/screens/{screen_id}/overview",
    status_code=status.HTTP_200_OK,
    response_model=ScreenOverviewDetailSchema,
)
@authenticate_user
async def get_overview_detail(
    request: Request,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get screen overview detail.\n
    """
    return screen_controller.get_overview_detail(app_id, screen_id)


@router.get(
    "/app-admin/app/{app_id}/screens",
    status_code=status.HTTP_200_OK,
    response_model=GetScreensSchema,
)
@authenticate_user
@platform_user_info_required
@app_publish_required
async def get_screen_config(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get app screens \n
    """
    user_id = request.state.user.id
    return screen_controller.get_screen_config(app_id, user_id)


@router.post(
    "/app-admin/app/{app_id}/screens",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
@platform_user_info_required
@app_publish_required
@nac_role_info_required
async def save_screen_config(
    request: Request,
    request_data: CreateScreenRequestSchema,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to save app screen updates \n
    Example Request Parameters: \n
        {
            "screens": [
                {
                    "hidden": false,
                    "id": 1,
                    "level": 0,
                    "name": "existing screen",
                    "screen_index": 0
                },
                {
                    "level": 0,
                    "name": "new screen",
                    "screen_index": 1
                }
            ]
        }
    """
    user_id = request.state.user.id
    return screen_controller.save_screen_config(user_id, app_id, request_data)


@router.post(
    "/app-admin/app/{app_id}/screen/{screen_id}/save-overview",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def save_screen_overview(
    request: Request,
    request_data: UpdateScreenOverviewRequestSchema,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to update app screen overview \n
    Example Request Parameters: \n
        {
            "screen_description":"new description",
            "rating_url": "rating.com",
            "screen_image": "default",
            "screen_auto_refresh": false
        }
    """
    user_id = request.state.user.id
    return screen_controller.save_screen_overview(user_id, app_id, screen_id, request_data)


@router.post(
    "/app-admin/app/{app_id}/screen/{screen_id}/comment-state",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
async def update_comment_state(
    request: Request,
    request_data: UpdateScreenComment,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update app screen overview \n
    Example Request Parameters: \n
        {
            "comment_enabled":true
        }
    """
    user_id = request.state.user.id
    return screen_controller.update_comment_state(user_id, app_id, screen_id, request_data)


@router.post(
    "/app-admin/app/{app_id}/get-system-widgets",
    status_code=status.HTTP_200_OK,
    response_model=GetSystemWidgetResponseSchema,
)
@authenticate_user
async def get_system_widgets(
    request: Request, app_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get lists of available widgets supported by the system, the added app variables and app functions
    """
    return screen_controller.get_system_widgets(app_id)


@router.get(
    "/app-admin/get-system-widget-documentation/{md_file_name}",
    status_code=status.HTTP_200_OK,
    response_model=GenericDataResponseSchema,
)
@authenticate_user
async def get_system_widget_documentation(
    request: Request, md_file_name: str, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get markdown file for a given widget
    """
    path = request.scope.get("root_path")
    return screen_controller.get_system_widget_documentation(path, md_file_name)


@router.get(
    "/{app_id}/layoutOptions",
    status_code=status.HTTP_200_OK,
    response_model=List[GetLayoutOptionsResponse],
)
@authenticate_user
async def get_layout_options(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get layout options \n
    """
    return screen_controller.get_layout_options(app_id)


@router.post("/update_layoutOptions", status_code=status.HTTP_200_OK)
@authenticate_user
async def update_layout_options(
    request: Request,
    request_data: UpdateLayoutOptionsRequestResponse,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update layout options \n
    Example Request Parameters: \n
        {
            "app_id": 1221,
            "layout_options": {
                "graph_height": "5-5",
                "graph_type": "2-2",
                "graph_width": "8-4,4-8",
                "horizontal": true,
                "no_graphs": "4",
                "no_labels": "0"
            }
        }
    """
    response = screen_controller.update_layout_options(request_data)
    return response


@router.put("/update_layoutOptions", status_code=status.HTTP_200_OK)
@authenticate_user
async def insert_layout_options(
    request: Request,
    request_data: InsertLayoutOptionsRequestResponse,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to insert default layout options \n
    Example Request Parameters: \n
        {
            "app_id": 1221
        }
    """
    response = screen_controller.insert_layout_options(request_data)
    return response


from api.configs.settings import get_app_settings

settings = get_app_settings()


@router.get("/screen_overview_images", status_code=status.HTTP_200_OK)
@authenticate_user
async def screen_overview_images(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get layout options \n
    """
    urls = generic_helper.get_blob_list(prefix="screenOverview/")
    return urls


@router.get("/app-admin/app/{app_id}/screen/{screen_id}/user-guide", status_code=status.HTTP_200_OK)
@authenticate_user
async def get_guide(
    request: Request, app_id: int, screen_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get the list of user guides configured for the screen \n
    """
    return screen_controller.get_guide(app_id, screen_id)


@router.post(
    "/app-admin/app/{app_id}/screen/{screen_id}/user-guide",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def save_guide(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: SaveUserGuideRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to save user guide for a screen \n
    Example Request Parameters: \n
    {
        "guide_name": "test",
        "guide_type": "pdf",
        "guide_url": "https://www.google.com/test.pdf"
    }
    """
    return screen_controller.save_guide(app_id, screen_id, request_data)


@router.put(
    "/app-admin/app/{app_id}/screen/{screen_id}/user-guide",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def update_guide(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: UpdateUserGuideRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to update the list of available user guides for the screen \n
    Example Request Parameters: \n
    {
        "data": []
    }
    """
    return screen_controller.update_guide(app_id, screen_id, request_data)


@router.delete(
    "/app/{app_id}/screen/{screen_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def delete_screen(
    request: Request,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete screen \n
    """
    user_id = request.state.user.id
    response = screen_controller.delete_screen(app_id, screen_id, user_id)
    return response


@router.put(
    "/app/{app_id}/screen/{screen_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def update_screen(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: UpdateScreenRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update screen name \n
    Example Request Parameters: \n
        {
            "screen_name": "New Screen Title"
        }
    """
    user_id = request.state.user.id
    response = screen_controller.update_screen(app_id, screen_id, user_id, request_data)
    return response


@router.post(
    "/app/{app_id}/screen",
    status_code=status.HTTP_200_OK,
    response_model=CreateAppScreenResponseSchema,
)
@authenticate_user
async def create_screen(
    request: Request,
    app_id: int,
    request_data: CreateAppScreenRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new screen \n
    Example Request Parameters: \n
        {
            "screen_name": "Screen Title"
        }
    """
    user_id = request.state.user.id
    return await screen_controller.create_screen(app_id, user_id, request_data)
