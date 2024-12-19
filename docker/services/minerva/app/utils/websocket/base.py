import asyncio
import logging
import uuid
from datetime import timedelta

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, WebSocketException
from starlette.websockets import WebSocketState

# from .response import Response
from .exception import FailedToCreationConnection, FailedToSendRequest
from .request import Request
from .session import Session

# import json


class WebSocketManager:
    __master_connections: dict[str, WebSocket] = {}
    __temp_conn_obj: dict[str, WebSocket] = {}

    def __init__(self, app: FastAPI, path="/ws") -> None:
        self.__app = app
        self.__initiate(path=path)

    def __get_connection(self, conn_id: str):
        return self.__master_connections.get(conn_id, None)

    def __initiate(self, path: str):
        async def wait_to_complete(ws: WebSocket, check_after: float = timedelta(seconds=10).total_seconds()):
            while True:
                if ws.state == WebSocketState.DISCONNECTED:
                    break
                await asyncio.sleep(check_after)

        @self.__app.websocket(path=path)
        async def connect(websocket: WebSocket, conn_id: str = None, spawn_id: str = None):
            if spawn_id:
                await spawn_child_connection(websocket=websocket, spawn_id=spawn_id)
            else:
                await handle_master_connection(websocket=websocket, conn_id=conn_id)

        async def handle_master_connection(websocket: WebSocket, conn_id: str):
            try:
                logging.info(f"Master Connection request received: {conn_id}")
                await websocket.accept()
                logging.info(f"Master Connection request accepted: {conn_id}")
                self.__master_connections[conn_id] = websocket
                await wait_to_complete(ws=websocket, check_after=timedelta(seconds=60).total_seconds())
            except WebSocketDisconnect as e:
                logging.error(e)
                await self.__remove_master_connection(conn_id)
            except WebSocketException as e:
                logging.error(e)
                await self.__remove_master_connection(conn_id)
            except Exception as e:
                logging.error(e)
                await self.__remove_master_connection(conn_id)

        async def spawn_child_connection(websocket: WebSocket, spawn_id: str):
            try:
                logging.info(f"Child Connection request received: {spawn_id}")
                await websocket.accept()
                logging.info(f"Child Connection request accepted: {spawn_id}")
                self.__temp_conn_obj[spawn_id] = websocket
                await wait_to_complete(ws=websocket)
            except WebSocketDisconnect as e:
                logging.error(e)
                await self.__remove_child_connection(websocket)
            except WebSocketException as e:
                logging.error(e)
                await self.__remove_child_connection(websocket)
            except Exception as e:
                logging.error(e)
                await self.__remove_child_connection(websocket)

    async def request(self, conn_id: str, req: Request, stream: bool = False):
        master_conn = self.__get_connection(conn_id=conn_id)
        if master_conn:
            try:
                conn = await self.__spawn_child_connection(master_conn=master_conn)
                session = Session(ws=conn)
                return await session.request(req=req, stream=stream)
            except FailedToCreationConnection as e:
                if conn:
                    await self.__remove_child_connection(conn)
                raise FailedToSendRequest(str(e))
            except Exception as e:
                if conn:
                    await self.__remove_child_connection(conn)
                raise FailedToSendRequest(str(e))
        else:
            raise FailedToSendRequest(f"Master Connection not found: {conn_id}")

    async def __spawn_child_connection(self, master_conn: WebSocket):
        try:
            spawn_id = str(uuid.uuid4())
            await master_conn.send_json({"method": "spawn_child_connection", "spawn_id": spawn_id})
            try:

                async def check_connection():
                    while spawn_id not in self.__temp_conn_obj:
                        await asyncio.sleep(0.1)

                await asyncio.wait_for(check_connection(), timeout=60 * 5)
            except asyncio.TimeoutError as e:
                logging.error(e)
                raise FailedToCreationConnection(str(e))
            new_ws = self.__temp_conn_obj[spawn_id]
            del self.__temp_conn_obj[spawn_id]
            new_ws.cookies["handed_over"] = True
            return new_ws
        except RuntimeError as e:
            logging.error(e)
            raise FailedToCreationConnection(str(e))
        except Exception as e:
            logging.error(e)
            raise FailedToCreationConnection(str(e))

    async def __remove_master_connection(self, conn_id: str):
        try:
            ws = self.__master_connections[conn_id]
            del self.__master_connections[conn_id]
            if ws.state is not WebSocketState.DISCONNECTED:
                await ws.close()
        except Exception as e:
            logging.error(e)

    async def __remove_child_connection(self, ws: WebSocket):
        try:
            if ws.state is not WebSocketState.DISCONNECTED:
                await ws.close()
        except Exception as e:
            logging.error(e)
