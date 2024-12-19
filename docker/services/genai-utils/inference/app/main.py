from app.utils.config import get_settings
from fastapi import FastAPI, status
from starlette.responses import JSONResponse

settings = get_settings()
tags_metadata = []

app = FastAPI(
    title="LLM Server",
    description="This is the hosted interface for LLMs",
    version=settings.APP_VERSION,  # type: ignore
    openapi_tags=tags_metadata,
    docs_url=settings.DOCS_URL,
)


if settings.TEXTGENERATION_MODEL:
    from app.routers import textgeneration

    app.include_router(textgeneration.router, prefix="/textgeneration", tags=["textgeneration"])

elif settings.EMBEDDING_MODEL:
    from app.routers import embeddings

    app.include_router(embeddings.router, prefix="/embeddings", tags=["embeddings"])

elif settings.CHATCOMPLETION_MODEL:
    from app.routers import chatcompletion

    app.include_router(chatcompletion.router, prefix="/v1", tags=["chatcompletion"])


# elif settings.LF_CHAT:
#     import subprocess
#     script_path = "app/routers/lf_chatmodel.py"
#     model_name_or_path = settings.MODEL_NAME
#     template = 'default'
#     stream = False
#     if settings.QUANTIZATION and settings.LOAD_IN_4BIT:
#         subprocess.run(['python', script_path,'--model_name_or_path', model_name_or_path,'--template', template,'--stream', str(stream),'--quantization_bit',4])
#     elif settings.QUANTIZATION and settings.LOAD_IN_8BIT:
#         subprocess.run(['python', script_path,'--model_name_or_path', model_name_or_path,'--template', template,'--stream', str(stream),'--quantization_bit',8])
#     else:
#         subprocess.run(['python', script_path,'--model_name_or_path', model_name_or_path,'--template', template,'--stream', str(stream)])


@app.get("/healthcheck", status_code=status.HTTP_200_OK)
@app.get("/", status_code=status.HTTP_200_OK)
async def health_check():
    return JSONResponse(content={"stauts": "Ok", "message": "Running"}, status_code=status.HTTP_200_OK)


@app.get("/info")
async def app_info():
    return JSONResponse(
        content={
            "api_version": settings.APP_VERSION,
            "app_mode": settings.APP_MODE,
            "path": settings.FOLDER_PATH,
            "app_name": settings.APP_NAME,
        },
        status_code=status.HTTP_200_OK,
    )
