from api.routes.solutionbp import solutionbp_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

router.include_router(solutionbp_route.router, prefix="/solution-bp", tags=["Solution Blueprint"])
