from typing import List

from api.controllers.dashboards.function_controller import FunctionController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.dashboards.function_schema import (
    FunctionCreateRequestSchema,
    FunctionCreateResponseSchema,
    FunctionDeleteResponseSchema,
    FunctionSchema,
)
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)

function_controller = FunctionController()


@router.get("", status_code=status.HTTP_200_OK, response_model=List[FunctionSchema])
@authenticate_user
async def get_functions(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get list of Functions.\n
    """
    return function_controller.get_functions()


@router.post("", status_code=status.HTTP_200_OK, response_model=FunctionCreateResponseSchema)
@authenticate_user
async def create_function(
    request: Request,
    request_data: FunctionCreateRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a new Function.\n

    Example Request Parameters: \n
        {
            "color": null,
            "description": "function description",
            "function_name": "new function",
            "industry_id": 0,
            "level": null,
            "logo_name": "AutomotiveDealershipIcon",
            "order": 0,
            "parent_function_id": null
        }
    """
    user_id = request.state.user.id
    return function_controller.create_function(user_id, request_data)


@router.put(
    "/{function_id}",
    status_code=status.HTTP_200_OK,
    response_model=FunctionCreateResponseSchema,
)
@authenticate_user
async def update_function(
    request: Request,
    function_id: int,
    request_data: FunctionCreateRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update a Function.\n

    Example Request Parameters: \n
        {
            "color": null,
            "description": "updated function description",
            "function_name": "new function",
            "industry_id": 0,
            "level": null,
            "logo_name": "AutomotiveDealershipIcon",
            "order": 0,
            "parent_function_id": null
        }
    """
    user_id = request.state.user.id
    return function_controller.update_function(user_id, function_id, request_data)


@router.delete(
    "/{function_id}",
    status_code=status.HTTP_200_OK,
    response_model=FunctionDeleteResponseSchema,
)
@authenticate_user
async def delete_function(
    request: Request,
    function_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete a Function.\n
    """
    user_id = request.state.user.id
    return function_controller.delete_function(user_id, function_id)
