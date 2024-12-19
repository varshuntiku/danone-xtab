from typing import Dict, List

from api.controllers.dashboards.industry_controller import IndustryController
from api.middlewares.auth_middleware import (
    authenticate_user,
    platform_user_info_required,
)
from api.schemas.dashboards.dashboard_schema import DashboardSchema
from api.schemas.dashboards.function_schema import FunctionSchema
from api.schemas.dashboards.industry_schema import (
    GetAppByIndustryResponseSchema,
    IndustryCreateRequestSchema,
    IndustryCreateResponseSchema,
    IndustrySchema,
)
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)

industry_controller = IndustryController()


@router.get("", status_code=status.HTTP_200_OK, response_model=List[IndustrySchema])
@authenticate_user
async def get_industries(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get list of Industries.\n
    """
    return industry_controller.get_industries()


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=IndustryCreateResponseSchema,
)
@authenticate_user
async def create_industries(
    request: Request,
    request_data: IndustryCreateRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Industries.\n

    Example Request Parameters: \n
        {
            "industry_name": "test industry",
            "parent_industry_id": "",
            "logo_name": "CPG",
            "horizon": "vertical",
            "order": 2,
            "level": "",
            "color": "",
            "description": "industry description"
        }
    """
    user_id = request.state.user.id
    return industry_controller.create_industry(user_id, request_data)


@router.put(
    "/{industry_id}",
    status_code=status.HTTP_200_OK,
    response_model=IndustryCreateResponseSchema,
)
@authenticate_user
async def update_industries(
    request: Request,
    industry_id: int,
    request_data: IndustryCreateRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update Industries.\n

    Example Request Parameters: \n
        {
            "industry_name": "test industry",
            "parent_industry_id": "",
            "logo_name": "CPG",
            "horizon": "vertical",
            "order": 2,
            "level": "",
            "color": "",
            "description": "industry description"
        }
    """
    user_id = request.state.user.id
    return industry_controller.update_industry(user_id, industry_id, request_data)


@router.delete("/{industry_id}", status_code=status.HTTP_200_OK)
@authenticate_user
async def delete_industries(
    request: Request,
    industry_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete Industries.\n
    """
    user_id = request.state.user.id
    return industry_controller.delete_industry(user_id, industry_id)


@router.get("/{industry_id}/dashboard", status_code=status.HTTP_200_OK, response_model=DashboardSchema | Dict)
@authenticate_user
async def get_dashboard_by_industry_id(
    request: Request, industry_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get dasboard by industry_id \n
    """
    return industry_controller.get_dashboard_by_industry_id(industry_id)


@router.get("/{industry}/apps", status_code=status.HTTP_200_OK, response_model=List[GetAppByIndustryResponseSchema])
@authenticate_user
@platform_user_info_required
async def get_apps_by_industry_id(
    request: Request, industry: str, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get apps by industry \n
    """
    return industry_controller.get_apps_by_industry_id(request, industry)


@router.get("/{industry_id}/function", status_code=status.HTTP_200_OK, response_model=List[FunctionSchema])
@authenticate_user
async def get_functions(
    request: Request, industry_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of industry specific functions \n
    """
    return industry_controller.get_functions(industry_id)
