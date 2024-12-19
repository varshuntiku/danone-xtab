#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import urllib

from api.constants.functions import ExceptionLogger, json_response
from cryptography.hazmat.primitives import serialization
from flask import current_app as app
from jwt import (
    ExpiredSignatureError,
    MissingRequiredClaimError,
    algorithms,
    decode,
    get_unverified_header,
)


def _validate_azure_token(token):
    """
    Validates azure AD token

    Args:
        encoded token

    Returns:
        decoded token if token valid
        Error message if there a problem with the token
    """
    jsonurl = urllib.request.urlopen(
        "https://login.microsoftonline.com/" + app.config["AZURE_OAUTH_TENANCY"] + "/discovery/v2.0/keys"
    )
    jwks = json.loads(jsonurl.read())
    unverified_header = get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
    if rsa_key:
        try:
            rsa_pem_key = algorithms.RSAAlgorithm.from_jwk(json.dumps(rsa_key))
            rsa_pem_key_bytes = rsa_pem_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo,
            )
            payload = decode(
                token,
                rsa_pem_key_bytes,
                algorithms=[app.config.get("JWT_ALGORITHM", "RS256")],
                audience=app.config["AZURE_OAUTH_APPLICATION_ID"],
                issuer="https://sts.windows.net/" + app.config["AZURE_OAUTH_TENANCY"] + "/",
                leeway=300,
                options={"verify_exp": False},
            )
        except ExpiredSignatureError:
            return json_response(
                {
                    "status": "error",
                    "code": "token_expired",
                    "description": "token is expired",
                },
                401,
            )
        except MissingRequiredClaimError:
            return json_response(
                {
                    "status": "error",
                    "code": "invalid_claims",
                    "description": "incorrect claims, please check the audience and issuer",
                },
                401,
            )
        except Exception:
            return json_response(
                {
                    "status": "error",
                    "description": "Unable to parse authentication token.",
                },
                401,
            )
        return {"status": "success", "decoded_token": payload}
    else:
        return json_response(
            {
                "status": "error",
                "description": "invalid token, authority params are wrong",
            },
            403,
        )


def _validate_db_user(token):
    """
    Validates db user token

    Args:
        encoded token

    Returns:
        decoded token if token valid
        Error message if there a problem with the token
    """
    try:
        payload = decode(
            token,
            key=app.config["JWT_PUBLIC_KEY"],
            algorithms=[app.config.get("JWT_ALGORITHM", "RS256")],
            issuer=app.config["JWT_ENCODE_ISSUER"],
            leeway=300,
        )
    except ExpiredSignatureError:
        return json_response(
            {
                "status": "error",
                "code": "token_expired",
                "description": "token is expired",
            },
            401,
        )
    except MissingRequiredClaimError:
        return json_response(
            {
                "status": "error",
                "code": "invalid_claims",
                "description": "incorrect claims, please check the audience and issuer",
            },
            401,
        )
    except Exception:
        return json_response(
            {"status": "error", "description": "Unable to parse authentication token."},
            403,
        )
    return {"status": "success", "decoded_token": payload}


def validate_token(token):
    """
    Validates jwt access token

    Args:
        encoded token

    Returns:
        decoded token if token valid
        Error message if there a problem with the token
    """
    try:
        resp = decode(
            jwt=token,
            key=None,
            algorithms=[app.config.get("JWT_ALGORITHM", "RS256")],
            options={"verify_signature": False},
        )
        if resp["iss"] == app.config["JWT_ENCODE_ISSUER"]:
            return _validate_db_user(token)
        elif resp["iss"] == "https://sts.windows.net/" + app.config["AZURE_OAUTH_TENANCY"] + "/":
            return _validate_azure_token(token)
        else:
            return json_response({"status": "error", "description": "Unrecognized token"}, 403)
    except Exception as e:
        ExceptionLogger(e)
        return json_response(
            {"status": "error", "description": "Unable to parse authentication token."},
            403,
        )
