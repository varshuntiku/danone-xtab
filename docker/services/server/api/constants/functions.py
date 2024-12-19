#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import html

from flask import jsonify, make_response
from html_sanitizer import Sanitizer
from sentry_sdk import capture_exception

sanitizer = Sanitizer()


def ExceptionLogger(ex):
    """Captures and logs the error

    Args:
        ex ([type]): [description]
    """
    try:
        capture_exception(ex)
    except Exception as e:
        capture_exception(e)


def get_args(req):
    """Generates list of key value pairs for given request

    Args:
        req ([type]): [description]

    Returns:
        dictionary: {x: value}
    """
    params = {x: req.args[x] for x in req.args.keys()}
    return params


def json_response(payload, status=200):
    headers = {"Content-Type": "application/json"}
    return make_response(jsonify(payload), status, headers)


def json_response_count(payload, status=200, count=0):
    headers = {
        "content-type": "application/json",
        "X-Total-Count": html.escape(str(count)),
        "Access-Control-Expose-Headers": "Content-Type, X-Total-Count",
    }
    return make_response(jsonify(payload), status, headers)


def sanitize_content(payload):
    if isinstance(payload, str):
        return sanitizer.sanitize(payload)
    elif isinstance(payload, dict):
        return {key: sanitize_content(value) for key, value in payload.items()}
    elif isinstance(payload, list):
        return [sanitize_content(value) for value in payload]
    else:
        return payload
