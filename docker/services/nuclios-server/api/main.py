import sentry_sdk
from api.configs.settings import get_app_settings
from api.constants.tags_metadata import tags_metadata
from api.middlewares import error_middleware
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import (
    get_swagger_ui_html,
    get_swagger_ui_oauth2_redirect_html,
)
from fastapi_socketio import SocketManager
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.ext.fastapi.fastapi_middleware import FastAPIMiddleware
from opencensus.trace.samplers import ProbabilitySampler
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import JSONResponse

settings = get_app_settings()


# Base App
app = FastAPI(
    title="NucliOS Server",
    description="This is the backend for NucliOS",
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url=None,
    redoc_url=settings.REDOC_URL,
    redirect_slashes=False,
)
# Initialising socket manager
if settings.SOCKET_MANAGER == "redis":
    from api.utils.fast_api_socket_io.redis_socket_manager import RedisSocketManager

    socket_manager = RedisSocketManager(app=app)
elif settings.SOCKET_MANAGER == "rabbitmq":
    from api.utils.fast_api_socket_io.rabbitmq_socket_manager import (
        RabbitMQSocketManager,
    )

    socket_manager = RabbitMQSocketManager(app=app)
elif settings.SOCKET_MANAGER == "kafka":
    from api.utils.fast_api_socket_io.kafka_socket_manager import KafkaSocketManager

    socket_manager = KafkaSocketManager(app=app)
else:
    socket_manager = SocketManager(app=app)

from api.routes import base_route


# Swagger API docs is fixed in the latest fastapi version.
# This will be removed in the future when we switch to the latest version.
@app.get(settings.DOCS_URL, include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
        swagger_css_url="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css",
    )


@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()


# #Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=settings.ALLOWED_METHODS,
    allow_headers=settings.ALLOWED_HEADERS,
)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SESSION_SECRET,
    max_age=60,
    session_cookie="auth_session",
    same_site="none",
    https_only=True,
)
app.middleware("http")(error_middleware.catch_exceptions_middleware)

if settings.FASTAPI_ENV and settings.FASTAPI_ENV != "fast_development":
    if settings.NUCLIOS_PRODUCT_ENABLE_SENTRY:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            integrations=[FastApiIntegration(), SqlalchemyIntegration()],
            environment=settings.FASTAPI_ENV,
        )
    if settings.NUCLIOS_PRODUCT_ENABLE_APP_INSIGHTS:
        # Initialize and setup opencensus with app insights
        loggerMiddleware = FastAPIMiddleware(
            app,
            exporter=AzureExporter(connection_string=f"InstrumentationKey={settings.APPINSIGHTS_INSTRUMENTATIONKEY}"),
            sampler=ProbabilitySampler(rate=1.0),
        )

# Custom Exceptions
app.add_exception_handler(error_middleware.DoesNotExistException, error_middleware.custom_exception_handler)
app.add_exception_handler(error_middleware.AlreadyExistException, error_middleware.custom_exception_handler)
app.add_exception_handler(error_middleware.AuthenticationException, error_middleware.custom_exception_handler)
app.add_exception_handler(error_middleware.GeneralException, error_middleware.custom_exception_handler)

# Registered Routes
app.include_router(base_route.router, prefix="/nuclios-product-api")

# models.Base.metadata.create_all(bind=database.engine)


@app.get("/", status_code=status.HTTP_200_OK)
async def welcome():
    return "Welcome to the Nuclios Backend!"


@app.get("/healthcheck", status_code=status.HTTP_200_OK)
async def health_check():
    return JSONResponse(content={"stauts": "Ok", "message": "Running"}, status_code=status.HTTP_200_OK)


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
