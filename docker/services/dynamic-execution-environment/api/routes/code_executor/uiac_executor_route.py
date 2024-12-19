# import json
from api.constants.code_executor import RendererTypes, ResourceTypes
from api.controllers.code_executor.executor_controller import ExecutorJobController
from api.middlewares.auth_middleware import app_user_info_required, authenticate_user
from api.schemas.code_executor.executor_schema import InputJSONSchema

# from api.schemas.code_executor.executor_schema import ExecutorJobSchema
from fastapi import APIRouter, BackgroundTasks, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
executor_job_controller = ExecutorJobController()


# @router.post(
#     "/uiac/render",
#     status_code=status.HTTP_200_OK,
#     response_model=executor_serializer.ExecutorJobSerializer,
# )
# @authenticate_user
# @app_user_info_required
# async def uiac_renderer(
#     request: Request,
#     request_data: InputJSONSchema,
#     token: HTTPAuthorizationCredentials = Security(auth_scheme),
# ):
#     """
#     API will return the output of the code string.\n
#     Will take endpoint and code_string as input or app_id and widget_id as input.\n
#     Returns:
#         _type_: {evaluated output of the code string}
#     """
#     # access_token = request.headers.get("authorization", None)
#     user = request.state.user.__dict__
#     # {
#     #     "access_token": access_token,
#     #     }
#     # request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object

#     return executor_job_controller.uiac_renderer(user, request_data)


@router.post(
    "/{resource_type}/{renderer_type}",
    status_code=status.HTTP_200_OK,
    # response_model=executor_serializer.ExecutorJobDebugSerializer,
)
@authenticate_user
@app_user_info_required
# @nac_role_info_required
async def uiac_test_renderer(
    request: Request,
    resource_type: ResourceTypes,
    renderer_type: RendererTypes,
    request_data: InputJSONSchema,
    background_tasks: BackgroundTasks,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the output of the code string.\n
    Will take endpoint and code_string as input or app_id and widget_id as input.\n
    Returns:
        _type_: {evaluated output of the code string}
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object

    if resource_type == ResourceTypes.uiac.value:
        return executor_job_controller.uiac_renderer(
            request, user, request_data, renderer_type=renderer_type, background_tasks=background_tasks
        )
    elif resource_type == ResourceTypes.action.value:
        return executor_job_controller.action_renderer(
            request, user, request_data, renderer_type=renderer_type, background_tasks=background_tasks
        )
    elif resource_type == ResourceTypes.filter.value:
        return executor_job_controller.filter_renderer(
            request, user, request_data, renderer_type=renderer_type, background_tasks=background_tasks
        )
    elif resource_type == ResourceTypes.widget_filter.value:
        return executor_job_controller.widget_filter_render(
            request, user, request_data, renderer_type=renderer_type, background_tasks=background_tasks
        )
    elif resource_type == ResourceTypes.code.value:
        return executor_job_controller.code_renderer(
            request, user, request_data, renderer_type=renderer_type, background_tasks=background_tasks
        )
    elif resource_type == ResourceTypes.app_function.value:
        return executor_job_controller.app_function_renderer(
            request, user, request_data, renderer_type=renderer_type, background_tasks=background_tasks
        )
    return {}
