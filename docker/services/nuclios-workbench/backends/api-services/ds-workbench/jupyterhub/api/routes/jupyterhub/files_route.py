# import json
from api.controllers.jupyterhub.files_controller import FilesController
from api.middlewares.auth_middleware import app_user_info_required, authenticate_user

# from api.schemas.code_executor.executor_schema import ExecutorJobSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
files_controller = FilesController()


# preview file
@router.post(
    "/preview-file",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
@app_user_info_required
async def preview_file(
    request: Request,
    request_data: dict,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will Remove the Jupyter user pod.\n
    Returns:
        _type_: {Jupyter user pod removed}
    """
    user = request.state.user.__dict__
    return await files_controller.preview_file(user, request_data)
