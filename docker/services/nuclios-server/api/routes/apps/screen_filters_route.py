from typing import Annotated, Dict, List

from api.controllers.apps.screen_filters_controller import ScreenFiltersController
from api.middlewares.auth_middleware import (
    app_user_info_required,
    authenticate_user,
    nac_role_info_required,
)
from api.middlewares.uiac_middleware import validate_uiac
from api.schemas import GenericResponseSchema
from api.schemas.apps.screen_filters_schema import (
    FiltersResponseSchema,
    GetArchivedFilterUIACListResponseSchema,
    PreviewScreenFiltersRequestSchema,
    SaveScreenFiltersRequestSchema,
    ScreenFiltersResponseSchema,
    TestScreenFiltersRequestSchema,
    TestScreenFiltersResponseSchema,
)
from fastapi import APIRouter, Header, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()

screen_filters_controller = ScreenFiltersController()

auth_scheme = HTTPBearer(auto_error=False)


#####################################
# App screen filters related routes #
#####################################


@router.get(
    "/app/{app_id}/screen/{screen_id}/filter/uiac",
    status_code=status.HTTP_200_OK,
    response_model=ScreenFiltersResponseSchema,
)
@authenticate_user
@app_user_info_required
async def get_screen_filters(
    request: Request,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to fetch the screen filters code strings
    """
    response = screen_filters_controller.get_screen_filters(app_id, screen_id)
    return response


@router.post(
    "/app-admin/app/{app_id}/screen/{screen_id}/save-filters",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
@validate_uiac
@nac_role_info_required
async def save_filters_code(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: SaveScreenFiltersRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to save filter uiac
    """
    user_id = request.state.user.id
    response = screen_filters_controller.save_filters_code(user_id, app_id, screen_id, request_data)
    return response


@router.post(
    "/app-admin/app/{app_id}/test-filters",
    status_code=status.HTTP_200_OK,
    response_model=TestScreenFiltersResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def test_filters(
    request: Request,
    app_id: int,
    request_data: TestScreenFiltersRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to test filter uiac
    """
    response = screen_filters_controller.test_filters(request, token, app_id, request_data)
    return response


@router.post("/app-admin/app/{app_id}/preview-filters", status_code=status.HTTP_200_OK, response_model=Dict | bool)
@authenticate_user
@validate_uiac
async def preview_filters(
    request: Request,
    app_id: int,
    request_data: PreviewScreenFiltersRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to preview filter uiac
    """
    response = screen_filters_controller.preview_filters(request, token, app_id, request_data)
    return response


@router.post(
    "/app/{app_id}/screens/{screen_id}/dynamic-filters",
    status_code=status.HTTP_200_OK,
    response_model=Dict | bool,
)
@authenticate_user
@validate_uiac
async def get_dynamic_filters(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: dict,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get dynamic filters
    """
    access_token = token.credentials
    response = screen_filters_controller.get_dynamic_filters(request, access_token, app_id, screen_id, request_data)
    return response


@router.get(
    "/app-admin/app/{app_id}/archived-filter-uiac/list",
    status_code=status.HTTP_200_OK,
    response_model=List[GetArchivedFilterUIACListResponseSchema],
)
@authenticate_user
async def get_archived_filter_uiacs(
    request: Request, app_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of archived filter uiac for specific app which are not older than 60 days
    """
    return screen_filters_controller.get_archived_filter_uiacs(app_id)


@router.get(
    "/app/{app_id}/screens/{screen_id}/filters",
    status_code=status.HTTP_200_OK,
    response_model=FiltersResponseSchema,
)
@authenticate_user
async def get_filters(
    request: Request,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Generates a list of all the filters with their values and topics for the given app and screen id .\n
    """
    return screen_filters_controller.get_filters(app_id, screen_id)
