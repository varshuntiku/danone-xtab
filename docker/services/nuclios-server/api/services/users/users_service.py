import datetime
import hashlib
import json
from io import BytesIO
from typing import Dict

import numpy as np
import pandas as pd
from api.configs.settings import get_app_settings
from api.constants.error_messages import GeneralErrors
from api.constants.users.user_error_messages import UserErrors
from api.constants.users.user_success_messages import UserSuccessMessages
from api.daos.apps.app_dao import AppDao
from api.daos.users.users_dao import UsersDao
from api.dtos.users.nac_roles_dto import NacRolesDTO
from api.dtos.users.user_groups_dto import UserGroupDTO
from api.dtos.users.user_info_dto import UserInfoDTO
from api.dtos.users.user_token_dto import UserTokenDTO
from api.dtos.users.users_dto import GetUserDTO, UserDTO
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import User
from api.schemas.generic_schema import StatusResponseSchema
from api.schemas.users.users_schema import (
    DeleteUserSchema,
    NacUserRolesCreateRequestSchema,
    NacUserRolesCreateResponseSchema,
    UpdateUserInfoRequestSchema,
    UploadBulkUsersResponseSchema,
    UserCreateResponseSchema,
    UserGenerateOtpResponseSchema,
    UserGenerateTokenRequestSchema,
    UserGenerateTokenResponseSchema,
    UserGetTokensResponseSchema,
    UserInfoSchema,
    UserUpdatePasswordResponseSchema,
    UserUpdatePasswordSchema,
    UserUpdateRequestSchema,
    UserValidateOtpResponseSchema,
)
from api.services.base_service import BaseService
from api.utils.app.app import sanitize_content
from api.utils.auth.authenticate import (
    get_passcode_data,
    validate_timestamp,
    validate_totp,
)
from api.utils.auth.email import generate_otp_mail, send_email_smtp
from api.utils.auth.token import encode_payload, get_password_token
from api.utils.user.user import (
    add_user_access,
    get_user_code_passcode,
    run_user_password_validations,
)
from fastapi import Response, UploadFile, status
from sqlalchemy.sql import func

settings = get_app_settings()


