import hashlib
import logging
import pathlib
from datetime import datetime, timedelta
from typing import Any, Union

from api.configs.settings import get_app_settings
from api.middlewares.error_middleware import AuthenticationException
from api.models.base_models import User
from fastapi import status
from jose import jwt
from passlib.context import CryptContext
from werkzeug.security import safe_str_cmp

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

settings = get_app_settings()

root = str(pathlib.Path(__file__).resolve().parent.parent.parent.parent)

ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES  # 65 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = settings.REFRESH_TOKEN_EXPIRE_MINUTES  # 14 days
JWT_ALGORITHM = settings.JWT_ALGORITHM
JWT_PRIVATE_KEY_ENCODED = settings.get_private_key
JWT_ENCODE_ISSUER = settings.JWT_ENCODE_ISSUER


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
    except Exception as e:
        logging.debug(e)
        raise AuthenticationException(message="Authentication failed.", status_code=status.HTTP_401_UNAUTHORIZED)


def identity(username):
    """Returns user info from database by filtering using username in email

    Args:
        username ([String]): [username]

    Returns:
        string: [user details]
    """
    user = User.query.filter_by(email_address=username.lower()).first()
    return user


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def create_access_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "exp": expires_delta,
        "sub": str(subject),
        "iss": JWT_ENCODE_ISSUER,
        "type": "access",
    }
    encoded_jwt = jwt.encode(to_encode, JWT_PRIVATE_KEY_ENCODED, JWT_ALGORITHM)
    return encoded_jwt


def create_refresh_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "exp": expires_delta,
        "sub": str(subject),
        "iss": JWT_ENCODE_ISSUER,
        "type": "refresh",
    }
    encoded_jwt = jwt.encode(to_encode, JWT_PRIVATE_KEY_ENCODED, JWT_ALGORITHM)
    return encoded_jwt
