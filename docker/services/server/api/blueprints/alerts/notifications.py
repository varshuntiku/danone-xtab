#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


from api.main import socketio
from flask import Blueprint

bp = Blueprint("notifications", __name__)
# socketio = SocketIO(bp, cors_allowed_origins="*")


# @socketio.on('connect', namespace='/codx_platform_notification')
# def establish_connection():
#     print("codx platform server established the connection")


# @socketio.on('notification')


def emit_notification(type, data):
    socketio.emit(type, data, namespace="/codx_platform_notification")


@socketio.on("disconnect", namespace="/codx_platform_notification")
def disconnect_connection():
    print("codx platform server disconnected the connection")


# @socketio.on('event')
# def handle_my_custom_event(json):
#     print('received json: ' + str(json))
