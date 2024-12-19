#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import jwt
from flask import current_app


def encode_payload(payload, secret=None):
    """Encodes the payload using the secret key

    Args:
        payload ([type]): [description]
        secret ([type], optional): [description]. Defaults to None.

    Returns:
        string: Hash token
    """
    secret = secret if secret else current_app.config["TOKEN_SECRET_KEY"]
    return jwt.encode(payload, secret, algorithm="HS256")


def decode_token(token, secret=None):
    """Decodes the token using secret key

    Args:
        token ([type]): [description]
        secret ([type], optional): [description]. Defaults to None.

    Returns:
        string: payload
    """
    secret = secret if secret else current_app.config["TOKEN_SECRET_KEY"]
    return jwt.decode(token, secret, algorithms="HS256")
