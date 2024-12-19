#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


from functools import reduce

from app.utils.auth.token_public_keys import get_public_key
from app.utils.config import get_settings
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from jwt import ExpiredSignatureError, MissingRequiredClaimError, decode

auth_scheme = HTTPBearer()

settings = get_settings()


def validate_consumer_token(token, agent):
    try:
        match agent.get("type"):
            case "azure_ad":
                tenant_id = agent.get("config").get("tenant_id")
                audience = agent.get("config").get("audience")

                if tenant_id:
                    discovery_url = (
                        "https://login.microsoftonline.com/{tenant_id}/.well-known/openid-configuration".format(
                            tenant_id=tenant_id
                        )
                    )
                else:
                    discovery_url = "https://login.microsoftonline.com/common/.well-known/openid-configuration"
                public_key = get_public_key(token=token, discovery_url=discovery_url)
                decoded_token = decode(token, public_key, algorithms=["RS256"], audience=audience)

                user_info = decoded_token
                if "upn" in decoded_token:
                    email_address = decoded_token["upn"].lower()
                user_info["email"] = email_address
                return user_info
            case "cognito":
                region = agent.get("config").get("region")
                user_pool_id = agent.get("config").get("user_pool_id")
                audience = agent.get("config").get("audience")

                discovery_url = (
                    "https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration".format(
                        region=region, user_pool_id=user_pool_id
                    )
                )

                public_key = get_public_key(token=token, discovery_url=discovery_url)
                decoded_token = decode(token, public_key, algorithms=["RS256"], audience=audience)

                user_info = decoded_token
                return user_info
            case "jwt":
                secret_key = agent.get("config").get("public_key", None)
                token_algorithms = (
                    agent["config"]["jwt_algorithm"]
                    if agent.get("config").get("jwt_algorithm")
                    else settings.JWT_ALGORITHM
                )
                if secret_key:
                    decoded_token = decode(token, key=secret_key, algorithms=token_algorithms)
                else:
                    decoded_token = decode(token, options={"verify_signature": False}, algorithms=token_algorithms)
                user_info = decoded_token
                email_property_key: str = agent.get("config").get("email_property_key")
                user_info["email"] = reduce(lambda x, y: x.get(y, {}), email_property_key.split("."), decoded_token)
                return user_info
            case _:
                raise HTTPException(detail="Unknown consumer agent", status_code=404)
    except ExpiredSignatureError:
        raise HTTPException(detail="token is expired", status_code=401)
    except MissingRequiredClaimError:
        raise HTTPException(detail="incorrect claims, please check the audience and issue", status_code=401)
    except Exception:
        raise HTTPException(detail="Unable to parse authentication token.", status_code=401)
