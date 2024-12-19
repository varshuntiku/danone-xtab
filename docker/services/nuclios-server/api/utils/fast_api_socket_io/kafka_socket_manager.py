import asyncio
import logging
from typing import Union

from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from api.configs.settings import get_app_settings
from api.utils.fast_api_socket_io.base_socket_manager import SocketManager
from fastapi import FastAPI

settings = get_app_settings()


class KafkaSocketManager(SocketManager):
    def __init__(
        self,
        app: FastAPI,
        mount_location: str = "/ws",
        socketio_path: str = "socket.io",
        cors_allowed_origins: Union[str, list] = "*",
        async_mode: str = "asgi",
        kafka_servers: list[str] = settings.KAFKA_SERVERS,
        kafka_topic: str = settings.KAFKA_TOPIC,
    ) -> None:
        try:
            super().__init__(
                app=app,
                socket_manager=None,
                mount_location=mount_location,
                socketio_path=socketio_path,
                cors_allowed_origins=cors_allowed_origins,
                async_mode=async_mode,
            )

            self.kafka_servers = kafka_servers
            self.kafka_topic = kafka_topic
            self.producer = AIOKafkaProducer(bootstrap_servers=kafka_servers)
            self.consumer = AIOKafkaConsumer(
                self.kafka_topic,
                bootstrap_servers=kafka_servers,
                group_id="socketio_group",
                max_poll_interval_ms=600000,
                max_poll_records=10,
                session_timeout_ms=30000,
                heartbeat_interval_ms=3000,
                request_timeout_ms=40000,
                retry_backoff_ms=1000,
            )

            self.loop = asyncio.get_event_loop()
            self.loop.create_task(self._setup_kafka())
        except Exception as e:
            logging.exception(e)
            raise e

    def is_asyncio_based(self) -> bool:
        return True

    async def _setup_kafka(self):
        await self.producer.start()
        await self.consumer.start()
        self.loop.create_task(self._consume_messages())

    async def _consume_messages(self):
        async for message in self.consumer:
            data = message.value.decode("utf-8")
            await self._broadcast_message(data)

    async def _broadcast_message(self, data: str):
        await self._app.sio.emit("broadcast_event", data)

    async def send_message(self, channel: str, data: str):
        await self.producer.send_and_wait(self.kafka_topic, data.encode("utf-8"))

    async def close(self):
        await self.producer.stop()
        await self.consumer.stop()
