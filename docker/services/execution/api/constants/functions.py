#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.
import gzip
import html
import json
import logging
import os

from flask import jsonify, make_response
from sentry_sdk import capture_exception


def fetchLoggerLevel():
    if os.environ.get("FLASK_LOGGER_LEVEL"):
        if os.environ.get("FLASK_LOGGER_LEVEL") == "debug":
            return logging.DEBUG
        elif os.environ.get("FLASK_LOGGER_LEVEL") == "info":
            return logging.INFO
        elif os.environ.get("FLASK_LOGGER_LEVEL") == "warning":
            return logging.WARNING
        elif os.environ.get("FLASK_LOGGER_LEVEL") == "error":
            return logging.ERROR
        elif os.environ.get("FLASK_LOGGER_LEVEL") == "critical":
            return logging.CRITICAL
    else:
        return logging.WARNING


logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%d-%b-%y %H:%M:%S",
    level=fetchLoggerLevel(),
)


def ExceptionLogger(ex, log_exception=True):
    """Captures and log the error

    Args:
        ex ([Exception]): [Exception object]
    """
    logging.exception("Exception Occurred")
    if log_exception:
        capture_exception(ex)


def get_args(req):
    """returns key value pairs for given request

    Args:
        req ([type]): [description]

    Returns:
        dictionary : {x: value}
    """
    params = {x: req.args[x] for x in req.args.keys()}
    return params


def json_response(response, status=200, content_encoding=None):
    headers = {"content-type": "application/json"}
    if content_encoding is None:
        return (jsonify(response), status, headers)
    elif content_encoding == "gzip":
        return (gzip.compress(bytes(json.dumps(response), "utf-8")), status, headers)


def json_response_count(payload, status=200, count=0):
    headers = {
        "content-type": "application/json",
        "X-Total-Count": html.escape(str(count)),
        "Access-Control-Expose-Headers": "Content-Type, X-Total-Count",
    }
    return make_response(jsonify(payload), status, headers)


def get_clean_postdata(request):
    response = (
        jsonify(json.loads(gzip.decompress(request.data).decode("utf-8")))
        if request.content_encoding == "gzip"
        else jsonify(json.loads(request.data))
    )
    return response.json
