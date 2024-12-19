# import logging
# from typing import Any

# from app.dependencies.dependencies import get_db
# from app.main import socket_manager as sm
# from app.utils.auth.validators import validate_user_auth_token
# from app.utils.socket.model import SocketEvent

# interrupted_queries_ids = []


# async def join_room(sid, room_id: str, namespace: str = "/minerva"):
#     await sm.enter_room(sid=sid, room=room_id, namespace=namespace)


# async def leave_room(sid, room_id: str, namespace: str = "/minerva"):
#     await sm.leave_room(sid=sid, room=room_id, namespace=namespace)


# async def close_room(room_id: str, namespace: str = "/minerva"):
#     await sm.close_room(room=room_id, namespace=namespace)


# async def emit_message(socket_event: str, data: Any, room: str, namespace: str = "/minerva"):
#     await sm.emit(event=socket_event, data=data, to=room, namespace=namespace)


# async def broadcast_message(socket_event: str, data: Any, namespace: str = "/minerva"):
#     await sm.emit(event=socket_event, data=data, namespace=namespace)


# @sm.on("connect", namespace="/minerva")
# async def connect_handler(sid, environ, auth_cred: dict):
#     if "auth_token" in auth_cred:
#         try:
#             user_info = validate_user_auth_token(
#                 token=auth_cred["auth_token"],
#                 request_origin=environ.get("HTTP_ORIGIN"),
#                 access_key=auth_cred.get("access_key", ""),
#                 db=next(get_db()),
#             )
#             await join_room(sid=sid, room_id=user_info.get("email"), namespace="/minerva")
#         except Exception:
#             await sm.disconnect(sid)
#     else:
#         await join_room(sid=sid, room_id=auth_cred.get("user_email"), namespace="/minerva")


# @sm.on("init::minerva_app_status", namespace="/minerva")
# async def create_minerva_app_room(sid, data: dict):
#     await join_room(sid=sid, room_id=data.get("room_id"), namespace="/minerva")


# @sm.on("exit::minerva_app_status", namespace="/minerva")
# async def close_minerva_app_room(sid, data: dict):
#     await close_room(room_id=data.get("room_id"), namespace="/minerva")


# @sm.on("init:query_status", namespace="/minerva")
# async def init_query_status_connection(sid, data: dict):
#     await join_room(sid=sid, room_id=data.get("room_id"))


# @sm.on("stop:query_response", namespace="/minerva")
# async def stop_query_response_fetch(sid, data: dict):
#     interrupted_query_id = data.get("query_trace_id", None)
#     global interrupted_queries_ids
#     if interrupted_query_id:
#         interrupted_queries_ids.append(interrupted_query_id)


# async def emit_query_processing_step(data: Any, room: str, namespace: str = "/minerva"):
#     await emit_message(socket_event=SocketEvent.query_status.value, room=room, data=data)
#     # Pushing the main message forcefully by sending another void message.
#     # Else the message is getting emited only after the current execution completes.
#     await sm.send(data=None, to=room, namespace=namespace)


# async def emit_query_streaming_response(data: Any, room: str, namespace: str = "/minerva"):
#     await emit_message(socket_event=SocketEvent.query_streaming_response.value, room=room, data=data)
#     # Pushing the main message forcefully by sending another void message.
#     # Else the message is getting emited only after the current execution completes.
#     await sm.send(data=None, to=room, namespace=namespace)


# def is_query_interrupted(query_trace_id: str):
#     global interrupted_queries_ids
#     return query_trace_id in interrupted_queries_ids


# def update_interrupted_queries_ids(query_trace_id: str):
#     global interrupted_queries_ids
#     try:
#         interrupted_queries_ids.remove(query_trace_id)
#     except Exception as e:
#         logging.warning(e)
