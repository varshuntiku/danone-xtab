from api.routes.jupyterhub import jupyterhub_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

router.include_router(jupyterhub_route.router, prefix="/jupyterhub", tags=["jupyterhub"])
