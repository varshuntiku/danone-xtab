import json
import logging
import urllib

from api.configs.settings import get_app_settings
from api.middlewares.error_middleware import AuthenticationException
from cryptography.hazmat.primitives import serialization
from fastapi import HTTPException, status
from jwt import (
    ExpiredSignatureError,
    MissingRequiredClaimError,
    algorithms,
    decode,
    encode,
    exceptions,
    get_unverified_header,
)

settings = get_app_settings()
secret = "55f6801c3187b2360340a676788b6bff"


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
            raise AuthenticationException(message="token is expired", status_code=status.HTTP_401_UNAUTHORIZED)
        except MissingRequiredClaimError:
            raise AuthenticationException(
                message="incorrect claims, please check the audience and issue",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception:
            raise AuthenticationException(
                message="Unable to parse authentication token.",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        return {"status": "success", "decoded_token": payload}
    else:
        raise AuthenticationException(
            message="Unable to validate token, authority params are wrong",
            status_code=status.HTTP_403_FORBIDDEN,
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
            key=settings.get_public_key,
            algorithms=settings.JWT_ALGORITHM,
            issuer=settings.JWT_ENCODE_ISSUER,
        )
    except ExpiredSignatureError:
        raise HTTPException(detail="token has expired", status_code=status.HTTP_401_UNAUTHORIZED)
    except MissingRequiredClaimError:
        raise AuthenticationException(
            message="incorrect claims, please check the audience and issuer",
            status_code=status.HTTP_403_FORBIDDEN,
        )
    except Exception:
        raise AuthenticationException(
            message="Unable to parse authentication token",
            status_code=status.HTTP_401_UNAUTHORIZED,
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
            raise AuthenticationException(message="Unrecognized token", status_code=401)
    except exceptions.DecodeError as e:
        logging.exception(e)
        raise AuthenticationException(
            message="invalid authorization token, " + str(e),
            status_code=status.HTTP_403_FORBIDDEN,
        )


def encode_payload(payload: dict):
    """Encodes the payload using the secret key

    Args:
        payload ([type]): [description]
        secret ([type], optional): [description]. Defaults to None.

    Returns:
        string: Hash token
    """
    return encode(payload, secret, algorithm=[settings.JWT_ALGORITHM])


def decode_token(token: str):
    """Decodes the token using secret key

    Args:
        token ([type]): [description]
        secret ([type], optional): [description]. Defaults to None.

    Returns:
        string: payload
    """
    return decode(
        jwt=token,
        key=None,
        algorithms=[settings.JWT_ALGORITHM],
        options={"verify_signature": False},
    )
