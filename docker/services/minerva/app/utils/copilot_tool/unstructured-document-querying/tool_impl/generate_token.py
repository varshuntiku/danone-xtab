import time

import jwt


def generate_token():
    payload = {"iss": "copilot_udq_innovation_identifier", "exp": time.time() + 1800}
    secret_key = "5fec431c426c2ad323d0f1d0350a627169253aed366cf41420cb431b78c771eb"
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token
