import json
import logging
from typing import Literal, Optional

from fastapi import WebSocket

from .exception import ContentConsumedException, FailedToReadData


class ResponseHeader:
    transfer_encoding: Optional[Literal["chunked"]]

    def __init__(self, transfer_encoding: Literal["chunked"] = "", **kwargs) -> None:
        self.transfer_encoding = transfer_encoding
        for key, value in kwargs.items():
            setattr(self, key, value)


class Response:
    def __init__(self, ws: WebSocket, stream: bool = False) -> None:
        self._ws = ws
        self.stream = stream
        self.status_code = 200
        self._content_consumed = False
        self.headers: ResponseHeader = {}

    def iter_content(self):
        async def generate():
            ws = self._ws
            message = await ws.receive_bytes()
            try:
                response_iter = iter(message.split(b"\n", 1))
                header_part_dict = json.loads(next(response_iter).decode(errors="replace"))
                self.headers = ResponseHeader(**header_part_dict.get("headers", {}))
                self.status_code = header_part_dict.get("status_code", 200)
            except StopIteration as e:
                logging.log(e)
                await ws.close()
                raise FailedToReadData("Header not Found")

            if self.headers.transfer_encoding == "chunked":
                while True:
                    chunk = await ws.receive_bytes()
                    if not chunk:
                        break
                    yield chunk
            else:
                while True:
                    try:
                        yield next(response_iter)
                    except StopIteration:
                        break

            self._content_consumed = True

        if self._content_consumed:
            raise ContentConsumedException()

        return generate()

    async def content(self):
        if not self._content_consumed:
            content = b""
            async for chunk in self.iter_content():
                content += chunk
            return content
        else:
            raise ContentConsumedException()

    async def iter_lines(self, delimiter=None):
        pending = None

        async for chunk in self.iter_content():
            if pending is not None:
                chunk = pending + chunk

            if delimiter:
                lines = chunk.split(delimiter)
            else:
                lines = chunk.splitlines()

            if lines and lines[-1] and chunk and lines[-1][-1] == chunk[-1]:
                pending = lines.pop()
            else:
                pending = None

            for line in lines:
                yield line

        if pending is not None:
            yield pending

    async def json(self):
        if not self._content_consumed:
            content = b""
            async for chunk in self.iter_content():
                content += chunk
            return json.loads(content.decode(errors="replace"))
        else:
            raise ContentConsumedException()

    async def text(self):
        if not self._content_consumed:
            content = b""
            async for chunk in self.iter_content():
                content += chunk
            return content.decode(errors="replace")
        else:
            raise ContentConsumedException()

    async def close(self):
        try:
            await self._ws.close()
        except Exception as e:
            logging.log(e)
