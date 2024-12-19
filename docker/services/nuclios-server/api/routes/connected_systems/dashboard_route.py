from typing import List

from api.controllers.connected_systems.dashboard_controller import DashboardController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.connected_systems.dashboard_schema import (
    CreateDashboardResponseSchema,
    CreateUpdateDashboardSchema,
    DashboardDataSchema,
    DashboardSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)

dashboard_controller = DashboardController()


@router.get("", status_code=status.HTTP_200_OK, response_model=List[DashboardSchema])
@authenticate_user
async def get_dashboards(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get list of all the dashboards \n
    """
    return dashboard_controller.get_dashboards()


@router.get("/active", status_code=status.HTTP_200_OK, response_model=List[DashboardSchema])
@authenticate_user
async def get_active_dashboards(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get list of all the dashboards \n
    """
    return dashboard_controller.get_dashboards(active=True)


@router.get("/{conn_system_dashboard_id}", status_code=status.HTTP_200_OK, response_model=DashboardDataSchema)
@authenticate_user
async def get_dashboard(
    request: Request,
    conn_system_dashboard_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get a dashboard's details \n
    Example Request Parameters: \n
        {
            "name": "Retail",
            "icon": "retail"
        }
    """
    return dashboard_controller.get_dashboard(conn_system_dashboard_id)


@router.post("", status_code=status.HTTP_200_OK, response_model=CreateDashboardResponseSchema)
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


@router.put("/{conn_system_dashboard_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def update_dashboard(
    request: Request,
    conn_system_dashboard_id: int,
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
    return dashboard_controller.update_dashboard(user_id, conn_system_dashboard_id, request_data)


@router.delete("/{conn_system_dashboard_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def delete_dashboard(
    request: Request,
    conn_system_dashboard_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the dashboard \n
    """
    user_id = request.state.user.id
    return dashboard_controller.delete_dashboard(user_id, conn_system_dashboard_id)
