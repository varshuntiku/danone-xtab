import asyncio
import json
import logging
from typing import Union

from aio_pika import ExchangeType, IncomingMessage, connect_robust
from api.configs.settings import get_app_settings
from api.middlewares.error_middleware import GeneralException
from api.utils.fast_api_socket_io.base_socket_manager import SocketManager
from fastapi import FastAPI

settings = get_app_settings()


class RabbitMQSocketManager(SocketManager):
    def __init__(
        self,
        app: FastAPI,
        mount_location: str = "/ws",
        socketio_path: str = "socket.io",
        cors_allowed_origins: Union[str, list] = "*",
        async_mode: str = "asgi",
        rabbitmq_url: str = None,
    ) -> None:
        try:
            if rabbitmq_url is None:
                if settings.SOCKET_BROKER_URI != "":
                    rabbitmq_url = settings.SOCKET_BROKER_URI
                else:
                    raise GeneralException(
                        message={"error": "RabbitMQ URL not provided. Please configure it in settings."},
                        status_code=404,
                    )

            super().__init__(
                app=app,
                socket_manager=None,
                mount_location=mount_location,
                socketio_path=socketio_path,
                cors_allowed_origins=cors_allowed_origins,
                async_mode=async_mode,
            )

            self.rabbitmq_url = rabbitmq_url
            self.loop = asyncio.get_event_loop()
            self.loop.create_task(self._setup_rabbitmq_listener())
        except Exception as e:
            logging.exception(e)
            raise e

    def is_asyncio_based(self) -> bool:
        return True

    async def _setup_rabbitmq_listener(self):
        connection = await connect_robust(self.rabbitmq_url)
        channel = await connection.channel()

        exchange = await channel.declare_exchange("socket_notifications", ExchangeType.DIRECT)

        queue = await channel.declare_queue("socket_queue")
        await queue.bind(exchange, routing_key="socket_key")

        await queue.consume(self._process_message)

    async def _process_message(self, message: IncomingMessage):
        async with message.process():
            try:
                data = json.loads(message.body.decode())
                user_email = data.get("user_email")
                event_type = data.get("event_type")

                await self._sio.emit(event_type, data, room=user_email, namespace="/codx_product_notification")
            except Exception as e:
                print("Error processing RabbitMQ message:", e)
