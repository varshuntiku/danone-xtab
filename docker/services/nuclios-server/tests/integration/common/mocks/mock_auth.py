import base64
import os
from datetime import datetime, timedelta, timezone

import jwt


def generate_mock_jwt_token():
    payload = {
        "exp": datetime.now(timezone.utc) + timedelta(days=1),
        "iat": datetime.now(timezone.utc),
        "sub": "system.user@admin.com",
        "iss": "codex-backend",
    }
    secret_key = os.environ.get("JWT_PRIVATE_KEY_ENCODED")
    base64_bytes = secret_key.encode("ascii")
    message_bytes = base64.b64decode(base64_bytes)
    secret_key = message_bytes.decode("ascii")
    token = jwt.encode(payload, secret_key, algorithm=os.environ.get("JWT_ALGORITHM"))
    return token
