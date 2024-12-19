from api.routes.dsworkbench import (
    dsstore_route,
    files_route,
    jphub_route,
    solutionbp_route,
)
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# ML Model Routes
router.include_router(dsstore_route.router, prefix="/artifacts", tags=["DS Store Artifacts"])
router.include_router(jphub_route.router, prefix="/jphub", tags=["JPHub"])
router.include_router(solutionbp_route.router, prefix="/solution-bp", tags=["solution blueprint"])
router.include_router(files_route.router, prefix="/files", tags=["Files"])
