from api.routes.dsstore import dsstore
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

router.include_router(dsstore.router, prefix="/dsstore", tags=["DS Store"])
