#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.
import json
import logging
import threading
import time
from pathlib import Path

import requests
from api.constants.functions import ExceptionLogger
from api.main import socketio
from api.models import Alerts, AlertsUser, Notifications, db
from api.util.email_trigger import send_email_smtp
from api.util.token_util import decode_token, encode_payload
from flask import Blueprint, current_app, g, request
from flask_socketio import join_room, leave_room, rooms
from sqlalchemy import and_

bp = Blueprint("notifications", __name__)
# socketio = SocketIO(bp, cors_allowed_origins="*")

widget_alert = None

secret = "9ba840b4-b130-11ed-a098-0242ac110003"


def notification_data(app_id, widgetId, widgetValue):
    try:
        alerts_by_widget = (
            Alerts.query.filter(
                and_(
                    Alerts.app_id == app_id,
                    Alerts.deleted_at.is_(None),
                    Alerts.app_screen_widget_id == widgetId,
                    Alerts.user_email == g.logged_in_email,
                    Alerts.receive_notification.is_(True),
                    Alerts.active.is_(True),
                )
            )
            .order_by(Alerts.id)
            .all()
        )
        alerts_user = {}
        for alert in alerts_by_widget:
            user = AlertsUser.query.filter(and_(AlertsUser.alert_id == alert.id, AlertsUser.deleted_at.is_(None))).all()
            alerts_user[alert.id] = user
        if len(alerts_by_widget) and widgetValue.get("alert_config", False):
            widget_alert = threading.Thread(
                target=widget_notification,
                args=(
                    widgetId,
                    widgetValue,
                    alerts_by_widget,
                    g.logged_in_email,
                    alerts_user,
                    current_app.config,
                ),
                daemon=True,
            )
            widget_alert.start()
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return False


def widget_notification(
    widgetId,
    widgetValue,
    alerts,
    user_email,
    alerts_user,
    app_config,
):
    try:
        time.sleep(2)
        data = {
            "id": None,
            # 'receive_notification': False,
            "message": "",
            "widget_name": "",
        }
        category = None
        if "alert_config" in widgetValue.keys():
            category = widgetValue.get("alert_config", False).get("categories", False)

        if alerts is not None and category:
            for alert in alerts:
                widget_name = alert.source_type.split(" >> ")[-1].title()
                data["widget_name"] = widget_name
                users_for_alert = alerts_user[alert.id]
                # create a user email list with initially with the alert owner
                alerts_email = [user_email]
                for user in users_for_alert:
                    alerts_email.append(user.user_email)
                time.sleep(2)
                if alert.condition == "above" and alert.threshold is not None:
                    if category[alert.category]["value"] > int(alert.threshold):
                        data["id"] = str(alert.app_id) + str(alert.app_screen_widget_id) + str(alert.id)
                        # data['receive_notification'] = alert.receive_notification
                        data["message"] = (
                            "The "
                            + category[alert.category]["name"]
                            + " for "
                            + alert.title
                            + " has reached above "
                            + str(alert.threshold)
                        )
                        time.sleep(2)
                        notification_title = alert.category + " Rise "
                        notifications_list = [
                            Notifications(
                                alert_id=alert.id,
                                app_id=alert.app_id,
                                widget_id=alert.app_screen_widget_id,
                                title=notification_title,
                                message=data["message"],
                                is_read=False,
                                user_email=email,
                                widget_name=widget_name,
                                shared_by=user_email if email != user_email else None,
                                additional_info=None,
                                type="Alerts",
                            )
                            for email in alerts_email
                        ]
                        db.session.bulk_save_objects(notifications_list, return_defaults=True)

                if alert.condition == "below" and alert.threshold is not None:
                    if category[alert.category]["value"] < int(alert.threshold):
                        data["id"] = str(alert.app_id) + str(alert.app_screen_widget_id) + str(alert.id)
                        # data['receive_notification'] = alert.receive_notification
                        data["message"] = (
                            "The "
                            + category[alert.category]["name"]
                            + " for "
                            + alert.title
                            + " has reached below "
                            + str(alert.threshold)
                        )
                        # time.sleep(3)
                        notification_title = alert.category + " Drop"
                        notifications_list = [
                            Notifications(
                                alert_id=alert.id,
                                app_id=alert.app_id,
                                widget_id=alert.app_screen_widget_id,
                                title=notification_title,
                                message=data["message"],
                                is_read=False,
                                user_email=email,
                                widget_name=widget_name,
                                shared_by=user_email if email != user_email else None,
                                additional_info=None,
                            )
                            for email in alerts_email
                        ]
                        db.session.bulk_save_objects(notifications_list, return_defaults=True)

                alert.active = False
                db.session.add(alert)
                db.session.flush()
                db.session.commit()
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
                    emit_notification(data, item.user_email)
                if data.get("id", False):
                    cover_photo_drop = f"{app_config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/cover-photo-notification-email-drop.png"
                    cover_photo_rise = f"{app_config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/cover-photo-notification-email-rise.png"
                    indication_graph_rise = (
                        f"{app_config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/value-rise-graph.png"
                    )
                    indication_graph_drop = (
                        f"{app_config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/value-dip-graph.png"
                    )

                    html_path = Path(__file__).parent.parent / "../email-templates/alert-notification.html"
                    html_template = open(html_path)
                    html = html_template.read().format(
                        blob_url=app_config["AZURE_BLOB_ROOT_URL"],
                        alert_name=alert.title,
                        alert_category=category[alert.category]["name"],
                        alert_condition=alert.condition,
                        alert_threshold=alert.threshold,
                        cover_photo=(cover_photo_rise if alert.condition == "above" else cover_photo_drop),
                        notification_condition=("drop" if alert.condition == "below" else "rise"),
                        notification_condition_caps=("Drop" if alert.condition == "below" else "Rise"),
                        widget_name=widget_name,
                        cur_data=category[alert.category]["value"],
                        link=alert.widget_url,
                        indication_graph=(
                            indication_graph_rise if alert.condition == "above" else indication_graph_drop
                        ),
                    )
                    html_template.close()
                    plain_text_path = Path(__file__).parent.parent / "../email-templates/alert-notification.txt"
                    plain_text_template = open(plain_text_path)
                    plain_text = plain_text_template.read().format(
                        alert_name=alert.title,
                        alert_category=category[alert.category]["name"],
                        alert_condition=alert.condition,
                        alert_threshold=alert.threshold,
                        widget_name=widget_name,
                        cur_data=category[alert.category]["value"],
                        link=alert.widget_url,
                    )
                    plain_text_template.close()

                    mail_subject = (
                        "Drop " + "in " + widget_name if alert.condition == "below" else "Rise " + "in " + widget_name
                    )
                    # mailData = {
                    #     "personalizations": [
                    #         {
                    #             "to": [{"email": email} for email in alerts_email],
                    #             "subject": mail_subject,
                    #         }
                    #     ],
                    #     "from": {"email": "test@example.com"},
                    #     "content": [
                    #         {"type": "text/plain", "value": plain_text},
                    #         {"type": "text/html", "value": html},
                    #     ],
                    # }
                    try:
                        send_email_smtp(
                            email_type="alert-notification",
                            To=alerts_email,
                            Subject=mail_subject,
                            body={"plain": plain_text, "html": html},
                            From=app_config["SHARE_EMAIL_SENDER"],
                            password=app_config["SHARE_EMAIL_PWD"],
                        )
                    except Exception as ex:
                        ExceptionLogger(ex)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return False
    finally:
        db.session.close()


