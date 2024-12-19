# import json
from typing import Optional

from api.constants.execution_environment.variables import ExecutionEnvironmentCategory
from api.controllers.envs.packages_controller import PackagesController
from api.middlewares.auth_middleware import authenticate_user
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
packages_controller = PackagesController()


@router.get(
    "/list",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def packages_list(
    request: Request,
    tag_core_packages: bool = False,
    exclude_core_packages: bool = False,
    env_category: Optional[ExecutionEnvironmentCategory] = ExecutionEnvironmentCategory.UIAC_EXECUTOR,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    return packages_controller.get_packages_list(tag_core_packages, exclude_core_packages, env_category)
