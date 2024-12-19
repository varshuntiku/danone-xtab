from api.controllers.base_controller import BaseController
from api.services.apps.users_service import UsersService
from fastapi import Request


class UsersController(BaseController):
    def get_user(self, request: Request):
        with UsersService() as users_service:
            user = users_service.get_user(request)
            return user

    def get_all_users_details(self, access_token: str):
        with UsersService() as users_service:
            user_details = users_service.get_all_users_details( access_token)
            return user_details
