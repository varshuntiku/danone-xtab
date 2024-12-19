import base64
import hashlib
import io
import json
import logging

# import os
from datetime import datetime, timedelta
from typing import Dict, List

from api.configs.settings import get_app_settings
from api.daos.auth.saml_login_dao import SAMLDao
from api.dtos.auth.saml_dto import LoginConfigDTO
from api.helpers.auth.saml_login_helper import SAMLService
from api.helpers.generic_helpers import GenericHelper
from api.middlewares.error_middleware import GeneralException
from api.schemas.auth.saml_login_schema import (
    SAMLGetTokenResponseSchema,
    SAMLLoginResponseSchema,
)
from api.services.base_service import BaseService
from api.utils.auth.authenticate import create_access_token, create_refresh_token
from api.utils.auth.token import decode_token
from cryptography.fernet import Fernet
from fastapi import Request, Response, status
from fastapi.responses import RedirectResponse, StreamingResponse

settings = get_app_settings()


class SAMLLoginService(BaseService):
    def __init__(self):
        super().__init__()
        self.saml_login_dao = SAMLDao(self.db_session)
        self.generic_helper = GenericHelper()
        self.fernet = Fernet(settings.SAML_ENCRYPTION_KEY)

    def saml_login(self, request: Request, redirect_url: str) -> SAMLLoginResponseSchema:
        try:
            saml_service = SAMLService(self.db_session)
            authn_request_url = saml_service.prepare_for_authenticate(redirect_url=redirect_url)
            if authn_request_url:
                # Creating a session with user-agent and client IP
                session = {
                    "user-agent": request.headers.get("user-agent"),
                    "host": request.client.host,
                }
                encSession = self.fernet.encrypt(json.dumps(session).encode()).hex()
                request.session["auth_session"] = encSession
                return {"url": authn_request_url}
            else:
                raise GeneralException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    message={"error": "Error creating login url"},
                )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message={"error": "Error creating login url"},
            )

    async def saml_callback(self, request: Request):
        try:
            # Getting SAML response from the request
            saml_service = SAMLService(self.db_session)
            form_data = await request.form()
            saml_response_data = form_data.get("SAMLResponse")
            if not saml_response_data:
                raise GeneralException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    message={"error": "SAMLResponse not found"},
                )

            # TODO: Check if user with email id exists and add if not
            saml_response = saml_service.process_saml_response(saml_response_data)

            current_time = datetime.now().strftime("%d-%m-%y %H:%M:%S.%f")

            # Exctracting user info
            user_id = saml_service.get_user_info(saml_response)["user_id"]
            user_email = saml_service.get_user_info(saml_response)["email"]
            first_name = saml_service.get_user_info(saml_response)["first_name"]
            last_name = saml_service.get_user_info(saml_response)["last_name"]

            # Generating Auth Code
            unique_info = (user_email + current_time).encode("utf-8")
            auth_code = hashlib.pbkdf2_hmac(
                "sha256",
                unique_info,
                settings.SAML_ENCRYPTION_KEY.encode("utf-8"),
                100000,
                dklen=128,
            )

            # Encrypting auth_data to send in the cookie
            auth_data = {
                "user_id": user_id,
                "user_email": user_email,
                "first_name": first_name,
                "last_name": last_name,
                "auth_code": auth_code.hex(),
            }
            encrypted_auth_data = self.fernet.encrypt(json.dumps(auth_data).encode())

            # Inserting auth_code into the db
            if self.saml_login_dao.check_user_login_auth_code_by_email(user_email) > 0:
                self.saml_login_dao.update_user_login_auth_code(
                    user_email,
                    auth_code,
                    expiry=(datetime.now() + timedelta(minutes=1)),
                )
            else:
                self.saml_login_dao.create_user_login_auth_code(
                    user_email,
                    auth_code,
                    expiry=(datetime.now() + timedelta(minutes=1)),
                )

            saml_service.handle_user(saml_response)

            # Setting the cookie header
            headers = {
                "Set-Cookie": f"auth_code={encrypted_auth_data.hex()}; Max-Age=60; Path=/; SameSite=None; Secure; HttpOnly"
            }

            # Returning a redirect response
            if form_data.get("RelayState"):
                return_path = base64.b64decode(form_data.get("RelayState")).decode("utf-8")
                return RedirectResponse(
                    return_path + "?saml_login=true",
                    status_code=status.HTTP_302_FOUND,
                    headers=headers,
                )
            else:
                return RedirectResponse(
                    settings.CLIENT_HTTP_ORIGIN + "?saml_login=true",
                    status_code=status.HTTP_302_FOUND,
                    headers=headers,
                )
        except Exception as e:
            logging.exception(e)
            if form_data.get("RelayState"):
                return_path = base64.b64decode(form_data.get("RelayState")).decode("utf-8")
                return RedirectResponse(
                    return_path + "?saml_login=false",
                    status_code=status.HTTP_302_FOUND,
                    headers=headers,
                )
            else:
                return RedirectResponse(
                    settings.CLIENT_HTTP_ORIGIN + "?saml_login=false",
                    status_code=status.HTTP_302_FOUND,
                    headers=headers,
                )

    def get_token(self, request: Request, response: Response) -> SAMLGetTokenResponseSchema:
        try:
            # Validating Session
            session = json.loads(self.fernet.decrypt(bytes.fromhex(request.session.get("auth_session"))).decode())
            if session["user-agent"] != request.headers.get("user-agent") or session["host"] != request.client.host:
                raise GeneralException(
                    message={"error": "Invalid session"},
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
            # Clearing Session cookies
            request.session.clear()

            # Getting auth related cookies
            auth_cookie = json.loads(self.fernet.decrypt(bytes.fromhex(request.cookies.get("auth_code"))).decode())
            auth_code_cookie = auth_cookie["auth_code"]
            auth_user_cookie = auth_cookie["user_email"]
            user_id = auth_cookie["user_id"]

            user_auth_token = self.saml_login_dao.get_user_login_auth_code_by_email(auth_user_cookie)

            # Checking if cookies are not None
            if auth_code_cookie is None or auth_user_cookie is None or user_auth_token is None:
                raise GeneralException(
                    message={"error": "Error getting token"},
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            # Checking if auth code is expired
            current_time = datetime.now()
            if current_time > user_auth_token.expiry:
                raise GeneralException(
                    message={"error": "Auth token expired"},
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            # Checking if auth code is valid and returning tokens
            auth_code_saved = user_auth_token.auth_code.hex()
            if auth_code_saved == auth_code_cookie:
                access_token = create_access_token(subject=auth_user_cookie, expires_delta=timedelta(minutes=65))
                refresh_token = create_refresh_token(subject=auth_user_cookie, expires_delta=timedelta(days=14))

                # Clearing auth cookie
                response.headers[
                    "Set-Cookie"
                ] = "auth_code=auth_code; Max-Age=0; Domain=localhost; Path=/; SameSite=None; Secure; HttpOnly"
                return {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user_id": user_id,
                    "exp": decode_token(access_token)["exp"],
                    "is_restricted_user": False,
                }
        except Exception as e:
            logging.exception(e)
            # Clearing auth_code and session cookies
            response.headers[
                "Set-Cookie"
            ] = "auth_code=auth_code; Max-Age=0; Domain=localhost; Path=/; SameSite=None; Secure; HttpOnly"
            request.session.clear()
            raise GeneralException(
                message={"error": "Error getting token"},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        finally:
            # Reseting auth_code in db
            self.saml_login_dao.update_user_login_auth_code(
                auth_user_cookie,
                "temp_code".encode("utf-8"),
                datetime.now() - timedelta(days=10),
            )

    def save_login_config(self, form_data: Dict):
        config_types = ["sso", "email_password", "saml"]
        for key in config_types:
            form_data[key] = json.loads(form_data[key])

        if form_data.get("metadata_file"):
            metadata_file = form_data["metadata_file"]
            self.generic_helper.upload_metadata_blob(file=metadata_file.file.read(), filename="saml_metadata.xml")
            login_config = self.saml_login_dao.get_login_config("saml")
            if login_config:
                self.saml_login_dao.update_saml_config(login_config, form_data["saml"])
        for key in config_types:
            key_login_config = self.saml_login_dao.get_login_config(key)
            self.saml_login_dao.update_config(key_login_config, form_data[key])
        self.saml_login_dao.perform_commit()
        return {"message": "Login config saved"}

    def get_config(self) -> List[LoginConfigDTO]:
        config_data = self.saml_login_dao.get_config()
        return [LoginConfigDTO(login_config) for login_config in config_data]

    def get_saml_avatar(self, user_id: str):
        saml_service = SAMLService(self.db_session)
        access_token = saml_service.get_azure_token()
        avatar = saml_service.get_avatar(user_id, access_token)
        return StreamingResponse(io.BytesIO(avatar.content), media_type="image/jpeg")
