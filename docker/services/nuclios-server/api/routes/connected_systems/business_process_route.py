from typing import List

from api.controllers.connected_systems.business_process_controller import (
    BusinessProcessController,
)
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.connected_systems.business_process_schema import (
    BusinessProcessDataSchema,
    BusinessProcessSchema,
    CreateBusinessProcessResponseSchema,
    CreateBusinessProcessSchema,
    CreateBusinessProcessFromTemplateSchema,
    UpdateBusinessProcessSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)

business_process_controller = BusinessProcessController()


@router.get(
    "/{conn_system_dashboard_id}/business-process",
    status_code=status.HTTP_200_OK,
    response_model=List[BusinessProcessSchema],
)
@authenticate_user
async def get_business_processes(
    request: Request, conn_system_dashboard_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the business_processes \n
    """
    return business_process_controller.get_business_processes(conn_system_dashboard_id)


@router.get(
    "/driver/{conn_system_driver_id}/business-process",
    status_code=status.HTTP_200_OK,
    response_model=List[BusinessProcessSchema],
)
@authenticate_user
async def get_business_processes_by_driver(
    request: Request, conn_system_driver_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the business_processes \n
    """
    return business_process_controller.get_business_processes_by_driver(conn_system_driver_id)


@router.get(
    "/business-process/{conn_system_business_process_id}",
    status_code=status.HTTP_200_OK,
    response_model=BusinessProcessDataSchema,
)
@authenticate_user
async def get_business_process(
    request: Request,
    conn_system_business_process_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get a business_process's details \n
    """
    return business_process_controller.get_business_process(conn_system_business_process_id)


@router.post(
    "/driver/{conn_system_driver_id}/business-process",
    status_code=status.HTTP_200_OK,
    response_model=CreateBusinessProcessResponseSchema,
)
@authenticate_user
async def create_business_process(
    request: Request,
    conn_system_driver_id: int,
    request_data: CreateBusinessProcessSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new business_process \n
    """
    user_id = request.state.user.id
    return business_process_controller.create_business_process(user_id, conn_system_driver_id, request_data)


@router.post(
    "/driver/{conn_system_driver_id}/business-process-from-template",
    status_code=status.HTTP_200_OK,
    response_model=CreateBusinessProcessResponseSchema,
)
@authenticate_user
async def create_business_process_from_template(
    request: Request,
    conn_system_driver_id: int,
    request_data: CreateBusinessProcessFromTemplateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new business_process from a template \n
    """
    user_id = request.state.user.id
    return business_process_controller.create_business_process_from_template(user_id, conn_system_driver_id, request_data)


@router.put(
    "/business-process/{conn_system_business_process_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def update_business_process(
    request: Request,
    conn_system_business_process_id: int,
    request_data: UpdateBusinessProcessSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the business_process \n
    Example Request Parameters: \n
        {
            "name": "Retail Media"
        }
    """
    user_id = request.state.user.id
    return business_process_controller.update_business_process(user_id, conn_system_business_process_id, request_data)


@router.delete(
    "/business-process/{conn_system_business_process_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def delete_business_process(
    request: Request,
    conn_system_business_process_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the business_process \n
    """
    user_id = request.state.user.id
    return business_process_controller.delete_business_process(user_id, conn_system_business_process_id)
