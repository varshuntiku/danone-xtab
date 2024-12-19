import asyncio
import os
import shutil
import tempfile

# from api.schemas.code_execute_schema import OutputJSONSchema
from api.services.code_execution_service import (
    code_executor_service,
    delete_temp_dir_files,
)
from api.settings import get_app_settings
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

settings = get_app_settings()


# Base App
app = FastAPI(
    title="NucliOS Exec Server",
    description="This is the backend for UIAC executor service",
    version="1.0.0",
    openapi_tags=[],
    docs_url=settings.DOCS_URL,
    root_path=settings.ROOT_PATH,
    # openapi_url=settings.OPENAPI_URL,
    redirect_slashes=False,
)

# Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=settings.ALLOWED_METHODS,
    allow_headers=settings.ALLOWED_HEADERS,
)


@app.get("/", status_code=status.HTTP_200_OK)
async def welcome():
    return "Welcome to the Nuclios Code Executor Service!"


@app.get("/healthcheck", status_code=status.HTTP_200_OK)
async def health_check():
    return JSONResponse(content={"stauts": "Ok", "message": "Running"}, status_code=status.HTTP_200_OK)


@app.post("/execute")
async def execute(input_json: dict):
    data = await code_executor_service(input_json)
    if not data or len(data["results"]) < 1:
        return JSONResponse(
            content={
                "data": data,
            },
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    return JSONResponse(
        content={"data": data},
        status_code=status.HTTP_200_OK,
    )


@app.get("/info")
async def app_info():
    return JSONResponse(
        content={
            "api_version": settings.API_VERSION,
            "app_mode": settings.APP_MODE,
            "path": settings.FOLDER_PATH,
            "app_name": settings.APP_NAME,
        },
        status_code=status.HTTP_200_OK,
    )


async def temp_dir_files_removal_scheduler():
    while True:
        print("Scheduler task executed!")
        await delete_temp_dir_files()
        await asyncio.sleep(300)
    # await code_execute_service.create_temp_dir()


def setup_codex_wf_lite():
    current_dir = os.getcwd()
    temp_dir = tempfile.gettempdir()
    try:
        directory_to_copy = "codex_widget_factory_lite"
        # if directory_to_copy already exists in temp dir then ignore
        if os.path.exists(os.path.join(temp_dir, directory_to_copy)):
            print(f"Directory '{directory_to_copy}' already exists in '{temp_dir}'")
            return

        source_dir = os.path.join(current_dir, directory_to_copy)
        if not os.path.exists(source_dir) or not os.path.isdir(source_dir):
            print("The specified directory does not exist or is not a directory.")
            return
        destination_dir = os.path.join(temp_dir, directory_to_copy)
        shutil.copytree(source_dir, destination_dir)
        print(f"Directory '{directory_to_copy}' copied to '{temp_dir}'")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        pass


@app.on_event("startup")
async def startup_event():
    # Start up event for the FastAPI app
    # Start the scheduler when the FastAPI app starts
    setup_codex_wf_lite()
    asyncio.create_task(temp_dir_files_removal_scheduler())
