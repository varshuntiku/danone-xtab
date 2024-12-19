from typing import Annotated, Dict, List

from api.controllers.apps.widget_controller import WidgetController
from api.middlewares.auth_middleware import (
    app_user_info_required,
    authenticate_user,
    nac_role_info_required,
)
from api.middlewares.uiac_middleware import validate_uiac
from api.schemas.apps.widget_schema import (
    GeneralWidgetResponseSchema,
    GetArchivedUiacListResponseSchema,
    GetMultiWidgetRequestSchema,
    GetMultiWidgetResponseSchema,
    GetWidgetRequestSchema,
    GetWidgetResponseSchema,
    GetWidgetUiacResponseSchema,
    SaveWidgetConfigRequestSchema,
    SaveWidgetRequestSchema,
    SaveWidgetResponseSchema,
    SaveWidgetUiacRequestSchema,
    TestWidgetVisualizationRequestSchema,
    TestWidgetVisualizationResponseSchema,
    UpdateWidgetConnSystemIdentifierRequestSchema,
    WidgetResponseSchema,
)
from api.schemas.generic_schema import StatusDataResponseSchema
from fastapi import APIRouter, Header, Request, Response, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()

widget_controller = WidgetController()

auth_scheme = HTTPBearer(auto_error=False)


##############################
# Widget related routes #
##############################


