#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
from functools import wraps

from api.auth import validate_token
from api.constants.functions import json_response
from flask import current_app as app
from flask import g, request
from jwt import exceptions


def login_required(f):
    """Takes a token and verifies its authority and checks for aud, iss, nbf and allows the user to login,

    get the user info from token details if the token is verified.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        try:
            authorization = request.headers.get("authorization", None)
            if not authorization:
                return json_response(
                    {
                        "status": "error",
                        "description": "No authorization token provided",
                    },
                    403,
                )
            token = authorization.split(" ")[1]
            validation_response = validate_token(token)
            if (
                type(validation_response) is dict
                and "status" in validation_response
                and validation_response["status"] == "success"
            ):
                pass
            else:
                return validation_response

            if (
                "sub" in validation_response["decoded_token"]
                and validation_response["decoded_token"]["iss"] == app.config["JWT_ENCODE_ISSUER"]
            ):
                email_address = validation_response["decoded_token"]["sub"]
            elif (
                "identity" in validation_response["decoded_token"]
                and validation_response["decoded_token"]["iss"] == app.config["JWT_ENCODE_ISSUER"]
            ):
                email_address = validation_response["decoded_token"]["identity"]
            # azure tokens
            elif "upn" in validation_response["decoded_token"]:
                email_address = validation_response["decoded_token"]["upn"].lower()
            elif "appid" in validation_response["decoded_token"]:
                email_address = "system-app@themathcompany.com"
            else:
                return json_response(
                    {
                        "status": "error",
                        "description": "could not match authorization token details",
                    },
                    403,
                )

            if email_address:
                g.logged_in_email = email_address

            g.auth_info = validation_response["decoded_token"]
            g.user_info = {"user": {"email": email_address}}
        except exceptions.DecodeError as identifier:
            return (
                json.dumps({"error": "invalid authorization token, " + str(identifier)}),
                403,
                {"Content-type": "application/json"},
            )

        return f(*args, **kwargs)

    return wrap
