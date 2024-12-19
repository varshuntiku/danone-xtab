#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


from app.db.crud.minerva_consumer_crud import minerva_consumer
from app.utils.auth.consumer_token_validator import validate_consumer_token
from app.utils.auth.nuclios_token_validator import validate_nuclios_token
from app.utils.config import get_settings
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from jwt import exceptions

auth_scheme = HTTPBearer()

settings = get_settings()


def validate_user_auth_token(token: str, db, request_origin: str = "", access_key: str = ""):
    """Takes a token and verifies its authority and checks for aud, iss, nbf and allows the user to authenticate,

    get the user info from token details if the token is verified.
    """
    try:
        user_info = None
        try:
            if not access_key:
                user_info = validate_nuclios_token(token)
            if not user_info:
                pass
            else:
                return user_info
        except HTTPException:
            pass

        if access_key:
            consumer = minerva_consumer.get_by_access_key(db=db, access_key=access_key)
            if not request_origin or request_origin in consumer.allowed_origins:
                user_info = None
                for agent in consumer.auth_agents:
                    try:
                        user_info = validate_consumer_token(token, agent)
                    except HTTPException:
                        pass
                    if user_info:
                        break
                if user_info:
                    return user_info
                else:
                    raise HTTPException(detail="Authorization failed.", status_code=403)
            else:
                raise HTTPException(detail="Unauthorized Origin.", status_code=403)
        else:
            raise HTTPException(detail="Authorization failed.", status_code=403)
    except exceptions.DecodeError as identifier:
        raise HTTPException(detail="invalid authorization token, " + str(identifier), status_code=403)
