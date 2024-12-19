from typing import List

from api.controllers.connected_systems.business_process_template_controller import (
    BusinessProcessTemplateController,
)
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.connected_systems.business_process_template_schema import (
    BusinessProcessTemplateDataSchema,
    BusinessProcessTemplateSchema,
    CreateBusinessProcessTemplateResponseSchema,
    CreateBusinessProcessTemplateSchema,
    UpdateBusinessProcessTemplateSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)

business_process_template_controller = BusinessProcessTemplateController()


@router.get(
    "/{conn_system_dashboard_id}/business-process-template",
    status_code=status.HTTP_200_OK,
    response_model=List[BusinessProcessTemplateSchema],
)
@authenticate_user
async def get_business_process_templates(
    request: Request, conn_system_dashboard_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the business_process_templates \n
    """
    return business_process_template_controller.get_business_process_templates(conn_system_dashboard_id)


@router.get(
    "/driver/{conn_system_driver_id}/business-process-template",
    status_code=status.HTTP_200_OK,
    response_model=List[BusinessProcessTemplateSchema],
)
@authenticate_user
async def get_business_process_templates_by_driver(
    request: Request, conn_system_driver_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the business_process_templates \n
    """
    return business_process_template_controller.get_business_process_templates_by_driver(conn_system_driver_id)


@router.get(
    "/business-process-template/{conn_system_business_process_template_id}",
    status_code=status.HTTP_200_OK,
    response_model=BusinessProcessTemplateDataSchema,
)
@authenticate_user
async def get_business_process_template(
    request: Request,
    conn_system_business_process_template_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get a business_process_template's details \n
    """
    return business_process_template_controller.get_business_process_template(conn_system_business_process_template_id)


@router.post(
    "/driver/{conn_system_driver_id}/business-process-template",
    status_code=status.HTTP_200_OK,
    response_model=CreateBusinessProcessTemplateResponseSchema,
)
@authenticate_user
async def create_business_process_template(
    request: Request,
    conn_system_driver_id: int,
    request_data: CreateBusinessProcessTemplateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new business_process_template \n
    """
    user_id = request.state.user.id
    return business_process_template_controller.create_business_process_template(
        user_id, conn_system_driver_id, request_data
    )


@router.put(
    "/business-process-template/{conn_system_business_process_template_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def update_business_process_template(
    request: Request,
    conn_system_business_process_template_id: int,
    request_data: UpdateBusinessProcessTemplateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the business_process_template \n
    Example Request Parameters: \n
        {
            "name": "Retail Media"
        }
    """
    user_id = request.state.user.id
    return business_process_template_controller.update_business_process_template(
        user_id, conn_system_business_process_template_id, request_data
    )


@router.delete(
    "/business-process-template/{conn_system_business_process_template_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def delete_business_process_template(
    request: Request,
    conn_system_business_process_template_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the business_process_template \n
    """
    user_id = request.state.user.id
    return business_process_template_controller.delete_business_process_template(
        user_id, conn_system_business_process_template_id
    )
