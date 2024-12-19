from api.routes.ml_model import (
    base_model_route,
    configuration_route,
    deployed_model_route,
    finetuned_model_route,
    model_job_route,
)
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# ML Model Routes
router.include_router(model_job_route.router, prefix="/model-jobs", tags=["Job"])

router.include_router(configuration_route.router, prefix="/table-configurations", tags=["Configuration"])

router.include_router(base_model_route.router, prefix="/foundation", tags=["Base Model"])

router.include_router(finetuned_model_route.router, prefix="/finetuned", tags=["Finetuned Model"])

router.include_router(deployed_model_route.router, prefix="/deployed", tags=["Deployed Model"])
