from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.auth.saml_login_schema import (
    GetLoginConfigResponseSchema,
    SAMLGetTokenResponseSchema,
    SAMLLoginResponseSchema,
)
from api.services.auth.saml_login_service import SAMLLoginService
from fastapi import Request, Response


class SAMLLoginController(BaseController):
    def saml_login(self, request: Request, redirect_url: str) -> SAMLLoginResponseSchema:
        with SAMLLoginService() as saml_login_service:
            response = saml_login_service.saml_login(request, redirect_url)
            return response

    async def saml_callback(self, request: Request):
        with SAMLLoginService() as saml_login_service:
            response = await saml_login_service.saml_callback(request)
            return response

    def get_token(self, request: Request, response: Response) -> SAMLGetTokenResponseSchema:
        with SAMLLoginService() as saml_login_service:
            response = saml_login_service.get_token(request, response)
            return response

    def save_login_config(self, form_data):
        with SAMLLoginService() as saml_login_service:
            response = saml_login_service.save_login_config(form_data)
            return response

    def get_config(self) -> List[GetLoginConfigResponseSchema]:
        with SAMLLoginService() as saml_login_service:
            response = saml_login_service.get_config()
            return response

    def get_saml_avatar(self, user_id: str):
        with SAMLLoginService() as saml_login_service:
            response = saml_login_service.get_saml_avatar(user_id)
            return response
