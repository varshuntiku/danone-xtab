#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import urllib

from app.utils.config import get_settings
from cryptography.hazmat.primitives import serialization
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from jwt import (
    ExpiredSignatureError,
    MissingRequiredClaimError,
    algorithms,
    decode,
    get_unverified_header,
)

auth_scheme = HTTPBearer()

settings = get_settings()


def validate_nuclios_token(token):
    try:
        if not token:
            raise HTTPException(detail="No authorization token provided", status_code=401)
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
            and validation_response["decoded_token"]["iss"] == settings.JWT_ENCODE_ISSUER
        ):
            email_address = validation_response["decoded_token"]["sub"]
        elif (
            "identity" in validation_response["decoded_token"]
            and validation_response["decoded_token"]["iss"] == settings.JWT_ENCODE_ISSUER
        ):
            email_address = validation_response["decoded_token"]["identity"]
        # azure tokens
        elif "upn" in validation_response["decoded_token"]:
            email_address = validation_response["decoded_token"]["upn"].lower()
        elif "appid" in validation_response["decoded_token"]:
            email_address = "system-app@themathcompany.com"
        else:
            raise HTTPException(detail="could not match authorization token details", status_code=403)
        user_info = validation_response["decoded_token"]
        user_info["email"] = email_address
        return user_info
    except HTTPException as ex:
        raise ex


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
        "https://login.microsoftonline.com/" + settings.AZURE_OAUTH_TENANCY + "/discovery/v2.0/keys"
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
                algorithms=[settings.JWT_ALGORITHM],
                audience=aud if aud else settings.AZURE_OAUTH_APPLICATION_ID,
                issuer="https://sts.windows.net/" + settings.AZURE_OAUTH_TENANCY + "/",
            )
        except ExpiredSignatureError:
            raise HTTPException(detail="token is expired", status_code=401)
        except MissingRequiredClaimError:
            raise HTTPException(detail="incorrect claims, please check the audience and issue", status_code=401)
        except Exception:
            raise HTTPException(detail="Unable to parse authentication token.", status_code=401)
        return {"status": "success", "decoded_token": payload}
    else:
        raise HTTPException(detail="Unable to validate token, authority params are wrong", status_code=403)


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
            key=settings.get_public_key,
            algorithms=settings.JWT_ALGORITHM,
            issuer=settings.JWT_ENCODE_ISSUER,
        )
    except ExpiredSignatureError:
        raise HTTPException(detail="token has expired", status_code=401)
    except MissingRequiredClaimError:
        raise HTTPException(detail="incorrect claims, please check the audience and issuer", status_code=403)
    except Exception:
        raise HTTPException(detail="Unable to parse authentication token", status_code=401)
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
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_signature": False},
        )
        if resp["iss"] == settings.JWT_ENCODE_ISSUER:
            return _validate_db_user(token)
        elif resp["iss"] == "https://sts.windows.net/" + settings.AZURE_OAUTH_TENANCY + "/":
            return _validate_azure_token(
                token,
                aud="api://" + settings.AZURE_OAUTH_APPLICATION_ID
                if resp["aud"].startswith("api://")
                else settings.AZURE_OAUTH_APPLICATION_ID,
            )
        else:
            raise HTTPException(detail="Unrecognized token", status_code=401)
    except Exception:
        raise HTTPException(detail="Unable to parse authentication token", status_code=401)
