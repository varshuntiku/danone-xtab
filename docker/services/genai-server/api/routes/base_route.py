from api.routes.llm_workbench import llm_workbench_route
from api.routes.ml_model import ml_model_route
from api.routes.model_import import model_import_route
from api.routes.utils.azure import azure_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# ML Model Routes
router.include_router(
    ml_model_route.router,
    prefix="/ml-models",
)

# LLM Workbench Routes
router.include_router(
    llm_workbench_route.router,
    prefix="/llm-workbench",
)

# Azure Service Routes
router.include_router(
    azure_route.router,
    prefix="/azure",
)

# Import Model Routes
router.include_router(model_import_route.router, prefix="/import-models")
