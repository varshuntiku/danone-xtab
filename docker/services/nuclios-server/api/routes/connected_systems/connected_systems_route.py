from typing import List

from api.controllers.connected_systems.connected_systems_controller import (
    ConnectedSystemController,
)
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.connected_systems.connected_systems_schema import (
    ObjectiveGroupSchema,
    ObjectiveStepSchema,
)
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()

connected_system_controller = ConnectedSystemController()

auth_scheme = HTTPBearer(auto_error=False)

###################################
# Connected System related routes #
###################################


@router.get(
    "/app/{app_id}/objectives",
    status_code=status.HTTP_200_OK,
    response_model=List[ObjectiveGroupSchema],
)
@authenticate_user
async def get_objectives(request: Request, app_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get objectives data for the given app
    """
    return connected_system_controller.get_objectives(app_id)


@router.get(
    "/objectives/{objective_id}/steps",
    status_code=status.HTTP_200_OK,
    response_model=List[ObjectiveStepSchema],
)
@authenticate_user
async def get_objective_steps(
    request: Request, objective_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get objectives steps data for the given objective
    """
    return connected_system_controller.get_objective_steps(objective_id)
