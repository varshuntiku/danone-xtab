# import json
from api.controllers.dsstore.dsstore_controller import DsstoreJobController
from api.middlewares.auth_middleware import app_user_info_required, authenticate_user
from api.schemas.code_executor.executor_schema import PreviewArtifactsRequestSchema

# from api.schemas.code_executor.executor_schema import ExecutorJobSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
executor_job_controller = DsstoreJobController()


@router.get(
    "/list/{app_id}",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
@app_user_info_required
async def list_artifacts(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the list of artifacts for the given app id.\n
    Returns:
        _type_: {list of artifacts}
    """
    user = request.state.user.__dict__
    return executor_job_controller.list_artifacts(user, app_id)


@router.post(
    "/preview/{app_id}",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
@app_user_info_required
async def preview_artifacts(
    request: Request,
    app_id: int,
    request_data: PreviewArtifactsRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the preview of artifacts for the given app id and artifact name.\n
    Returns:
        _type_: {preview of artifact}
    """
    user = request.state.user.__dict__
    return executor_job_controller.preview_artifact(user, app_id, request_data)