@router.get(
    "/app/{app_id}/screens/{screen_id}/widgets",
    status_code=status.HTTP_200_OK,
    response_model=List[WidgetResponseSchema],
)
@authenticate_user
async def get_widgets(
    request: Request,
    app_id: int,
    screen_id: int,
    response: Response,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get list of all the widgets' details associated to given app and screen
    """
    response = widget_controller.get_widgets(app_id, screen_id, response)
    return response


@router.post(
    "/app-admin/app/{app_id}/screen/{screen_id}/save-screen-widgets",
    status_code=status.HTTP_200_OK,
    response_model=SaveWidgetResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def save_widgets(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: SaveWidgetRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to save screen widgets layout \n
    Example Request Parameters: \n
        {
            "selected_layout": {
                "no_labels": 0,
                "no_graphs": 1
            },
            "widgets": [
                {
                "id": "new_0",
                "is_label": false,
                "widget_index": 0,
                "config": {
                    "title": "",
                    "sub_title": "",
                    "prefix": "",
                    "metric_factor": "",
                    "code": ""
                }
                }
            ]
        }
    """
    user_id = request.state.user.id
    response = widget_controller.save_widgets(user_id, app_id, screen_id, request_data)
    return response


@router.post(
    "/app-admin/app/{app_id}/screen/{screen_id}/widget/{widget_id}/config",
    status_code=status.HTTP_200_OK,
    response_model=GeneralWidgetResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def save_widget_config(
    request: Request,
    app_id: int,
    screen_id: int,
    widget_id: int,
    request_data: SaveWidgetConfigRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to update the widget config \n
    Example Request Parameters: \n
        {
            "config": {
                "title": "Insights",
                "sub_title": "",
                "prefix": "",
                "metric_factor": "",
                "code": ""
            }
        }
    """
    user_id = request.state.user.id
    response = widget_controller.save_widget_config(user_id, widget_id, request_data)
    return response


@router.post(
    "/app-admin/app/{app_id}/test-visualization",
    status_code=status.HTTP_200_OK,
    response_model=TestWidgetVisualizationResponseSchema,
)
@authenticate_user
async def test_visualization(
    request: Request,
    app_id: int,
    request_data: TestWidgetVisualizationRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to test dynamic visualization of given code string \n
    Example Request Parameters: \n
        {
            "filters": {},
            "code": "from codex_widget_factory_lite.visuals.insights import Insights"
        }
    """
    response = widget_controller.test_visualization(app_id, request_data, request)
    return response


@router.post(
    "/app-admin/app/{app_id}/screen/{screen_id}/widget/{widget_id}/uiac",
    status_code=status.HTTP_200_OK,
    response_model=GeneralWidgetResponseSchema,
)
@authenticate_user
@validate_uiac
@nac_role_info_required
async def save_widget_uiac(
    request: Request,
    app_id: int,
    screen_id: int,
    widget_id: int,
    request_data: SaveWidgetUiacRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to save the widget uiac \n
    Example Request Parameters: \n
        {
            code: "from codex_widget_factory_lite.visuals.insights import Insights"
        }
    """
    user_id = request.state.user.id
    response = widget_controller.save_widget_uiac(user_id, app_id, screen_id, widget_id, request_data)
    return response


@router.get(
    "/app-admin/app/{app_id}/archived-uiac/list",
    status_code=status.HTTP_200_OK,
    response_model=List[GetArchivedUiacListResponseSchema],
)
@authenticate_user
async def get_archived_uiacs(
    request: Request, app_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get lost UIaC's for a project
    """
    return widget_controller.get_archived_uiacs(app_id)


@router.put(
    "/app/{app_id}/screens/{screen_id}/multi-widget",
    status_code=status.HTTP_200_OK,
    response_model=GetMultiWidgetResponseSchema,
)
@authenticate_user
@app_user_info_required
async def get_multi_widget(
    request: Request,
    request_data: GetMultiWidgetRequestSchema,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to fetch the app screen widget details for given app and screen id
    """
    access_token = token.credentials
    return await widget_controller.get_multi_widget(app_id, screen_id, access_token, request_data, request)


@router.put(
    "/app/{app_id}/screens/{screen_id}/widget",
    status_code=status.HTTP_200_OK,
    response_model=GetWidgetResponseSchema,
)
@authenticate_user
@app_user_info_required
async def get_widget(
    request: Request,
    request_data: GetWidgetRequestSchema,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to fetch the app screen widget details for given app and screen id
    """
    access_token = token.credentials
    user = request.state.user
    return await widget_controller.get_widget(app_id, screen_id, access_token, request_data, user, request)


@router.get(
    "/app/{app_id}/screen/{screen_id}/widget/{widget_id}/uiac",
    status_code=status.HTTP_200_OK,
    response_model=GetWidgetUiacResponseSchema | Dict,
)
@authenticate_user
@app_user_info_required
async def get_widget_uiac(
    request: Request,
    app_id: int,
    screen_id: int,
    widget_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get the app screen widget uiac code \n
    """
    response = widget_controller.get_widget_uiac(app_id, screen_id, widget_id)
    return response


@router.get(
    "/app-admin/app/{app_id}/screen/{screen_id}/widget/{widget_id}",
    status_code=status.HTTP_200_OK,
    response_model=StatusDataResponseSchema,
)
@authenticate_user
@app_user_info_required
async def get_screen_widget(
    request: Request,
    app_id: int,
    screen_id: int,
    widget_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to fetch widget.
    """
    response = widget_controller.get_screen_widget(app_id, screen_id, widget_id)
    return response


@router.put(
    "/app/{app_id}/screen/{widget_id}",
    status_code=status.HTTP_200_OK,
    response_model=Dict,
)
@authenticate_user
async def update_widget_conn_systems_identifier(
    request: Request,
    request_data: UpdateWidgetConnSystemIdentifierRequestSchema,
    app_id: int,
    widget_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Update widget connected system identifier.
    Example Request Parameters:
        {
            "0": {
                "id": 4,
                "dashboard_id": 2,
                "business_process_id": 1,
                "problem_definition_id": 2,
                "is_active": true
            },
            "1": {
                "dashboard_id": 2,
                "business_process_id": 3,
                "problem_definition_id": 2,
                "app_id": 26,
                "widget_id": 484,
                "id": 5
            }
        }
    """
    return widget_controller.update_widget_conn_systems_identifier(app_id, widget_id, request_data)


@router.post(
    "/app/{app_id}/screens/{screen_id}/widgets/{widget_id}/dynamic-widget-filters",
    status_code=status.HTTP_200_OK,
    response_model=Dict | bool,
)
@authenticate_user
@validate_uiac
async def get_dynamic_widget_filters(
    request: Request,
    app_id: int,
    screen_id: int,
    widget_id: int,
    request_data: dict,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get widget dynamic filters
    """
    response = widget_controller.get_widget_dynamic_filters(
        request=request, token=token, app_id=app_id, screen_id=screen_id, widget_id=widget_id, request_data=request_data
    )
    return response
