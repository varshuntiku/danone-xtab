import json
import logging
import urllib
from datetime import datetime, timedelta
from typing import Dict

from api.configs.settings import get_app_settings
from api.constants.auth.auth_error_messages import AuthErrors
from api.constants.users.user_error_messages import UserErrors
from api.middlewares.error_middleware import AuthenticationException, GeneralException
from cryptography.hazmat.primitives import serialization
from fastapi import status
from jwt import (
    ExpiredSignatureError,
    MissingRequiredClaimError,
    algorithms,
    decode,
    encode,
    get_unverified_header,
)

settings = get_app_settings()
secret = "55f6801c3187b2360340a676788b6bff"


def _validate_azure_token(token: str, aud: str) -> Dict:
    """
    Validates azure AD token

    Args:
        token: encoded token
        aud:

    Returns:
        Decoded token if token valid
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
            raise AuthenticationException(
                message=AuthErrors.TOKEN_EXPIRED_ERROR, status_code=status.HTTP_401_UNAUTHORIZED
            )
        except MissingRequiredClaimError:
            raise AuthenticationException(
                message=AuthErrors.TOKEN_CLAIMS_ERROR,
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        except Exception:
            raise AuthenticationException(
                message=AuthErrors.TOKEN_PARSE_ERROR,
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        return {"status": "success", "decoded_token": payload}
    else:
        raise AuthenticationException(
            message=AuthErrors.TOKEN_INVALID_ERROR,
            status_code=status.HTTP_403_FORBIDDEN,
        )


def _validate_db_user(token: str) -> Dict:
    """
    Validates db user token

    Args:
        token: encoded token

    Returns:
        Decoded token if token valid
        Error message if there a problem with the token
    """
    try:
        payload = decode(
            token,
            key=settings.get_public_key,
            algorithms=[settings.JWT_ALGORITHM or "RS256"],
            issuer=settings.JWT_ENCODE_ISSUER,
        )
    except ExpiredSignatureError:
        raise AuthenticationException(
            message={"error": AuthErrors.TOKEN_EXPIRED_ERROR.value}, status_code=status.HTTP_401_UNAUTHORIZED
        )
    except MissingRequiredClaimError:
        raise AuthenticationException(
            message={"error": AuthErrors.TOKEN_CLAIMS_ERROR.value}, status_code=status.HTTP_401_UNAUTHORIZED
        )
    except Exception:
        raise AuthenticationException(
            message={"error": AuthErrors.TOKEN_PARSE_ERROR.value},
            status_code=status.HTTP_403_FORBIDDEN,
        )
    return {"status": "success", "decoded_token": payload}


def validate_token(token: str) -> Dict:
    """
    Validates jwt access token

    Args:
        token: encoded token

    Returns:
        Decoded token if token valid
        Error message if there a problem with the token
    """
    try:
        resp = decode(
            jwt=token,
            key=settings.get_public_key,
            algorithms=[settings.JWT_ALGORITHM or "RS256"],
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
            raise AuthenticationException(
                message={"error": AuthErrors.UNKNOWN_TOKEN_ERROR.value}, status_code=status.HTTP_403_FORBIDDEN
            )
    except Exception as e:
        logging.exception(e)
        raise AuthenticationException(
            message={"error": AuthErrors.TOKEN_PARSE_ERROR.value + " " + str(e)},
            status_code=status.HTTP_403_FORBIDDEN,
        )


def encode_payload(
    payload: dict, secret: str = settings.TOKEN_SECRET_KEY, algorithm: str = settings.JWT_ALGORITHM
) -> str:
    """Encodes the payload using the secret key

    Args:
        payload ([type]): [description]
        secret ([type], optional): [description]. Defaults to None.

    Returns:
        string: Hash token
    """
    return encode(payload, secret, algorithm=algorithm)


def decode_token(token: str):
    """Decodes the token using secret key

    Args:
        token ([type]): [description]
        secret ([type], optional): [description]. Defaults to None.

    Returns:
        string: payload
    """
    try:
        return decode(
            jwt=token,
            key=None,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_signature": False},
        )
    except Exception as e:
        logging.exception(e)
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_TOKEN_DECODE_ERROR.value},
        )


def get_password_token(user_id: int, user_email: str) -> str:
    """Creates the password token for the user given his id and email

    Args:
        user_id: user id
        user_email: user email address

    Returns:
        Returns the hash token
    """
    payload = {
        "exp": datetime.utcnow() + timedelta(minutes=5),  # expiry time
        "iat": datetime.utcnow(),  # issued at
        "sub": "password_reset_token",  # subject
        "user_id": user_id,
        "user_email": user_email,
    }
    return encode_payload(payload)
