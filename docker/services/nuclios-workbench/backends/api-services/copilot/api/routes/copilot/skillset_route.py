import json

from api.controllers.copilot import skillset_controller

# from api.middlewares.auth_middleware import authenticate_user, super_user_required
from api.schemas.copilot import skillset_schema
from api.serializers.copilot import skillset_serializer

# from fastapi import APIRouter, Request, Security, status
from fastapi import APIRouter, Request, status

# from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.security import HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
skillset_controller = skillset_controller.SkillsetController()


# @router.get(
#     "/{id}/stream-status",
#     status_code=status.HTTP_200_OK,
# )
# @authenticate_user
# async def get_skillset_live_status(
#     request: Request,
#     id: int,
#     token: HTTPAuthorizationCredentials = Security(auth_scheme),
# ):
#     """
#     API will stream the live status of a execution environment from the server.\n
#     Will take url parameters as execution environment id parameter.
#     """
#     user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
#     return await skillset_controller.get_skillset_live_status(user, id)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=skillset_serializer.SkillsetCreateSerializer,
)
# @authenticate_user
# @super_user_required
async def create_skillset(
    request: Request,
    request_data: skillset_schema.ExecutionEnvironmentCreateSchema,
    # token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Finetuned Model(Experiments).\n
    """
    request_data = json.loads(
        json.dumps(request_data, default=lambda o: o.__dict__)
    )  # Converting to dict to decouple controller from pydantic model
    user = {}
    # request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await skillset_controller.create_skillset(user, request_data)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
# @authenticate_user
# @super_user_required
async def delete_skillset(
    request: Request,
    id: int,
    # token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Finetuned Model(Experiments).\n
    """
    user = {}
    # request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await skillset_controller.delete_skillset(user, id)


@router.post(
    "/{id}/{action}",
    status_code=status.HTTP_204_NO_CONTENT,
)
# @authenticate_user
async def action_on_execution_environment(
    request: Request,
    id: int,
    action: skillset_schema.EnvironmentActions,
    # token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will start/stop the execution environment
    """
    user = {}
    return await skillset_controller.action_on_environment(user, id, action)
