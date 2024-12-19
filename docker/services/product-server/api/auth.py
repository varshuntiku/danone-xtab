#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import hashlib
import json
import urllib

from api.constants.functions import ExceptionLogger, json_response
from api.db_models.user_management.users import User
from cryptography.hazmat.primitives import serialization
from flask import current_app as app
from jwt import (
    ExpiredSignatureError,
    MissingRequiredClaimError,
    algorithms,
    decode,
    get_unverified_header,
)
from werkzeug.security import safe_str_cmp


class CodxUser(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id


users = [
    CodxUser(1, "test", "56M2020"),
]

username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}


def authenticate(user, password):
    """Compares the hashed password against the stored password in database for user and returns user if password matches
    for authentication]

    Args:
        username ([String]): [username]
        password ([String]): [password]

    Returns:
        string: [user details]
    """
    try:
        # print(user.password_hash)
        if user and safe_str_cmp(
            user.password_hash,
            hashlib.pbkdf2_hmac(
                "sha256",
                password.encode("utf-8"),
                "codxauth".encode("utf-8"),
                100000,
                dklen=128,
            ),
        ):
            return user
    except Exception as ex:
        return ex


def identity(username):
    """Returns user info from database by filtering using username in email

    Args:
        username ([String]): [username]

    Returns:
        string: [user details]
    """
    user = User.query.filter_by(email_address=username.lower()).first()
    return user


def _validate_azure_token(token, aud):
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
                audience=aud if aud else app.config["AZURE_OAUTH_APPLICATION_ID"],
                issuer="https://sts.windows.net/" + app.config["AZURE_OAUTH_TENANCY"] + "/",
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
        except Exception as error:
            return json_response(
                {
                    "status": "error",
                    "description": "Unable to parse authentication token.",
                    "error": error,
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
    except Exception as e:
        return json_response(
            {
                "status": "error",
                "description": "Unable to parse authentication token.",
                "error": e,
            },
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
            return _validate_azure_token(
                token,
                aud=(
                    "api://" + app.config["AZURE_OAUTH_APPLICATION_ID"]
                    if resp["aud"].startswith("api://")
                    else app.config["AZURE_OAUTH_APPLICATION_ID"]
                ),
            )
        else:
            return json_response({"status": "error", "description": "Unrecognized token"}, 403)
    except Exception as e:
        ExceptionLogger(e)
        return json_response(
            {
                "status": "error",
                "description": "Unable to parse authentication token.",
                "error": e,
            },
            403,
        )
