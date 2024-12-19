#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging
from typing import Annotated, Any

from app.dependencies.dependencies import get_db
from app.schemas.nuclios_user import UserCreate
from app.services.user.user_service import UserService
from app.utils.auth.token import decode_token
from app.utils.auth.validators import validate_user_auth_token
from app.utils.config import get_settings
from fastapi import Depends, Header, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

auth_scheme = HTTPBearer()

settings = get_settings()

client_email_domain = settings.CLIENT_EMAIL_DOMAIN


def validate_user(
    token: HTTPAuthorizationCredentials = Depends(auth_scheme),
    request: Request = {},
    access_key: str = None,
    db=Depends(get_db),
):
    """Takes a token and verifies its authority and checks for aud, iss, nbf and allows the user to authenticate,

    get the user info from token details if the token is verified.
    """
    try:
        return validate_user_auth_token(
            token=token.credentials, db=db, request_origin=request.headers.get("origin"), access_key=access_key
        )
    except Exception as e:
        logging.exception(e)
        raise e


def validate_auth_token(token: Annotated[str, Header()]):
    """Takes a token and verifies its authority and checks for aud, iss, sub
    and allows the token to authenticate itself to perform the operation,

    get the token info from token details if the token is verified.
    """
    try:
        token_data = decode_token(token, audience="bg_job_engine")

        if token_data.get("sub") == "job_status_update" and token_data.get("iss") == "minerva_server":
            return token_data
        else:
            raise TypeError("Token subject or issuer mismatch")
    except Exception as e:
        raise HTTPException(detail="error validating token details, " + str(e), status_code=403)


def validate_copilot_tool_auth_token(
    token: HTTPAuthorizationCredentials = Depends(auth_scheme), copilot_app_tool_id: int = None
):
    """Takes a token and verifies its authority and checks for aud, iss, sub, copilot_tool_id
    and allows the token to authenticate itself to perform the operation,

    get the token info from token details if the token is verified.
    """
    try:
        token_data = decode_token(token.credentials, audience="copilot_tool_task")

        if (
            token_data.get("sub") == "job_status_update"
            and token_data.get("iss") == "minerva_server"
            and token_data.get("copilot_tool_id") == copilot_app_tool_id
        ):
            return token_data
        else:
            raise TypeError("Token subject or issuer mismatch")
    except Exception as e:
        raise HTTPException(detail="error validating token details, " + str(e), status_code=403)


class AuthMiddleware:
    fetch_user_id: bool = False
    auth_context = None

    def __init__(self, fetch_user_id: bool = False) -> None:
        self.fetch_user_id = fetch_user_id

    def __call__(
        self,
        token: HTTPAuthorizationCredentials = Depends(auth_scheme),
        request: Request = {},
        access_key: str = None,
        db=Depends(get_db),
        user_service: UserService = Depends(UserService),
    ) -> Any:
        try:
            user_info = validate_user_auth_token(
                token=token.credentials, request_origin=request.headers.get("origin"), access_key=access_key, db=db
            )
            if self.fetch_user_id and user_info["email"] and not access_key:
                user_id = user_service.get_user_id_by_email(email=user_info["email"])
                if user_id:
                    user_info["user_id"] = user_id
                elif client_email_domain in user_info["email"]:
                    user_obj = UserCreate(
                        email_address=user_info["email"] or user_info["upn"],
                        first_name=user_info["name"].split(" ")[0] if user_info["name"] else "",
                        last_name=user_info["name"].split(" ")[-1] if user_info["name"] else "",
                    )
                    result = user_service.create_user(obj_in=user_obj)
                    user_info["user_id"] = result.id

            # Adding authentication token for calling platform APIs
            user_info["auth_token"] = token.credentials
            return user_info
        except Exception as e:
            logging.exception(e)
            raise e


class URIAuthMiddleware:
    fetch_user_id: bool = False
    auth_context = None

    def __init__(self, fetch_user_id: bool = False) -> None:
        self.fetch_user_id = fetch_user_id

    def __call__(
        self,
        request: Request = {},
        access_key: str = None,
        db=Depends(get_db),
        user_service: UserService = Depends(UserService),
    ) -> Any:
        try:
            print("inside media middleware")
            token: HTTPAuthorizationCredentials = None
            if "Authorization" in request.headers:
                auth_header = request.headers["Authorization"]
                if auth_header.startswith("Bearer "):
                    token = auth_header.split(" ")[1]
            if not token:
                token = request.query_params.get("uri_token")
            user_info = validate_user_auth_token(
                token=token, request_origin=request.headers.get("origin"), access_key=access_key, db=db
            )
            if self.fetch_user_id and user_info["email"] and not access_key:
                user_id = user_service.get_user_id_by_email(email=user_info["email"])
                if user_id:
                    user_info["user_id"] = user_id
                elif client_email_domain in user_info["email"]:
                    user_obj = UserCreate(
                        email_address=user_info["email"] or user_info["upn"],
                        first_name=user_info["name"].split(" ")[0] if user_info["name"] else "",
                        last_name=user_info["name"].split(" ")[-1] if user_info["name"] else "",
                    )
                    result = user_service.create_user(obj_in=user_obj)
                    user_info["user_id"] = result.id
            return user_info
        except Exception as e:
            logging.exception(e)
            raise e
