from api.routes.copilot import copilot_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

router.include_router(copilot_route.router, prefix="/copilot", tags=["Copilot"])
