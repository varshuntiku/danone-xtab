from typing import List

from api.controllers.connected_systems.driver_controller import DriverController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.connected_systems.driver_schema import (
    CreateDriverResponseSchema,
    CreateUpdateDriverSchema,
    DriverDataSchema,
    DriverFrontendSchema,
    DriverSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)

driver_controller = DriverController()


@router.get(
    "/{conn_system_dashboard_id}/driver/details",
    status_code=status.HTTP_200_OK,
    response_model=List[DriverFrontendSchema],
)
@authenticate_user
async def get_driver_details(
    request: Request, conn_system_dashboard_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the drivers \n
    """
    return driver_controller.get_driver_details(conn_system_dashboard_id)


@router.get("/{conn_system_dashboard_id}/driver", status_code=status.HTTP_200_OK, response_model=List[DriverSchema])
@authenticate_user
async def get_drivers(
    request: Request, conn_system_dashboard_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the drivers \n
    """
    return driver_controller.get_drivers(conn_system_dashboard_id)


@router.get("/driver/{conn_system_driver_id}", status_code=status.HTTP_200_OK, response_model=DriverDataSchema)
@authenticate_user
async def get_driver(
    request: Request,
    conn_system_driver_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get a driver's details \n
    """
    return driver_controller.get_driver(conn_system_driver_id)


@router.post(
    "/{conn_system_dashboard_id}/driver", status_code=status.HTTP_200_OK, response_model=CreateDriverResponseSchema
)
@authenticate_user
async def create_driver(
    request: Request,
    conn_system_dashboard_id: int,
    request_data: CreateUpdateDriverSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new driver \n
    """
    user_id = request.state.user.id
    return driver_controller.create_driver(user_id, conn_system_dashboard_id, request_data)


@router.put("/driver/{conn_system_driver_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def update_driver(
    request: Request,
    conn_system_driver_id: int,
    request_data: CreateUpdateDriverSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the driver \n
    Example Request Parameters: \n
        {
            "name": "Retail Media"
        }
    """
    user_id = request.state.user.id
    return driver_controller.update_driver(user_id, conn_system_driver_id, request_data)


@router.delete("/driver/{conn_system_driver_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def delete_driver(
    request: Request,
    conn_system_driver_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the driver \n
    """
    user_id = request.state.user.id
    return driver_controller.delete_driver(user_id, conn_system_driver_id)
