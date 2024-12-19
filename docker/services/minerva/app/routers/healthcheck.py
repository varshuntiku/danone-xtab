from fastapi import APIRouter

router = APIRouter()


@router.get("/healthcheck", status_code=200)
async def health_check():
    return {"message": "Co-pilot service is running"}
