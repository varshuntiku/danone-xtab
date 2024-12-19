from typing import List, Optional

from api.controllers.dashboards.dashboard_controller import DashboardController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.dashboards.dashboard_schema import (
    AppsScreensResponseSchema,
    CreateDashboardResponseSchema,
    CreateUpdateDashboardSchema,
    DashboardHierarchyResponseSchema,
    DashboardSchema,
    DashboardTemplateResponseSchema,
    UserAppsHierarchyResponseSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)

dashboard_controller = DashboardController()


@router.get("/dashboards", status_code=status.HTTP_200_OK, response_model=List[DashboardSchema])
@authenticate_user
async def get_dashboards(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get list of all the dashboards \n
    """
    return dashboard_controller.get_dashboards()


@router.post("/dashboard", status_code=status.HTTP_200_OK, response_model=CreateDashboardResponseSchema)
@authenticate_user
async def create_dashboard(
    request: Request,
    request_data: CreateUpdateDashboardSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new dashboard \n
    Example Request Parameters: \n
        {
            "name": "Retail",
            "icon": "retail"
        }
    """
    user_id = request.state.user.id
    return dashboard_controller.create_dashboard(user_id, request_data)


@router.put("/dashboard/{dashboard_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def update_dashboard(
    request: Request,
    dashboard_id: int,
    request_data: CreateUpdateDashboardSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the dashboard \n
    Example Request Parameters: \n
        {
            "name": "Retail Media"
        }
    """
    user_id = request.state.user.id
    return dashboard_controller.update_dashboard(user_id, dashboard_id, request_data)


@router.delete("/dashboard/{dashboard_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def delete_dashboard(
    request: Request,
    dashboard_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the dashboard \n
    """
    user_id = request.state.user.id
    return dashboard_controller.delete_dashboard(user_id, dashboard_id)


@router.get(
    "/dashboard-templates", status_code=status.HTTP_200_OK, response_model=List[DashboardTemplateResponseSchema]
)
@authenticate_user
async def get_dashboard_templates(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get list of all the dashboard templates \n
    """
    return dashboard_controller.get_dashboard_templates()


@router.get(
    "/get-dashboard-details", status_code=status.HTTP_200_OK, response_model=DashboardSchema | MessageResponseSchema
)
@authenticate_user
async def get_dashboard_details(
    request: Request,
    dashboard_id: Optional[int] = None,
    dashboard_url: Optional[str] = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get the dashboard details \n
    """
    return dashboard_controller.get_dashboard_details(dashboard_id, dashboard_url)


@router.get(
    "/dashboard/{dashboard_id}", status_code=status.HTTP_200_OK, response_model=DashboardHierarchyResponseSchema
)
@authenticate_user
async def get_dashboard_hierarchy(
    request: Request,
    dashboard_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get the dashboard hierarchy \n
    """
    return dashboard_controller.get_dashboard_hierarchy(dashboard_id)


@router.get(
    "/get-applications-screens/{function_id}", status_code=status.HTTP_200_OK, response_model=AppsScreensResponseSchema
)
@authenticate_user
async def get_apps_and_screens(
    request: Request,
    function_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get applications and screens for the given function id \n
    """
    return dashboard_controller.get_apps_and_screens(function_id)


@router.get("/user-apps-hierarchy", status_code=status.HTTP_200_OK, response_model=UserAppsHierarchyResponseSchema)
@authenticate_user
async def get_user_apps_hierarchy(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get user apps hierarchy \n
    """
    logged_in_email = request.state.logged_in_email
    return dashboard_controller.get_user_apps_hierarchy(logged_in_email)
