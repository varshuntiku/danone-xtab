from api.routes import generic_route
from api.routes.alerts_notifications import notifications_route
from api.routes.apps import comments_route, users_route

# from api.routes.utils.azure import azure_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

router.include_router(generic_route.router, tags=["Generic"])


# Notifications Routes
router.include_router(notifications_route.router, tags=["Notifications"])

router.include_router(comments_route.router, prefix="/comments", tags=["comments"])
router.include_router(users_route.router, tags=["users"])
