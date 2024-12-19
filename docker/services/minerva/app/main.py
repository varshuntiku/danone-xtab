from app.utils.config import get_settings
from app.utils.websocket.base import WebSocketManager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager

# from fastapi import WebSocket
# from fastapi import WebSocketDisconnect, WebSocketException
# import logging

settings = get_settings()

tags_metadata = [
    {
        "name": "services",
        "description": "Important Minerva APIs typically used during integration with consumption layer",
    },
    {
        "name": "admin",
        "description": "Admin APIs to manage Minerva application config CRUD operations. These include configurations such as data sources, llm model, tools used, etc.",
    },
]

app = FastAPI(
    title="Minerva Backend Service",
    description="This is the backend for that supports the Minerva Integration on Co.dx",
    version="v23.4.1",
    contact={
        "name": "Anoop S",
        "email": "anoop.s@themathcommpany.com",
    },
    openapi_tags=tags_metadata,
    docs_url=settings.DOCS_URL,
)

# TODO: remove the commented out socket logic
socket_manager = SocketManager(app=app)

websocket_manager = WebSocketManager(app=app)

# @app.websocket(path='/ws')
# async def connect(websocket: WebSocket, conn_id: str):
#     try:
#         logging.log(f'Master Connection request received: {conn_id}')
#         await websocket.accept(subprotocol='mock-http', headers=('conn', 'master'))
#         # await websocket.accept()
#         logging.log(f'Master Connection request accepted: {conn_id}')
#     except WebSocketDisconnect as e:
#         logging.error(e)
#     except WebSocketException as e:
#         logging.error(e)
#     except Exception as e:
#         logging.error(e)

from app.routers import (
    admin,
    copilot_app,
    copilot_context,
    copilot_datasource,
    copilot_orchestrator,
    copilot_tool,
    copilot_tool_registry,
    healthcheck,
    services,
    user,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(services.router, prefix="/services", tags=["services"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(copilot_tool.router, prefix="/copilot_tool", tags=["copilot_tool"])
app.include_router(copilot_app.router, prefix="/copilot", tags=["copilot_app"])
app.include_router(copilot_datasource.router, prefix="/copilot", tags=["copilot_datasource"])
app.include_router(copilot_tool_registry.router, prefix="/copilot", tags=["copilot_tool_registry"])
app.include_router(copilot_orchestrator.router, prefix="/copilot", tags=["copilot_orchestrator"])
app.include_router(user.router, prefix="/user", tags=["nuclios_user"])
app.include_router(healthcheck.router)
app.include_router(copilot_context.router, prefix="/copilot", tags=["copilot_context"])
