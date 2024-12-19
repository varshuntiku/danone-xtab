# import json
from api.controllers.jupyterhub.jphub_controller import JPHubJobController
from api.middlewares.auth_middleware import app_user_info_required, authenticate_user

# from api.schemas.code_executor.executor_schema import ExecutorJobSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
jphub_job_controller = JPHubJobController()


# hard reload
@router.get(
    "/hard-reload/{project_id}",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
@app_user_info_required
async def hard_reload(
    request: Request,
    project_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will Remove the Jupyter user pod.\n
    Returns:
        _type_: {Jupyter user pod removed}
    """
    user = request.state.user.__dict__
    return await jphub_job_controller.hard_reload(user, project_id)
