#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


import logging

from api.constants.functions import ExceptionLogger, json_response
from api.helpers import get_clean_postdata
from api.main import socketio
from flasgger.utils import swag_from
from flask import Blueprint, request

bp = Blueprint("AppWidget", __name__)
generic_err_message = "Error while Updating State"


def emit_updated_widget_state(data):
    socketio.emit("widget_progress_update", data, namespace="/codx_product_notification")
    logging.debug("THIS IS A DEBUG LOGGER----> data being emitted")
    logging.debug(data)


@bp.route("/codex-product-api/widget", methods=["GET"])
@swag_from("../../documentation/experimental_docs/app_widget/app_widget_state_update.yml")
# @login_required
def update_widget_state():
    try:
        state_data = get_clean_postdata(request)
        emit_updated_widget_state(state_data)

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)

        return json_response({"status": "error", "error": generic_err_message}, 500)