@socketio.on("connect", namespace="/codx_product_notification")
def establish_connection(data):
    key = data["user_email"]
    join_room(key)
    logging.info(msg="codx product server established the connection")
    logging.info(str(data) + "logged in")


@socketio.on("user_session", namespace="/codx_product_notification")
def establish_user_connection(data):
    if data is not None:
        logging.info(str(data) + "logged in")
        key = str(data)
        join_room(key)
        # users[data] = request.sid


@socketio.on("init:codx_collab", namespace="/codx_product_notification")
def init_codx_collab(data):
    if data is not None:
        key = data.get("key", None)
        join_room(key)
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
                "sid": request.sid,
                "key": data.get("key", None),
                "session_initiated_at": now,
                "first_name": user_first_name,
                "last_name": user_last_name,
            },
            secret,
        )
        socketio.emit(
            "token:codx_collab#" + key,
            {"token": token, "session_initiated_at": now},
            namespace="/codx_product_notification",
            to=request.sid,
        )
        socketio.emit(
            "syn:codx_collab#" + key,
            {
                "from": {
                    "email": user_email,
                    "sid": request.sid,
                    "first_name": user_first_name,
                    "last_name": user_last_name,
                },
                "source_token": token,
            },
            namespace="/codx_product_notification",
            to=key,
            include_self=False,
        )


@socketio.on("ack:codx_collab", namespace="/codx_product_notification")
def ack_codx_collab(data):
    if data is not None:
        decoded_token = decode_token(data["token"], secret)
        key = decoded_token["key"]
        new_token_json = decode_token(data["to"], secret)
        new_token_json["session_initiated_at"] = decoded_token["session_initiated_at"]
        new_token = encode_payload(new_token_json, secret)

        socketio.emit(
            "ack:codx_collab#" + key,
            {
                "token": new_token,
                "state": data.get("state", None),
                "from": {
                    "email": decoded_token["upn"],
                    "sid": request.sid,
                    "first_name": decoded_token["first_name"],
                    "last_name": decoded_token["last_name"],
                },
                "session_initiated_at": decoded_token["session_initiated_at"],
            },
            namespace="/codx_product_notification",
            to=new_token_json["sid"],
        )


@socketio.on("edit:codx_collab", namespace="/codx_product_notification")
def edit_codx_collab(data):
    if data is not None:
        decoded_token = decode_token(data["token"], secret)
        key = decoded_token["key"]
        socketio.emit(
            "edit:codx_collab#" + key,
            {
                "state": data.get("state", None),
                "from": {
                    "email": decoded_token["upn"],
                    "sid": request.sid,
                    "first_name": decoded_token["first_name"],
                    "last_name": decoded_token["last_name"],
                },
                "session_initiated_at": decoded_token["session_initiated_at"],
            },
            namespace="/codx_product_notification",
            to=key,
            include_self=False,
        )


