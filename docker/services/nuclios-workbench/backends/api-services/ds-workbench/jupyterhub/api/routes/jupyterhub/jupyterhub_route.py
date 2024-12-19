from api.routes.jupyterhub import files_route, jphub_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

router.include_router(jphub_route.router, prefix="/jphub", tags=["JPHub"])
router.include_router(files_route.router, prefix="/files", tags=["Files"])
