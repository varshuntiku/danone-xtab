from typing import Dict

from api.controllers.base_controller import BaseController
from api.models.base_models import User
from api.schemas.generic_schema import StatusResponseSchema
from api.schemas.users.users_schema import (
    DeleteUserSchema,
    GetUserSchema,
    UpdateUserInfoRequestSchema,
    UploadBulkUsersResponseSchema,
    UserCreateResponseSchema,
    UserGenerateOtpResponseSchema,
    UserGenerateTokenRequestSchema,
    UserGenerateTokenResponseSchema,
    UserGetTokensResponseSchema,
    UserInfoSchema,
    UserSchema,
    UserUpdatePasswordResponseSchema,
    UserUpdatePasswordSchema,
    UserUpdateRequestSchema,
    UserValidateOtpResponseSchema,
)
from api.services.users.users_service import UsersService
from fastapi import Response, UploadFile


class UsersController(BaseController):
    def get_users_list(self, query_params):
        with UsersService() as users_service:
            users_list = users_service.get_users_list(query_params)
            users_list["data"] = self.get_serialized_list(UserSchema, users_list["data"])
            return users_list

    def create_user(self, request, request_data):
        with UsersService() as users_service:
            new_user = users_service.create_user(request, request_data)
            return new_user

    def update_user(self, request_data: UserUpdateRequestSchema, user_id: int) -> UserCreateResponseSchema:
        with UsersService() as users_service:
            response = users_service.update_user(request_data, user_id)
            return response

    def get_user(self, user_id: int) -> UserInfoSchema:
        with UsersService() as users_service:
            user = users_service.get_user(user_id)
            return user

    def update_password(
        self, user_email_address: str, request_data: UserUpdatePasswordSchema
    ) -> UserUpdatePasswordResponseSchema:
        with UsersService() as users_service:
            response = users_service.update_password(user_email_address, request_data)
            return response

    def generate_otp(self, response: Response, user_email_address: str) -> UserGenerateOtpResponseSchema:
        with UsersService() as users_service:
            response = users_service.generate_otp(response, user_email_address)
            return response

    def validate_otp(self, response: Response, user_id: int, otp: int) -> UserValidateOtpResponseSchema:
        with UsersService() as users_service:
            response = users_service.validate_otp(response, user_id, otp)
            return response

    def generate_user_token(self, request_data: UserGenerateTokenRequestSchema) -> UserGenerateTokenResponseSchema:
        with UsersService() as users_service:
            response = users_service.generate_user_token(request_data)
            return response

    def get_user_tokens(self, user_email: str) -> UserGetTokensResponseSchema:
        with UsersService() as users_service:
            response = users_service.get_user_tokens(user_email)
            return response

    def get_user_groups(self):
        with UsersService() as users_service:
            user_groups = users_service.get_user_groups()
            return user_groups

    def create_user_groups(self, request_data, user_id):
        with UsersService() as users_service:
            new_user_group = users_service.create_user_groups(request_data, user_id)
            return new_user_group

    def get_user_group_by_id(self, user_group_id):
        with UsersService() as users_service:
            user_group = users_service.get_user_group_by_id(user_group_id)
            return user_group

    def update_user_group(self, request_data, user_group_id, user_id):
        with UsersService() as users_service:
            response = users_service.update_user_group(request_data, user_group_id, user_id)
            return response

    def delete_user_group_by_id(self, user_group_id, user_id):
        with UsersService() as users_service:
            delete_response = users_service.delete_user_group_by_id(user_group_id, user_id)
            return delete_response

    def get_nac_role_permissions(self):
        with UsersService() as users_service:
            response = users_service.get_nac_role_permissions()
            return response

    def get_nac_user_roles(self):
        with UsersService() as users_service:
            response = users_service.get_nac_user_roles()
            return response

    def get_nac_user_role_by_id(self, nac_user_role_id):
        with UsersService() as users_service:
            response = users_service.get_nac_user_role_by_id(nac_user_role_id)
            return response

    def create_nac_user_role(self, request_data, user_id):
        with UsersService() as users_service:
            response = users_service.create_nac_user_role(request_data, user_id)
            return response

    def update_nac_user_role(self, nac_user_role_id, request_data, user_id):
        with UsersService() as users_service:
            response = users_service.update_nac_user_role(nac_user_role_id, request_data, user_id)
            return response

    def delete_nac_user_role(self, nac_user_role_id, user_id):
        with UsersService() as users_service:
            response = users_service.delete_nac_user_role(nac_user_role_id, user_id)
            return response

    def get_user_info(self, user_id: int) -> GetUserSchema:
        with UsersService() as users_service:
            user = users_service.get_user_info(user_id)
            return user

    def delete_user(self, user_id: int, deleted_by: int) -> DeleteUserSchema:
        with UsersService() as users_service:
            response = users_service.delete_user(user_id, deleted_by)
            return response

    def delete_users(self, user_ids: int, deleted_by_user: User) -> DeleteUserSchema:
        with UsersService() as users_service:
            response = users_service.delete_users(user_ids, deleted_by_user)
            return response

    def delete_jwt_token(self, id: int) -> Dict:
        with UsersService() as users_service:
            response = users_service.delete_jwt_token(id)
            return response

    def update_user_info(
        self, user_id: int, updated_by: int, request_data: UpdateUserInfoRequestSchema
    ) -> StatusResponseSchema:
        with UsersService() as users_service:
            response = users_service.update_user_info(user_id, updated_by, request_data)
            return response

    async def upload_users_list(self, file: UploadFile) -> UploadBulkUsersResponseSchema:
        with UsersService() as users_service:
            response = await users_service.upload_users_list(file)
            return response
