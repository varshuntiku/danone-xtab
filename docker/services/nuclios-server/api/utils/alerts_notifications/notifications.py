import json
import logging
import time
from typing import Any, Callable, Dict, List

from api.configs.settings import get_app_settings
from api.main import socket_manager
from api.models.base_models import Notifications
from api.utils.auth.email import send_email_smtp
from api.utils.auth.token import encode_payload
from jwt import decode

settings = get_app_settings()
secret = "9ba840b4-b130-11ed-a098-0242ac110003"


@socket_manager._sio.on("connect", namespace="/codx_product_notification")
async def establish_connection(sid, environ, data):
    key = data["user_email"]
    await socket_manager._sio.enter_room(sid=sid, room=key, namespace="/codx_product_notification")
    logging.info(msg="codx product server established the connection")
    logging.info(str(data) + "logged in")


@socket_manager._sio.on("user_session", namespace="/codx_product_notification")
async def establish_user_connection(sid, data):
    if data is not None:
        logging.info(str(data) + "logged in")
        key = str(data)
        await socket_manager._sio.enter_room(sid=sid, room=key, namespace="/codx_product_notification")


@socket_manager._sio.on("init:codx_collab", namespace="/codx_product_notification")
async def init_codx_collab(sid, data):
    if data is not None:
        key = data.get("key", None)
        await socket_manager._sio.enter_room(sid=sid, room=key, namespace="/codx_product_notification")
        user_email = data.get("user_email", "")
        user_first_name = data.get("user_first_name", "")
        user_last_name = data.get("user_last_name", "")
        if not key:
            return
        now = time.time()
        token = encode_payload(
            {
                "iat": now,
                "upn": user_email,
                "sid": sid,
                "key": data.get("key", None),
                "session_initiated_at": now,
                "first_name": user_first_name,
                "last_name": user_last_name,
            },
            secret,
            "HS256",
        )
        await socket_manager._sio.emit(
            "token:codx_collab#" + key,
            {"token": token, "session_initiated_at": now},
            namespace="/codx_product_notification",
            to=sid,
        )
        await socket_manager._sio.emit(
            "syn:codx_collab#" + key,
            {
                "from": {
                    "email": user_email,
                    "sid": sid,
                    "first_name": user_first_name,
                    "last_name": user_last_name,
                },
                "source_token": token,
            },
            namespace="/codx_product_notification",
            to=key,
        )


@socket_manager._sio.on("ack:codx_collab", namespace="/codx_product_notification")
async def ack_codx_collab(sid, data):
    if data is not None:
        decoded_token = decode(data["token"], algorithms=["HS256"], key=secret)
        key = decoded_token["key"]
        new_token_json = decode(data["to"], algorithms=["HS256"], key=secret)
        new_token_json["session_initiated_at"] = decoded_token["session_initiated_at"]
        new_token = encode_payload(new_token_json, secret, "HS256")

        await socket_manager._sio.emit(
            "ack:codx_collab#" + key,
            {
                "token": new_token,
                "state": data.get("state", None),
                "from": {
                    "email": decoded_token["upn"],
                    "sid": sid,
                    "first_name": decoded_token["first_name"],
                    "last_name": decoded_token["last_name"],
                },
                "session_initiated_at": decoded_token["session_initiated_at"],
            },
            namespace="/codx_product_notification",
            to=new_token_json["sid"],
        )


@socket_manager._sio.on("edit:codx_collab", namespace="/codx_product_notification")
async def edit_codx_collab(sid, data):
    if data is not None:
        decoded_token = decode(data["token"], algorithms=["HS256"], key=secret)
        key = decoded_token["key"]
        await socket_manager._sio.emit(
            "edit:codx_collab#" + key,
            {
                "state": data.get("state", None),
                "from": {
                    "email": decoded_token["upn"],
                    "sid": sid,
                    "first_name": decoded_token["first_name"],
                    "last_name": decoded_token["last_name"],
                },
                "session_initiated_at": decoded_token["session_initiated_at"],
            },
            namespace="/codx_product_notification",
            to=key,
        )


