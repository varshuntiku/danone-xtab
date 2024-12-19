from typing import List

from api.controllers.connected_systems.initiative_controller import InitiativeController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.connected_systems.initiative_schema import (
    CreateInitiativeResponseSchema,
    CreateInitiativeSchema,
    InitiativeDataSchema,
    InitiativeSchema,
    UpdateInitiativeSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)

initiative_controller = InitiativeController()


@router.get(
    "/{conn_system_dashboard_id}/initiative", status_code=status.HTTP_200_OK, response_model=List[InitiativeSchema]
)
@authenticate_user
async def get_initiatives(
    request: Request, conn_system_dashboard_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get list of all the initiatives \n
    """
    return initiative_controller.get_initiatives(conn_system_dashboard_id)


@router.get(
    "/initiative/{conn_system_initiative_id}", status_code=status.HTTP_200_OK, response_model=InitiativeDataSchema
)
@authenticate_user
async def get_initiative(
    request: Request,
    conn_system_initiative_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get a initiative's details \n
    """
    return initiative_controller.get_initiative(conn_system_initiative_id)


@router.post(
    "/goal/{conn_system_goal_id}/initiative",
    status_code=status.HTTP_200_OK,
    response_model=CreateInitiativeResponseSchema,
)
@authenticate_user
async def create_initiative(
    request: Request,
    conn_system_goal_id: int,
    request_data: CreateInitiativeSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new initiative \n
    """
    user_id = request.state.user.id
    return initiative_controller.create_initiative(user_id, conn_system_goal_id, request_data)


@router.put(
    "/initiative/{conn_system_initiative_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema
)
@authenticate_user
async def update_initiative(
    request: Request,
    conn_system_initiative_id: int,
    request_data: UpdateInitiativeSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the initiative \n
    Example Request Parameters: \n
        {
            "name": "Retail Media"
        }
    """
    user_id = request.state.user.id
    return initiative_controller.update_initiative(user_id, conn_system_initiative_id, request_data)


@router.delete(
    "/initiative/{conn_system_initiative_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema
)
@authenticate_user
async def delete_initiative(
    request: Request,
    conn_system_initiative_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the initiative \n
    """
    user_id = request.state.user.id
    return initiative_controller.delete_initiative(user_id, conn_system_initiative_id)
