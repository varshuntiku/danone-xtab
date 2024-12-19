from api.configs.settings import get_app_settings
from api.databases.session import engine
from api.middlewares.error_middleware import (
    AlreadyExistException,
    AuthenticationException,
    DBConnectionException,
    DoesNotExistException,
    GeneralException,
    MultipleException,
    custom_exception_handler,
    custom_multiple_exception_handler,
    db_exception_handler,
)
from api.middlewares.request_middleware import database_middleware
from api.routes import base_route
from debug_toolbar.middleware import DebugToolbarMiddleware
from debug_toolbar.panels.sqlalchemy import SQLAlchemyPanel as BasePanel
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from fastapi_pagination.utils import disable_installed_extensions_check
from starlette.responses import JSONResponse

settings = get_app_settings()


class SQLAlchemyPanel(BasePanel):
    async def add_engines(self, request: Request):
        self.engines.add(engine)


tags_metadata = []

# Base App
app = FastAPI(
    title="Jupyterhub Server",
    description="This is the backend for Jupyterhub",
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url=settings.DOCS_URL,
    redirect_slashes=False,
    root_path=settings.ROOT_PATH,
    debug=settings.DEBUG == "true" or settings.DEBUG is True,
)


# Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    DebugToolbarMiddleware,
    panels=["api.main.SQLAlchemyPanel"],
)
app.middleware("http")(database_middleware)
# app.middleware('http')(catch_exceptions_middleware)


# Custom Exceptions
app.add_exception_handler(DoesNotExistException, custom_exception_handler)
app.add_exception_handler(AlreadyExistException, custom_exception_handler)
app.add_exception_handler(AuthenticationException, custom_exception_handler)
app.add_exception_handler(GeneralException, custom_exception_handler)
app.add_exception_handler(MultipleException, custom_multiple_exception_handler)
app.add_exception_handler(DBConnectionException, db_exception_handler)
app.add_exception_handler(Exception, custom_exception_handler)

# Pagination Handler
add_pagination(app)
disable_installed_extensions_check()

# Registered Routes
app.include_router(base_route.router, prefix="/services")

# models.Base.metadata.create_all(bind=database.engine)


@app.get("/", status_code=status.HTTP_200_OK)
@app.get("/healthcheck", status_code=status.HTTP_200_OK)
async def health_check():
    return JSONResponse(content={"status": "Ok", "message": "Running"}, status_code=status.HTTP_200_OK)


# Info API
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