@socketio.on("stop:codx_collab", namespace="/codx_product_notification")
def stop_codx_collab(data):
    if data is not None:
        decoded_token = decode_token(data["token"], secret)
        key = decoded_token["key"]
        leave_room(key)
        socketio.emit(
            "stop:codx_collab#" + key,
            {
                "from": {
                    "email": decoded_token["upn"],
                    "sid": request.sid,
                    "first_name": decoded_token["first_name"],
                    "last_name": decoded_token["last_name"],
                }
            },
            namespace="/codx_product_notification",
            to=key,
            include_self=False,
        )


def emit_notification(
    data,
    user_email=None,
    event_type=False,
):
    if user_email:
        room = user_email
        socketio.emit(
            event_type if event_type else "app_notification",
            data,
            namespace="/codx_product_notification",
            to=room,
        )
        logging.debug("THIS IS A DEBUG LOGGER----> data being emitted")
        logging.debug(data)
    if not user_email:
        socketio.emit(
            event_type if event_type else "app_notification",
            data,
            namespace="/codx_product_notification",
        )
        logging.debug("THIS IS A DEBUG LOGGER----> data being emitted")
        logging.debug(data)


@socketio.on("disconnect", namespace="/codx_product_notification")
def disconnect_connection():
    _rooms = rooms()
    for room in _rooms:
        leave_room(room)
        socketio.emit(
            "stop:codx_collab#" + room,
            {"from": {"sid": request.sid}},
            namespace="/codx_product_notification",
            to=room,
            include_self=False,
        )
    logging.info("codx product server disconnected the connection")


# @socketio.on('event')
# def handle_my_custom_event(json):
#     print('received json: ' + str(json))


def trigger_custom_notification(socket_data, notification_type, user_email=False, access=False, additional_info={}):
    try:
        notification_access = json.loads(access)
        data = {}
        notifications_list = []
        if notification_type == "banner":
            data["title"] = socket_data["title"]
            data["message"] = socket_data["message"]
            emit_notification(data, user_email=None, event_type="banner_notification")

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
                        # (user_email if email != user_email else None) if user_email else (g.logged_in_email if email != g.logged_in_email else None)
                        # (user_token if email != user_token else None) if user_token else 'Platform notification'
                    )
                )

            db.session.bulk_save_objects(notifications_list, return_defaults=True)
            db.session.flush()
            db.session.commit()
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
                    emit_notification(
                        data,
                        item.user_email,
                        event_type=("app_notification" if item.app_id else "platform_notification"),
                    )

        if socket_data.get("mail_template", False):
            mail_template = socket_data["mail_template"]
            existing_users = get_all_platform_users()
            # mailData = {
            #     "personalizations": [
            #         {
            #             "to": [
            #                 {"email": email}
            #                 for email in list(
            #                     set(existing_users).intersection(socket_data["email"])
            #                 )
            #             ],
            #             "subject": mail_template["subject"],
            #         }
            #     ],
            #     "from": {"email": "test@example.com"},
            #     "content": [
            #         {"type": "text/plain", "value": mail_template["plain_text"]},
            #         {"type": "text/html", "value": mail_template["html"]},
            #     ],
            # }
            try:
                if notification_access["trigger_email_notification"]:
                    send_email_smtp(
                        email_type="custom-notification",
                        To=[email for email in list(set(existing_users).intersection(socket_data["email"]))],
                        Subject=mail_template["subject"],
                        body={
                            "plain": mail_template["plain_text"],
                            "html": mail_template["html"],
                        },
                    )
            except Exception as ex:
                ExceptionLogger(ex)
    except Exception as ex:
        ExceptionLogger(ex)
        raise Exception(ex)
    finally:
        db.session.close()


def get_all_platform_users():
    try:
        platform_users = requests.get(
            current_app.config["BACKEND_APP_URI"] + "/users-email",
            headers={"authorization": request.headers.get("authorization", None)},
        )
        return platform_users.json() or []
    except Exception as ex:
        ExceptionLogger(ex)
    finally:
        db.session.close()


@socketio.on("init_progress_loader_component", namespace="/codx_product_notification")
def create_room_progress_loader(data):
    if data is not None:
        room = (
            "progress_loader_" + str(data["app_id"]) + "#" + str(data["screen_name"]) + "#" + str(data["widget_name"])
        )
        join_room(room)


@socketio.on("close_progress_loader", namespace="/codx_product_notification")
def stop_progress_loader(data):
    if data is not None:
        room = (
            "progress_loader_" + str(data["app_id"]) + "#" + str(data["screen_name"]) + "#" + str(data["widget_name"])
        )
        leave_room(room)


def on_progress_loader(data):
    key = "progress_loader_" + str(data["app_id"]) + "#" + str(data["screen_name"]) + "#" + str(data["widget_name"])
    socketio.emit(key, data, namespace="/codx_product_notification", to=key)
