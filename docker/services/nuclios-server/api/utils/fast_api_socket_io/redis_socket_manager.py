import logging
from typing import Union

import socketio
from api.configs.settings import get_app_settings
from api.middlewares.error_middleware import GeneralException
from api.utils.fast_api_socket_io.base_socket_manager import SocketManager
from fastapi import FastAPI

settings = get_app_settings()


class RedisSocketManager(SocketManager):
    def __init__(
        self,
        app: FastAPI,
        mount_location: str = "/ws",
        socketio_path: str = "socket.io",
        cors_allowed_origins: Union[str, list] = "*",
        async_mode: str = "asgi",
        redis_url: str = None,
    ) -> None:
        try:
            if redis_url is None:
                if settings.SOCKET_BROKER_URI != "":
                    redis_url = settings.SOCKET_BROKER_URI
                else:
                    raise GeneralException(
                        message={"error": "Redis URL not provided. Please configure it in settings."},
                        status_code=404,
                    )
            redis_manager = socketio.AsyncRedisManager(redis_url)
            super().__init__(app, redis_manager, mount_location, socketio_path, cors_allowed_origins, async_mode)
        except Exception as e:
            logging.exception(e)
            raise e

    def is_asyncio_based(self) -> bool:
        return True
