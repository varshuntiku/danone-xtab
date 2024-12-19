from api.routes.utils.azure import fileshare_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# Azure File Share Related Routes
router.include_router(fileshare_route.router, prefix="/file-share", tags=["File Share"])
