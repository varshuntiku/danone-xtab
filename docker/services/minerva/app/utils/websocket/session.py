import asyncio
import json

from fastapi import WebSocket

from .request import Request
from .response import Response
from .utils import to_dict


class Session:
    def __init__(self, ws: WebSocket) -> None:
        self._ws = ws

    async def __send(self, req: Request, stream: bool = False) -> Response:
        message = json.dumps(extract_header_request(req=req))  # add headers
        message += "\n" + json.dumps(to_dict(req.data))  # add body
        byte_message = message.encode()  # str to bytes
        await self._ws.send_bytes(byte_message)
        # asyncio.create_task(
        #     self.__keep_alive(self._ws)
        # )  # keep the connection alive. coz message reading can happen asynchronously
        return Response(ws=self._ws, stream=stream)

    async def request(self, req: Request, stream: bool = False) -> Response:
        return await self.__send(req=req, stream=stream)

    async def __keep_alive(self, ws: WebSocket):
        while True:
            await ws.send_bytes(b"\x89")  # ping code
            await asyncio.sleep(1)


def extract_header_request(req: Request):
    return {"path": req.path, "method": req.method, "headers": to_dict(req.headers), "params": to_dict(req.params)}
