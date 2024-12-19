#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import logging

from app.services.user.user_service import UserService
from app.utils.auth.middleware import AuthMiddleware
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer

auth_scheme = HTTPBearer()
router = APIRouter()


@router.get("/get-info", status_code=200)
async def getInfo(
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)), user_service: UserService = Depends(UserService)
) -> dict:
    """returns user info.

    Raises:
        HTTPException: Raise exception if there is an error while fetching user info

    Returns:
        dict: Returns userinfo
    """
    try:
        obj = user_service.get_user_by_email(email=user_info["email"])
        return {
            "status": "success",
            "first_name": obj.first_name,
            "last_name": obj.last_name,
            "user_name": obj.email_address,
        }
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in Copilot app creation")
