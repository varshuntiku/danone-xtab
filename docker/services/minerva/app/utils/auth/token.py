#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from app.utils.config import get_settings
from jwt import decode, encode

settings = get_settings()
DEFAULT_SECRET = "55f6801c3187b2360340a676788b6bff"


def encode_payload(payload: dict, secret: str = DEFAULT_SECRET):
    """Encodes the payload using the secret key

    Args:
        payload ([type]): [description]
        secret ([type], optional): [description]. Defaults to None.

    Returns:
        string: Hash token
    """
    return encode(payload, secret, algorithm="HS256")


def decode_token(token: str, secret: str = DEFAULT_SECRET, audience=None):
    """Decodes the token using secret key

    Args:
        token ([type]): [description]
        secret ([type], optional): [description]. Defaults to None.

    Returns:
        string: payload
    """
    return decode(token, secret, algorithms="HS256", audience=audience)
