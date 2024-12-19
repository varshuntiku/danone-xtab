from typing import List

from api.controllers.base_controller import BaseController
from api.schemas import GenericResponseSchema
from api.schemas.users.app_users_schema import AppUserRoleSchema, AppUserSchema
from api.services.users.app_users_service import (
    AppUsersService,
    CreateUpdateAppUserRequestSchema,
    CreateUpdateAppUserRoleRequestSchema,
    CreateUpdateDeleteAppUserRoleResponseSchema,
    DeleteAppUserResponseSchema,
    MessageResponseSchema,
    UpdateAppUserResponseSchema,
)


class AppUsersController(BaseController):
    def get_app_users(self, app_id: int) -> List[AppUserSchema]:
        with AppUsersService() as app_users_service:
            app_users = app_users_service.get_app_users(app_id)
            return self.get_serialized_list(AppUserSchema, app_users)

    def get_app_user_roles(self, app_id: int) -> List[AppUserRoleSchema]:
        with AppUsersService() as app_users_service:
            app_user_roles = app_users_service.get_app_user_roles(app_id)
            return self.get_serialized_list(AppUserRoleSchema, app_user_roles)

    def create_app_user_role(
        self, request_data: CreateUpdateAppUserRoleRequestSchema, user_id: int
    ) -> CreateUpdateDeleteAppUserRoleResponseSchema:
        with AppUsersService() as app_users_service:
            response = app_users_service.create_app_user_role(request_data, user_id)
            return response

    def create_app_user(self, request_data: CreateUpdateAppUserRequestSchema, user_id: int) -> GenericResponseSchema:
        with AppUsersService() as app_users_service:
            app_user = app_users_service.create_app_user(request_data, user_id)
            return app_user

    def update_app_user_role(
        self, request_data: CreateUpdateAppUserRoleRequestSchema, user_id: int, app_user_role_id: int
    ) -> CreateUpdateDeleteAppUserRoleResponseSchema:
        with AppUsersService() as app_users_service:
            response = app_users_service.update_app_user_role(request_data, user_id, app_user_role_id)
            return response

    def update_app_user(
        self, request_data: CreateUpdateAppUserRequestSchema, user_id: int, app_user_id: int
    ) -> GenericResponseSchema:
        with AppUsersService() as app_users_service:
            app_user = app_users_service.update_app_user(request_data, user_id, app_user_id)
            return app_user

    def delete_app_user_role(
        self, app_user_role_id: int, confirm: bool | str, user_id: int
    ) -> CreateUpdateDeleteAppUserRoleResponseSchema:
        with AppUsersService() as app_users_service:
            response = app_users_service.delete_app_user_role(app_user_role_id, confirm, user_id)
            return response

    def delete_app_user(self, app_user_id: int, user_id: int, logged_in_email: str) -> DeleteAppUserResponseSchema:
        with AppUsersService() as app_users_service:
            response = app_users_service.delete_app_user(app_user_id, user_id, logged_in_email)
            return response

    def update_app_user_responsibilities(
        self, request_data: UpdateAppUserResponseSchema, user_id: int, app_id: int
    ) -> MessageResponseSchema:
        with AppUsersService() as app_users_service:
            app_user = app_users_service.update_app_user_responsibilities(request_data, user_id, app_id)
            return app_user
