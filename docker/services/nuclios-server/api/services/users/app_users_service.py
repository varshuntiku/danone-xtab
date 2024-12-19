import json
from typing import List

from api.constants.error_messages import GeneralErrors
from api.constants.users.app_users_error_messages import AppUsersErrors
from api.daos.users.app_users_dao import AppUsersDao
from api.dtos.users.app_users_dto import AppUserDTO, AppUserRoleDTO
from api.middlewares.error_middleware import GeneralException
from api.schemas import GenericResponseSchema
from api.schemas.users.app_users_schema import (
    CreateUpdateAppUserRequestSchema,
    CreateUpdateAppUserRoleRequestSchema,
    CreateUpdateDeleteAppUserRoleResponseSchema,
    DeleteAppUserResponseSchema,
    MessageResponseSchema,
    UpdateAppUserResponseSchema,
)
from api.services.base_service import BaseService
from fastapi import status


class AppUsersService(BaseService):
    def __init__(self):
        super().__init__()
        self.app_users_dao = AppUsersDao(self.db_session)

    def get_app_users(self, app_id: int) -> List[AppUserDTO]:
        app_users = self.app_users_dao.get_app_users_by_app_id(app_id)
        transformed_app_users = [AppUserDTO(user) for user in app_users]
        return transformed_app_users

    def get_app_user_roles(self, app_id: int) -> List[AppUserRoleDTO]:
        app_user_roles = self.app_users_dao.get_app_user_roles_by_app_id(app_id)
        transformed_app_user_roles = [AppUserRoleDTO(user) for user in app_user_roles]
        return transformed_app_user_roles

    def create_app_user_role(
        self, request_data: CreateUpdateAppUserRoleRequestSchema, user_id: int
    ) -> CreateUpdateDeleteAppUserRoleResponseSchema:
        name = getattr(request_data, "name")
        app_id = getattr(request_data, "app_id")
        app_roles = self.app_users_dao.get_role_by_name_app_id(name=name, app_id=app_id)

        if app_roles is not None:
            raise GeneralException(
                status_code=status.HTTP_409_CONFLICT,
                message={"error": AppUsersErrors.CONFLICTING_ROLE_NAME_ERROR.value},
            )

        app_user_role = self.app_users_dao.create_app_user_role(
            name=name, app_id=app_id, permissions=json.dumps(getattr(request_data, "permissions")), user_id=user_id
        )

        return {"id": app_user_role.id, "name": app_user_role.name}

    def create_app_user(self, request_data: CreateUpdateAppUserRequestSchema, user_id: int) -> GenericResponseSchema:
        email_address = getattr(request_data, "email_address", "")
        app_id = getattr(request_data, "app_id")
        app_user = self.app_users_dao.get_app_user_by_email_app_id(email_address=email_address.lower(), app_id=app_id)

        if app_user is not None:
            raise GeneralException(
                status_code=status.HTTP_409_CONFLICT,
                message={"error": AppUsersErrors.APP_USER_EXISTS.value},
            )
        else:
            self.app_users_dao.create_app_user(
                app_id=app_id,
                first_name=request_data.first_name,
                last_name=request_data.last_name,
                email_address=email_address.lower(),
                user_roles=[
                    self.app_users_dao.get_app_user_role_by_id(group_id) for group_id in request_data.user_roles
                ]
                if getattr(request_data, "user_roles", None)
                else [],
                permissions=json.dumps({"responsibilities": request_data.responsibilities})
                if getattr(request_data, "responsibilities", None)
                else None,
                user_id=user_id,
            )
        return {"status": "success"}

    def update_app_user_role(
        self, request_data: CreateUpdateAppUserRoleRequestSchema, user_id: int, app_user_role_id: int
    ) -> CreateUpdateDeleteAppUserRoleResponseSchema:
        name = getattr(request_data, "name")
        app_id = getattr(request_data, "app_id")
        app_user_role = self.app_users_dao.get_app_user_role_by_id(app_user_role_id)
        if app_user_role is None:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

        other_role_with_same_name = self.app_users_dao.get_custom_filtered_app_user_role(
            name=name, app_id=app_id, app_user_role_id=app_user_role_id
        )
        if other_role_with_same_name is not None:
            raise GeneralException(
                status_code=status.HTTP_409_CONFLICT,
                message={"error": AppUsersErrors.CONFLICTING_ROLE_NAME_ERROR.value},
            )

        self.app_users_dao.update_app_user_role(
            app_user_role=app_user_role,
            name=name,
            app_id=app_id,
            permissions=json.dumps(getattr(request_data, "permissions")),
            user_id=user_id,
        )

        return {"id": app_user_role.id, "name": app_user_role.name}

    def update_app_user(
        self, request_data: CreateUpdateAppUserRequestSchema, user_id: int, app_user_id: int
    ) -> GenericResponseSchema:
        email_address = getattr(request_data, "email_address", "")
        app_id = getattr(request_data, "app_id")
        app_user = self.app_users_dao.get_app_user_by_id(app_user_id)
        if app_user is None:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

        other_user_with_same_email = self.app_users_dao.get_custom_filtered_app_user(
            email_address=email_address.lower(), app_id=app_id, app_user_id=app_user_id
        )

        if other_user_with_same_email is not None:
            raise GeneralException(
                status_code=status.HTTP_409_CONFLICT,
                message={"error": AppUsersErrors.CONFLICTING_EMAIL_ID_ERROR.value},
            )

        if app_user.permissions:
            permissions = json.loads(app_user.permissions)
            permissions["responsibilities"] = request_data.responsibilities
            app_user_permissions = json.dumps(permissions)
        else:
            app_user_permissions = json.dumps({"responsibilities": request_data.responsibilities})

        self.app_users_dao.update_app_user(
            app_user=app_user,
            app_id=app_id,
            first_name=request_data.first_name,
            last_name=request_data.last_name,
            user_email=email_address.lower(),
            user_roles=[self.app_users_dao.get_app_user_role_by_id(group_id) for group_id in request_data.user_roles]
            if getattr(request_data, "user_roles", None)
            else [],
            permissions=app_user_permissions,
            user_id=user_id,
        )
        return {"status": "success"}

    def delete_app_user_role(
        self, app_user_role_id: int, confirm: bool | str, user_id: int
    ) -> CreateUpdateDeleteAppUserRoleResponseSchema:
        app_user_role = self.app_users_dao.get_app_user_role_by_id(app_user_role_id)
        if app_user_role is None:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

        if not confirm:
            user_role_mapping = [
                row.app_user_id for row in self.app_users_dao.get_app_user_role_identifier_by_role_id(app_user_role_id)
            ]
            associated_users = self.app_users_dao.get_all_app_users_by_id(user_role_mapping)
            if len(associated_users):
                raise GeneralException(
                    status.HTTP_409_CONFLICT,
                    message={"error": AppUsersErrors.ROLE_ASSOCIATED_WITH_USERS_ERROR.value},
                )

        self.app_users_dao.delete_app_user_role(app_user_role=app_user_role, role_id=app_user_role_id, user_id=user_id)
        return {"id": app_user_role.id, "name": app_user_role.name}

    def delete_app_user(self, app_user_id: int, user_id: int, logged_in_email: str) -> DeleteAppUserResponseSchema:
        app_user = self.app_users_dao.get_app_user_by_id(app_user_id)
        if app_user is None:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )
        if app_user.user_email == logged_in_email:
            raise GeneralException(
                status.HTTP_400_BAD_REQUEST,
                message={"error": AppUsersErrors.SELF_ACCOUNT_DELETE_ERROR.value},
            )

        self.app_users_dao.delete_app_user(app_user=app_user, app_user_id=app_user_id, user_id=user_id)
        return {"id": app_user.id}

    def update_app_user_responsibilities(
        self, request_data: UpdateAppUserResponseSchema, user_id: int, app_id: int
    ) -> MessageResponseSchema:
        if getattr(request_data, "deleted_responsibilities", False):
            deleted_responsibilities = request_data.deleted_responsibilities
            app_users = self.app_users_dao.get_all_app_users_by_app_id(app_id)
            for user in app_users:
                user_permissions = json.loads(user.permissions) if user.permissions else ""
                if user_permissions:
                    user_resp = user_permissions.get("responsibilities", [])
                    if user_resp:
                        updated_user_resp = list(set(user_resp) - set(deleted_responsibilities))
                        user_permissions["responsibilities"] = updated_user_resp
                        updated_user_permissions = json.dumps(user_permissions)
                        self.app_users_dao.update_app_user_permissions(
                            app_user=user, permissions=updated_user_permissions, user_id=user_id
                        )

            return {"message": "Successfully updated the responsibiltiies for app users"}
        else:
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.REQUEST_DATA_ERROR.value},
            )
