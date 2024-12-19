from abc import ABC, abstractmethod
from typing import Union

import socketio
from fastapi import FastAPI
from socketio.base_manager import BaseManager


class SocketManager(ABC):
    def __init__(
        self,
        app: FastAPI,
        socket_manager: BaseManager,
        mount_location: str = "/ws",
        socketio_path: str = "socket.io",
        cors_allowed_origins: Union[str, list] = "*",
        async_mode: str = "asgi",
    ) -> None:
        self._sio = socketio.AsyncServer(
            async_mode=async_mode,
            cors_allowed_origins=cors_allowed_origins,
            client_manager=socket_manager,
        )

        self._app = socketio.ASGIApp(socketio_server=self._sio, socketio_path=socketio_path)
        app.mount(mount_location, self._app)
        app.sio = self._sio

    @abstractmethod
    def is_asyncio_based(self) -> bool:
        pass
