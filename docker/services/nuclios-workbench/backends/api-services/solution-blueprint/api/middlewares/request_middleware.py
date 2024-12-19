# at the import level
from api.databases.session import SessionLocal
from fastapi import Request


async def database_middleware(request: Request, call_next):
    # Intercept and modify the incoming request

    # Process the modified request
    response = await call_next(request)

    # Transform the outgoing response
    # if isinstance(response, StreamingResponse):
    SessionLocal().close()
    return response