class UsersService(BaseService):
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        super().__init__()
        self.users_dao = UsersDao(self.db_session)
        self.app_dao = AppDao(self.db_session)

    def get_users_list(self, query_params):
        users_list = self.users_dao.get_users_list(query_params)
        users_list["data"] = [UserDTO(user) for user in users_list["data"]]
        return users_list

    def create_user(self, request, request_data):
        if 1 in request_data.user_groups:
            request_data.user_groups.remove(1)

        user = self.users_dao.check_user_exists(request_data.email_address)
        if user > 0:
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.USER_ALREADY_EXISTS.value},
            )
        user_group_app_publish = self.users_dao.get_user_group_app_publish()

        app_publish_group_id = [item.id for item in user_group_app_publish]
        request_user_groups = request_data.user_groups if request_data.user_groups else []
        is_nac_user = set(app_publish_group_id).intersection(request_user_groups)

        if is_nac_user:
            default_nac_role = request_data.nac_user_roles if request_data.nac_user_roles else []
            if not len(default_nac_role):
                default_nac_role.append(self.users_dao.get_nac_role_by_name("App Default User"))
                request_data.nac_user_roles = [default_nac_role[0].id]

        new_user = self.users_dao.create_user(request, request_data, is_nac_user)

        response = {"id": new_user.id, "first_name": new_user.first_name}

        return response

    def update_user(self, request_data: UserUpdateRequestSchema, user_id: int) -> UserCreateResponseSchema:
        email_address = getattr(request_data, "email_address").lower()
        user = self.users_dao.get_user_by_email(email_address)

        if user is None:
            user = self.users_dao.create_new_user(
                first_name=request_data.first_name,
                last_name=request_data.last_name,
                email_address=email_address,
                created_by=user_id,
                access_key=True,
                user_groups=[group_row for group_row in request_data.user_groups]
                if getattr(request_data, "user_groups", None)
                else [],
                password=(
                    request_data.password
                    if (getattr(request_data, "password", None) and request_data.password != "")
                    else False
                ),
                restricted_user=request_data.restricted_user
                if getattr(request_data, "restricted_user", None) and request_data.restricted_user != ""
                else False,
                restricted_access=request_data.restricted_access
                if getattr(request_data, "restricted_access", None) and request_data.restricted_access != ""
                else False,
            )
        else:
            if getattr(request_data, "createNewUser", False):
                raise GeneralException(
                    status_code=status.HTTP_409_CONFLICT,
                    message={"error": UserErrors.USER_ALREADY_EXISTS.value},
                )
            else:
                password_hash = None
                if getattr(request_data, "password", None) and request_data.password != "":
                    password_hash = hashlib.pbkdf2_hmac(
                        "sha256",
                        request_data.password.encode("utf-8"),
                        "codxauth".encode("utf-8"),
                        100000,
                        dklen=128,
                    )
                self.users_dao.update_user(
                    user=user,
                    first_name=request_data.first_name,
                    last_name=request_data.last_name,
                    email_address=request_data.email_address,
                    password_hash=password_hash,
                    updated_by=user_id,
                )

        return {"id": user.id, "first_name": user.first_name}

    def get_user(self, user_id: int) -> UserInfoSchema:
        user = self.users_dao.get_user_by_id(user_id)

        if not user:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.USER_NOT_FOUND_ERROR.value},
            )

        # Decorate the user object with roles and feature access data
        user = add_user_access(user)

        user = UserInfoDTO(user)
        return user

    def update_password(
        self, user_email_address: str, request_data: UserUpdatePasswordSchema
    ) -> UserUpdatePasswordResponseSchema:
        user = self.users_dao.get_user_by_email(user_email_address)

        if not user:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.USER_NOT_FOUND_ERROR.value},
            )

        # Validate the user password update by running different password validations
        run_user_password_validations(user, request_data)

        # Update user login password
        response = self.users_dao.update_user_password(user, request_data)

        return response

    def generate_otp(self, response: Response, user_email_address: str) -> UserGenerateOtpResponseSchema:
        user = self.users_dao.get_user_by_email(user_email_address)

        if not user:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.USER_NOT_FOUND_ERROR.value},
            )

        user_code, user_password = get_user_code_passcode(self.users_dao, user)

        if user_code.get("otp_code", False):
            otp_code = user_code.get("otp_code")
            code_hash = user_code.get("code_hash", False)

            generate_otp_mail(code=otp_code, user_data=user)

            if user_password:
                code_attempt = get_passcode_data(user_password, key="code_attempt")
                self.users_dao.update_user_passcode(
                    user_password_code=user_password,
                    verify_attempt=0,
                    attempt=code_attempt,
                    secret=code_hash.encode("utf-8"),
                    updated_at=func.now() if code_attempt == 1 else user_password.updated_at,
                )
            # Check how int values can be passed in headers and update this
            response.headers["userId"] = str(user.id)
            response.headers["Access-Control-Expose-Headers"] = "userId"

            return {"message": UserSuccessMessages.USER_OTP_GENERATION_SUCCESS_MESSAGE.value}

    def validate_otp(self, response: Response, user_id: int, otp: str = False) -> UserValidateOtpResponseSchema:
        try:
            user = self.users_dao.get_user_passcode_by_user_id(user_id)
            if not user:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": UserErrors.USER_PASSCODE_NOT_FOUND_ERROR.value},
                )

            if getattr(user, "secret", None):
                is_otp_match = validate_totp(totp=otp, otp_hash=user.secret.decode("utf-8"))
                code_timestamp = user.updated_at if user.updated_at else user.created_at
                is_otp_valid = validate_timestamp(code_timestamp, duration=300, duration_in="seconds")

                if is_otp_match and is_otp_valid:
                    password_reset_token = get_password_token(user_id=user_id, user_email=user.user_email)
                    response.headers["password_token"] = password_reset_token
                    response.headers["Access-Control-Expose-Headers"] = "password_token"
                    return {"message": UserSuccessMessages.USER_VALID_OTP_SUCCESS_MESSAGE.value}
                else:
                    response_json = {"message": UserErrors.USER_INVALID_OTP_ERROR.value}
                    if user.verify_attempt < 5:
                        updated_verify_attempt = user.verify_attempt + 1
                        self.users_dao.update_user_passcode(
                            user_password_code=user, verify_attempt=updated_verify_attempt
                        )
                        if updated_verify_attempt == 5:
                            response_json = {
                                "message": UserErrors.USER_OTP_FAILED_ATTEMPTS_ERROR.value,
                                "attempt": 5,
                                "attemptsLeft": 5 - updated_verify_attempt,
                            }
                        else:
                            response_json = {
                                "message": UserErrors.USER_INVALID_OTP_ERROR.value,
                                "attemptsLeft": 5 - updated_verify_attempt,
                            }
                    raise GeneralException(
                        status.HTTP_404_NOT_FOUND,
                        message={"error": response_json},
                    )
        except Exception as error_msg:
            if error_msg.exception_type == "General Exception":
                raise GeneralException(status_code=error_msg.status_code, message=error_msg.message)
            else:
                raise GeneralException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    message={"error": UserErrors.USER_INVALID_OTP_ERROR.value},
                )

    def generate_user_token(self, request_data: UserGenerateTokenRequestSchema) -> UserGenerateTokenResponseSchema:
        user_name = getattr(request_data, "user_name", None)
        user_email = getattr(request_data, "user_email", None)
        access = getattr(request_data, "access", None)
        payload = {
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=90),
            "iat": datetime.datetime.utcnow(),
            "sub": user_email,
            "access": access,
        }
        secret = getattr(settings, "TOKEN_SECRET_KEY", None)
        token = encode_payload(payload, secret, "HS256")
        self.users_dao.create_user_token(user_name, user_email, json.dumps(access), token)

        return {"message": UserSuccessMessages.USER_TOKEN_CREATION_SUCCESS_MESSAGE.value, "token": token}

    def get_user_tokens(self, user_email: str) -> UserGetTokensResponseSchema:
        user_tokens = self.users_dao.get_user_tokens_by_email(user_email)
        response = [UserTokenDTO(user_token) for user_token in user_tokens]
        return {"message": UserSuccessMessages.USER_TOKENS_FETCH_SUCCESS_MESSAGE.value, "tokens": response}

    def get_user_groups(self):
        user_groups = self.users_dao.get_user_groups()
        user_groups = [UserGroupDTO(user_group) for user_group in user_groups]
        return user_groups

    def create_user_groups(self, request_data, user_id):
        new_user_group = self.users_dao.create_user_groups(request_data, user_id)
        return {
            "message": "Success",
            "id": new_user_group.id,
            "name": new_user_group.name,
        }

    def get_user_group_by_id(self, user_group_id):
        user_group = self.users_dao.get_user_group_by_id(user_group_id)
        if not user_group:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.USER_GROUP_NOT_FOUND_ERROR.value},
            )
        user_group = UserGroupDTO(user_group)
        return user_group

    def update_user_group(self, request_data, user_group_id, user_id):
        user_group = self.users_dao.get_user_group_by_id(user_group_id)
        if not user_group:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.USER_GROUP_NOT_FOUND_ERROR.value},
            )
        response = self.users_dao.update_user_group(request_data, user_group_id, user_id)

        return response

    def delete_user_group_by_id(self, user_group_id, user_id):
        user_group_count = self.users_dao.check_user_group_exist(user_group_id)
        if user_group_count == 0:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.USER_GROUP_NOT_FOUND_ERROR.value},
            )

        mapped_user = self.users_dao.check_user_group_mapped_to_user(user_group_id)
        if mapped_user:
            raise GeneralException(
                status.HTTP_400_BAD_REQUEST,
                message={"error": UserErrors.USER_MAPPED_TO_USER_GROUP_ERROR.value},
            )

        deleted_user_group = self.users_dao.delete_user_group_by_id(user_group_id, user_id)
        return {"message": "Success", "deleted_user_group": deleted_user_group}

    def get_nac_role_permissions(self):
        response = self.users_dao.get_nac_role_permissions()
        response = [
            {
                "id": row.id,
                "name": row.name.upper(),
                "created_by": (
                    f"{row.created_by_user.first_name} {row.created_by_user.last_name}" if row.created_by else "--"
                ),
            }
            for row in response
        ]
        return response

    def get_nac_user_roles(self):
        nac_roles = self.users_dao.get_nac_user_roles()
        response = [NacRolesDTO.get_nac_role(nac_role) for nac_role in nac_roles]
        return response

    def get_nac_user_role_by_id(self, nac_user_role_id):
        nac_role = self.users_dao.get_nac_user_role_by_id(nac_user_role_id)

        if not nac_role:
            raise GeneralException(
                status.HTTP_400_BAD_REQUEST,
                message={"error": UserErrors.NAC_ROLE_NOT_FOUND_ERROR.value},
            )

        response = NacRolesDTO.get_nac_role(nac_role)
        return response

    def create_nac_user_role(self, request_data: NacUserRolesCreateRequestSchema, user_id):
        is_existing_role = self.users_dao.check_nac_role_exist_by_name(request_data.name)
        if is_existing_role > 0:
            raise GeneralException(
                status.HTTP_400_BAD_REQUEST,
                message={"error": UserErrors.NAC_ROLE_NAME_ALREADY_EXISTS.value},
            )

        role_permissions = []

        role_permissions = [self.users_dao.get_nac_role_permission_by_id(id) for id in request_data.role_permissions]

        new_nac_role: NacUserRolesCreateResponseSchema = self.users_dao.create_nac_role(
            request_data.name, role_permissions, user_id
        )

        return {"message": "Success", "id": new_nac_role.id, "name": new_nac_role.name}

    def update_nac_user_role(self, nac_user_role_id, request_data, user_id):
        role_exists = self.users_dao.check_nac_role_exist_by_id(nac_user_role_id)
        if role_exists == 0:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.NAC_ROLE_NOT_EXISTS.value},
            )

        is_existing_role = self.users_dao.check_nac_role_exist_by_name_update(request_data.name, nac_user_role_id)
        if is_existing_role > 0:
            raise GeneralException(
                status.HTTP_400_BAD_REQUEST,
                message={"error": UserErrors.NAC_ROLE_NAME_ALREADY_EXISTS.value},
            )

        self.users_dao.update_nac_role(nac_user_role_id, request_data, user_id)

        return {"message": "Updated successfully"}

    def delete_nac_user_role(self, nac_user_role_id, user_id):
        role_exists = self.users_dao.check_nac_role_exist_by_id(nac_user_role_id)
        if role_exists == 0:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.NAC_ROLE_NOT_EXISTS.value},
            )

        self.users_dao.delete_nac_user_role(nac_user_role_id, user_id)

        return {"message": "Deleted Successfully"}

    def delete_jwt_token(self, id: int) -> Dict:
        self.users_dao.delete_jwt_token(id)
        return {"message": UserSuccessMessages.USER_TOKEN_DELETION_SUCCESS_MESSAGE.value}

    def get_user_info(self, user_id: int) -> GetUserDTO:
        user = self.users_dao.get_user_by_id(user_id)

        if not user:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.USER_NOT_FOUND_ERROR.value},
            )

        return GetUserDTO(user)

    def delete_user(self, user_id: int, deleted_by: int) -> DeleteUserSchema:
        user = self.users_dao.get_user_by_id(user_id)

        if not user:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.USER_NOT_FOUND_ERROR.value},
            )

        self.users_dao.delete_user_by_id(user, deleted_by)
        return {"deleted_rows": 1}

    def delete_users(self, user_ids: int, deleted_by_user: User) -> DeleteUserSchema:
        user_emails = self.users_dao.delete_users_by_ids(user_ids, deleted_by_user)
        send_email_smtp(
            email_type="",
            to=[email[0] for email in user_emails],
            subject="Nuclios access revoked",
            body={
                "plain": f"Dear user, Your access to Nuclios was revoked by {deleted_by_user.first_name} as you have not accesed Nuclios for the last six months.If you think this was a mistake Please reach out to {deleted_by_user.email_address}/nRegards,/nTeam Nuclios"
            },
        )
        return {"deleted_rows": len(user_ids)}

    def update_user_info(
        self, user_id: int, updated_by: int, request_data: UpdateUserInfoRequestSchema
    ) -> StatusResponseSchema:
        user = self.users_dao.get_user_by_id(user_id)

        if not user:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": UserErrors.USER_NOT_FOUND_ERROR.value},
            )

        email_address = getattr(request_data, "email_address")
        if email_address != user.email_address:
            existing_mail_check = self.users_dao.get_user_by_email(email_address)
            if existing_mail_check is not None:
                raise GeneralException(
                    status.HTTP_409_CONFLICT,
                    message={"error": UserErrors.USER_WITH_EMAIL_EXISTS_ERROR.value.format(email=email_address)},
                )

        final_user_groups = (
            [self.users_dao.get_user_group_by_id(group_row) for group_row in getattr(request_data, "user_groups")]
            if getattr(request_data, "user_groups")
            else []
        )

        user_group_app_publish = self.users_dao.get_user_group_app_publish()

        app_publish_group_id = [item.id for item in user_group_app_publish]

        request_user_groups = getattr(request_data, "user_groups") if getattr(request_data, "user_groups") else []
        is_nac_user = set(app_publish_group_id).intersection(request_user_groups)

        if is_nac_user:
            default_nac_role = (
                getattr(request_data, "nac_user_roles") if getattr(request_data, "nac_user_roles", False) else []
            )
            if not len(default_nac_role):
                default_nac_role.append(self.users_dao.get_nac_role_by_name("App Default User"))
                request_data.nac_user_roles = [default_nac_role[0].id]

        user_nac_user_roles = (
            [self.users_dao.get_nac_user_role_by_id(group_row) for group_row in getattr(request_data, "nac_user_roles")]
            if getattr(request_data, "nac_user_roles") and len(is_nac_user)
            else []
        )

        user_password_hash = ""
        if getattr(request_data, "password") and getattr(request_data, "password") != "":
            user_password_hash = hashlib.pbkdf2_hmac(
                "sha256",
                getattr(request_data, "password").encode("utf-8"),
                "codxauth".encode("utf-8"),
                100000,
                dklen=128,
            )

        user.restricted_user = (
            getattr(request_data, "restricted_user")
            if getattr(request_data, "restricted_user") and getattr(request_data, "restricted_user") != ""
            else False
        )
        user.restricted_access = (
            getattr(request_data, "restricted_access")
            if getattr(request_data, "restricted_access") and getattr(request_data, "restricted_access") != ""
            else False
        )
        self.users_dao.update_user(
            user=user,
            first_name=getattr(request_data, "first_name"),
            last_name=getattr(request_data, "last_name"),
            email_address=email_address,
            user_groups=final_user_groups,
            nac_user_roles=user_nac_user_roles,
            password_hash=user_password_hash,
            updated_by=updated_by,
        )

        return {"status": True}

    async def upload_users_list(self, file: UploadFile) -> UploadBulkUsersResponseSchema:
        content = await file.read()
        file_name = file.filename
        file_extenstion = file_name.rsplit(".", 1)[1].lower()
        if file_extenstion == "xls":
            ingested_df = pd.read_excel(BytesIO(content))
            if ingested_df["nac_access"].isnull().values.any():
                ingested_df["nac_access"].fillna("", inplace=True)
        else:
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={
                    "error": sanitize_content(
                        ".{file_extenstion} file format is not accepted.Please upload .XLS file".format(
                            file_extenstion=file_extenstion
                        )
                    )
                },
            )
        if ingested_df.isnull().values.any():
            raise GeneralException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message={"error": GeneralErrors.FILE_REMOVE_EMPTY_VALUE_ERROR.value},
            )
        boolean = ingested_df["email"].duplicated().any()
        if boolean:
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": GeneralErrors.FILE_REMOVE_DUPLICATE_EMAIL_ERROR.value},
            )
        users_added, users_ignored, user_access_reinstated = self.users_dao.upload_bulk_users(ingested_df)
        response = {
            "filename": file.filename,
            "users_added": len(np.unique(users_added)),
            "users_ignored": len(np.unique(users_ignored)),
            "user_access_reinstated": len(np.unique(user_access_reinstated)),
        }
        return response
