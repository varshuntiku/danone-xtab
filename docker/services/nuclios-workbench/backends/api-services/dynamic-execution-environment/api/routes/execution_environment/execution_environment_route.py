from api.routes.execution_environment import compute_config_route, environment_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# ML Model Routes
router.include_router(environment_route.router, prefix="/execution-environments", tags=["Execution Environment"])
router.include_router(compute_config_route.router, prefix="/compute/configurations", tags=["Compute Config"])
