from typing import List

from api.controllers.connected_systems.dashboard_tab_controller import (
    DashboardTabController,
)
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.connected_systems.dashboard_tab_schema import (
    CreateDashboardTabResponseSchema,
    CreateUpdateDashboardTabSchema,
    DashboardTabDataSchema,
    DashboardTabSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)

dashboard_tab_controller = DashboardTabController()


@router.get("/{conn_system_dashboard_id}/tab", status_code=status.HTTP_200_OK, response_model=List[DashboardTabSchema])
@authenticate_user
async def get_dashboard_tabs(
    request: Request, conn_system_dashboard_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the dashboard tabs \n
    """
    return dashboard_tab_controller.get_dashboard_tabs(conn_system_dashboard_id)


@router.get(
    "/tab/{conn_system_dashboard_tab_id}", status_code=status.HTTP_200_OK, response_model=DashboardTabDataSchema
)
@authenticate_user
async def get_dashboard_tab(
    request: Request,
    conn_system_dashboard_tab_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get a dashboard tab's details \n
    """
    return dashboard_tab_controller.get_dashboard_tab(conn_system_dashboard_tab_id)


@router.post(
    "/{conn_system_dashboard_id}/tab", status_code=status.HTTP_200_OK, response_model=CreateDashboardTabResponseSchema
)
@authenticate_user
async def create_dashboard_tab(
    request: Request,
    conn_system_dashboard_id: int,
    request_data: CreateUpdateDashboardTabSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new dashboard tab \n
    """
    user_id = request.state.user.id
    return dashboard_tab_controller.create_dashboard_tab(user_id, conn_system_dashboard_id, request_data)


@router.put("/tab/{conn_system_dashboard_tab_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def update_dashboard_tab(
    request: Request,
    conn_system_dashboard_tab_id: int,
    request_data: CreateUpdateDashboardTabSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the dashboard tab \n
    Example Request Parameters: \n
        {
            "name": "Retail Media"
        }
    """
    user_id = request.state.user.id
    return dashboard_tab_controller.update_dashboard_tab(user_id, conn_system_dashboard_tab_id, request_data)


@router.delete(
    "/tab/{conn_system_dashboard_tab_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema
)
@authenticate_user
async def delete_dashboard_tab(
    request: Request,
    conn_system_dashboard_tab_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the dashboard tab \n
    """
    user_id = request.state.user.id
    return dashboard_tab_controller.delete_dashboard_tab(user_id, conn_system_dashboard_tab_id)