@socket_manager._sio.on("stop:codx_collab", namespace="/codx_product_notification")
async def stop_codx_collab(sid, data):
    if data is not None:
        decoded_token = decode(data["token"], algorithms=["HS256"], key=secret)
        key = decoded_token["key"]
        await socket_manager._sio.leave_room(sid=sid, room=key, namespace="/codx_product_notification")
        await socket_manager._sio.emit(
            "stop:codx_collab#" + key,
            {
                "from": {
                    "email": decoded_token["upn"],
                    "sid": sid,
                    "first_name": decoded_token["first_name"],
                    "last_name": decoded_token["last_name"],
                }
            },
            namespace="/codx_product_notification",
            to=key,
        )


@socket_manager._sio.on("disconnect", namespace="/codx_product_notification")
async def disconnect_connection(sid):
    await socket_manager._sio.disconnect(sid)
    logging.info("codx product server disconnected the connection")


@socket_manager._sio.on("init_progress_loader_component", namespace="/codx_product_notification")
async def create_room_progress_loader(sid, data):
    if data is not None:
        room = (
            "progress_loader_" + str(data["app_id"]) + "#" + str(data["screen_name"]) + "#" + str(data["widget_name"])
        )
        await socket_manager._sio.enter_room(sid=sid, room=room, namespace="/codx_product_notification")


@socket_manager._sio.on("close_progress_loader", namespace="/codx_product_notification")
async def stop_progress_loader(sid, data):
    if data is not None:
        room = (
            "progress_loader_" + str(data["app_id"]) + "#" + str(data["screen_name"]) + "#" + str(data["widget_name"])
        )
        await socket_manager._sio.leave_room(sid=sid, room=room, namespace="/codx_product_notification")


async def emit_notification(
    data: Any,
    user_email: str | bool | None = None,
    event_type: str | bool | None = False,
) -> None:
    """
    Emits notification

    Args:
        data: data to send to the client, it can be of different types
        user_email: user's email address
        event_type: type of event

    Returns:
        None
    """
    if user_email:
        room = user_email
        await socket_manager._sio.emit(
            event_type if event_type else "app_notification",
            data,
            namespace="/codx_product_notification",
            to=room,
        )
        logging.debug("THIS IS A DEBUG LOGGER----> data being emitted")
        logging.debug(data)
    if not user_email:
        await socket_manager._sio.emit(
            event_type if event_type else "app_notification",
            data,
            namespace="/codx_product_notification",
        )
        logging.debug("THIS IS A DEBUG LOGGER----> data being emitted")
        logging.debug(data)


async def trigger_custom_notification(
    socket_data: Dict,
    notification_type: str,
    bulk_save_notification_objects: Callable,
    ordered_users: List,
    user_email: str | bool | None = False,
    access: str | bool | None = False,
    additional_info: Dict = {},
) -> None:
    """
    Triggers custom notification

    Args:
        socket_data: socket data
        notification_type: notification type
        bulk_save_notification_objects: method to bulk save notification objects
        ordered_users: List of users
        user_email: user email address
        access: access dictionary string
        additional_info: additional information params

    Returns:
        None
    """
    try:
        notification_access = json.loads(access)
        data = {}
        notifications_list = []
        if notification_type == "banner":
            data["title"] = socket_data["title"]
            data["message"] = socket_data["message"]
            await emit_notification(data, user_email=None, event_type="banner_notification")

        if notification_type in (
            "push",
            "INFORMATION",
            "DEFAULT",
            "INAPP",
            "INTRAPP",
            "CONFIRM",
            "APPROVAL",
        ):
            for email in socket_data.get("email", False):
                notification_shared_by = None  # notification for user not shared by anyone
                if additional_info.get("notification_triggered_by", False):
                    notification_shared_by = additional_info.get("notification_triggered_by")
                else:
                    if user_email:
                        if email != user_email:
                            notification_shared_by = user_email
                    else:
                        notification_shared_by = "system.application@themathcompany.com"

                notifications_list.append(
                    Notifications(
                        alert_id=None,
                        app_id=socket_data.get("app_id", None),
                        widget_id=socket_data.get("widget_id", None),
                        title=socket_data.get("title", "System generated notification"),
                        message=socket_data.get("message", ""),
                        is_read=False,
                        user_email=email,
                        widget_name=socket_data.get("widget_name", None),
                        shared_by=notification_shared_by,
                        additional_info=(json.dumps(additional_info) if additional_info else None),
                    )
                )

            bulk_save_notification_objects(notifications_list)
            for item in notifications_list:
                data["id"] = item.id
                data["app_id"] = item.app_id
                data["alert_id"] = item.alert_id
                data["widget_id"] = item.widget_id
                data["title"] = item.title
                data["is_read"] = item.is_read
                data["triggered_at"] = time.time()
                data["widget_name"] = item.widget_name
                data["shared_by"] = item.shared_by
                data["message"] = item.message
                if notification_access["trigger_notification"]:
                    await emit_notification(
                        data,
                        item.user_email,
                        event_type=("app_notification" if item.app_id else "platform_notification"),
                    )

        if socket_data.get("mail_template", False):
            mail_template = socket_data["mail_template"]
            existing_users = [row.email_address for row in ordered_users]
            try:
                if notification_access["trigger_email_notification"]:
                    send_email_smtp(
                        email_type="custom-notification",
                        to=[email for email in list(set(existing_users).intersection(socket_data["email"]))],
                        subject=mail_template["subject"],
                        body={
                            "plain": mail_template["plain_text"],
                            "html": mail_template["html"],
                        },
                    )
            except Exception as e:
                logging.exception(e)
    except Exception as e:
        logging.exception(e)
        raise Exception(e)


