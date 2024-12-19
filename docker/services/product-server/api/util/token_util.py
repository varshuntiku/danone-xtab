#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import jwt
from api.constants.functions import ExceptionLogger
from api.models import UserToken, db
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


def validate_execution_token(token):
    try:
        token_detail = token.split(" ")[1]
        data = decode_token(token_detail)
        user_token_details = UserToken.query.filter(
            UserToken.execution_token == token_detail,
            UserToken.user_email == data.get("sub"),
        ).first()

        if user_token_details:
            return user_token_details
        else:
            raise Exception("Invalid token")
    except Exception as ex:
        ExceptionLogger(ex)
    finally:
        db.session.close()
