from api.routes.llm_workbench import (
    compute_config_route,
    data_registry_route,
    deployment_route,
    experiment_route,
    model_registry_route,
)
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# ML Model Routes
router.include_router(experiment_route.router, prefix="/experiments", tags=["LLM Workbench Finetuning"])

router.include_router(model_registry_route.router, prefix="/models", tags=["LLM Workbench Model Registry"])

router.include_router(data_registry_route.router, prefix="/datasets", tags=["LLM Workbench Data Registry"])

router.include_router(compute_config_route.router, prefix="/infras", tags=["LLM Workbench Compute Config"])

router.include_router(deployment_route.router, prefix="/deployments", tags=["LLM Workbench Deployed Model"])
