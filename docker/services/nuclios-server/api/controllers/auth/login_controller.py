from api.controllers.base_controller import BaseController
from api.schemas.auth.login_schema import (
    LoginInputSchema,
    LoginResponseSchema,
    LogoutSchema,
    RefreshResponseSchema,
)
from api.services.auth.login_service import LoginService
from fastapi import Request


class LoginController(BaseController):
    def login(self, request_data: LoginInputSchema) -> LoginResponseSchema:
        with LoginService() as login_service:
            response = login_service.login(request_data)
            return response

    def refresh(self, request: Request) -> RefreshResponseSchema:
        with LoginService() as login_service:
            response = login_service.refresh(request)
            return response

    def logout(self, user_email_address: str) -> LogoutSchema:
        with LoginService() as login_service:
            response = login_service.logout(user_email_address)
            return response