@socket_manager._sio.on("init_stepper_progress_loader_component", namespace="/codx_product_notification")
async def create_room_stepper_progress_loader(sid, data):
    if data is not None:
        room = "progress_loader_" + str(data["app_id"]) + "#" + str(data["screen_id"]) + "#" + str(data["user_id"])
        await socket_manager._sio.enter_room(sid=sid, room=room, namespace="/codx_product_notification")


@socket_manager._sio.on("close_stepper_progress_loader", namespace="/codx_product_notification")
async def stop_stepper_progress_loader(sid, data):
    if data is not None:
        room = "progress_loader_" + str(data["app_id"]) + "#" + str(data["screen_id"]) + "#" + str(data["user_id"])
        await socket_manager._sio_leave_room(sid=sid, room=room, namespace="/codx_product_notification")


async def on_progress_loader(data: Dict, user_id: int, app_id: int, screen_id: int) -> None:
    key = "progress_loader_" + str(app_id) + "#" + str(screen_id) + "#" + str(user_id)
    await socket_manager._sio.emit(
        key,
        data,
        to=key,
        namespace="/codx_product_notification",
    )


@socket_manager._sio.on("init_app_screens_update_component", namespace="/codx_product_notification")
async def create_room_app_screens_update(sid, data):
    if data is not None:
        room = "app_screens_update_" + str(data["app_id"]) + "#" + str(data["user_id"])
        await socket_manager._sio.enter_room(sid=sid, room=room, namespace="/codx_product_notification")


@socket_manager._sio.on("close_app_screens_update", namespace="/codx_product_notification")
async def stop_app_screens_update(sid, data):
    if data is not None:
        room = "app_screens_update_" + str(data["app_id"]) + "#" + str(data["user_id"])
        await socket_manager._sio.leave_room(sid=sid, room=room, namespace="/codx_product_notification")


async def on_app_screens_update(data: Dict, user_id: int, app_id: int) -> None:
    key = "app_screens_update_" + str(app_id) + "#" + str(user_id)
    await socket_manager._sio.emit(
        key,
        data,
        to=key,
        namespace="/codx_product_notification",
    )


@socket_manager._sio.on("init_widgets_update_component", namespace="/codx_product_notification")
async def create_room_widgets_update_component(sid, data):
    if data is not None:
        room = "widgets_update_" + str(data["app_id"]) + "#" + str(data["screen_id"]) + "#" + str(data["user_id"])
        await socket_manager._sio.enter_room(sid=sid, room=room, namespace="/codx_product_notification")


@socket_manager._sio.on("close_widgets_update_component", namespace="/codx_product_notification")
async def stop_widgets_update_component(sid, data):
    if data is not None:
        room = "widgets_update_" + str(data["app_id"]) + "#" + str(data["screen_id"]) + "#" + str(data["user_id"])
        await socket_manager._sio.leave_room(sid=sid, room=room, namespace="/codx_product_notification")


async def on_widgets_update(data: Dict, user_id: int, app_id: int, screen_id: int) -> None:
    key = "widgets_update_" + str(app_id) + "#" + str(screen_id) + "#" + str(user_id)
    await socket_manager._sio.emit(
        key,
        data,
        to=key,
        namespace="/codx_product_notification",
    )
