import logging

# from app.utils.auth.validators import validate_user_auth_token
# from app.utils.socket.model import SocketEvent
import uuid

# from app.dependencies.dependencies import get_db
from app.main import socket_manager as sm
from fastapi.responses import JSONResponse

# from typing import Any


NAMESPACE = "/copilot-skillset"
response_memo = {}


@sm.on("connect", namespace=NAMESPACE)
async def connect_handler(sid, environ):
    print("Copilot-skillset websocket - sid: " + str(sid) + " Connected")


@sm.on("disconnect", namespace=NAMESPACE)
async def disconnect(sid):
    print("Copilot-skillset websocket - sid: " + str(sid) + " disconnected")


@sm.on("response", namespace=NAMESPACE)
async def on_response(payload):
    try:
        rid = payload.get("rid", "")
        # done = payload.get('done', True)
        # data = payload.get('data', '')
        # error = payload.get('error', '')
        # code = payload.get('code', '')
        if rid in response_memo:
            response_memo[rid].append(payload)
    except Exception as ex:
        logging.error(ex)


async def get(param: str, sid):
    session = await sm.get_session(sid, namespace=NAMESPACE)
    if session:
        await sm.emit("GET", {"param": param}, room=sid, namespace=NAMESPACE)
        response = await sm.call("response", room=sid, timeout=10, namespace=NAMESPACE)
        return JSONResponse(response)
    return JSONResponse({"error": "No local function connected"}, status_code=500)


class MockResponse:
    def __init__(self, request_id: bool, streaming=False) -> None:
        self.request_id = request_id
        self.streaming = streaming
        self.packet = response_memo[request_id]

    async def content(self):
        resp_data = ""
        while True:
            if self.packet:
                if self.packet["done"]:
                    break
                else:
                    resp_data += str(self.packet["data"])
        return resp_data

    async def json(self):
        pass


async def post(sid: str, payload: dict = None, streaming=False):
    try:
        # session = await sm.get_session(sid=sid, namespace=NAMESPACE)
        session = True
        if session or session == {}:
            if streaming:
                # resp_stack = []
                # done = False

                # def stream_handler(data):
                #     if data.done:
                #         done = True
                #         resp_stack.append(resp_stack)

                # stream_id = uuid.uuid4()
                # s = sm.on(stream_id, handler=stream_handler, namespace=NAMESPACE)

                # response = sm.call('POST', data={'stream_id': stream_id, 'request_body': data}, to=sid, timeout=4 * 60, namespace=NAMESPACE)
                # resp_stack.
                # value = asyncio.run(response)
                # for chunk in response.iter_lines(decode_unicode=True):
                #     yield chunk
                pass
            else:
                rid = uuid.uuid4()
                response_memo[rid] = {}
                sm.emit("POST", to=sid, data={rid: rid, payload: payload}, timeout=4 * 60, namespace=NAMESPACE)
                return MockResponse(request_id=rid)
    except Exception as ex:
        logging.error(ex)
        return JSONResponse({"error": "No local function connected"}, status_code=500)
