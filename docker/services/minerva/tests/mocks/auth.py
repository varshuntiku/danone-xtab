# import logging
import base64
from datetime import datetime, timedelta, timezone

import jwt
from app.services.user.user_service import UserService
from app.utils.config import get_settings
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

auth_scheme = HTTPBearer()


def generate_jwt_token():
    settings = get_settings()
    payload = {
        "exp": datetime.now(timezone.utc) + timedelta(days=1),
        "iat": datetime.now(timezone.utc),
        "sub": "copilot@ee.com",
        "iss": "codex-backend",
    }
    secret_key = settings.JWT_PRIVATE_KEY_ENCODED
    base64_bytes = secret_key.encode("ascii")
    message_bytes = base64.b64decode(base64_bytes)
    secret_key = message_bytes.decode("ascii")
    token = jwt.encode(payload, secret_key, algorithm=settings.JWT_ALGORITHM)
    # logging.info(f"Gen Token Called!! {token}")
    return token


def mock_auth_middleware(
    token: HTTPAuthorizationCredentials = Depends(auth_scheme),
    request: Request = None,
    access_key: str = None,
    db=Depends(),
    user_service: UserService = Depends(),
):
    settings = get_settings()
    user_info = jwt.decode(
        key=settings.JWT_PUBLIC_KEY_ENCODED,
        algorithms=settings.JWT_ALGORITHM,
        issuer=settings.JWT_ENCODE_ISSUER,
    )
    return user_info


def mock_validate_copilot_tool_auth_token(
    token: HTTPAuthorizationCredentials = Depends(auth_scheme), copilot_app_tool_id: int = None
):
    return {
        "exp": datetime.now(timezone.utc) + timedelta(days=1),
        "iat": datetime.now(timezone.utc),
        "sub": "copilot@ee.com",
        "iss": "codex-backend",
    }
