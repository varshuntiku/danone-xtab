from api.routes.model_import import huggingface_model_route
from fastapi import APIRouter

router = APIRouter()  # Router Initialization

# ML Model Routes
router.include_router(huggingface_model_route.router, prefix="/hugging-face-models", tags=["Import Model"])
