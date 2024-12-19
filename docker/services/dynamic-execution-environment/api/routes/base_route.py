from api.routes.code_executor import uiac_executor_route
from api.routes.copilot import copilot_route
from api.routes.dsworkbench import dsworkbench_route
from api.routes.envs import packages_route
from api.routes.execution_environment import execution_environment_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# LLM Workbench Routes
router.include_router(
    execution_environment_route.router,
    prefix="/dynamic-execution-environment",
)

router.include_router(uiac_executor_route.router, prefix="/execute", tags=["Code Executor"])
router.include_router(dsworkbench_route.router, prefix="/dsworkbench", tags=["DS Workbench"])
router.include_router(packages_route.router, prefix="/envs/packages", tags=["ENV Packages"])
router.include_router(copilot_route.router, prefix="/copilot", tags=["Copilot"])
