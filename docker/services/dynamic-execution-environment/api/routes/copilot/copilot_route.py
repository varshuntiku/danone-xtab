from api.routes.copilot import skillset_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# ML Model Routes
router.include_router(skillset_route.router, prefix="/skillset", tags=["Skillset"])
