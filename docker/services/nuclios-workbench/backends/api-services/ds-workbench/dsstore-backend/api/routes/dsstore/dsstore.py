from api.routes.dsstore import dsstore_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# ML Model Routes
router.include_router(dsstore_route.router, prefix="/artifacts", tags=["DS Store Artifacts"])
