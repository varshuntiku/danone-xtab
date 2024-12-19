import hashlib
import logging
import math
from datetime import datetime, timedelta
from typing import List

from api.constants.users.user_error_messages import UserErrors
from api.constants.users.user_success_messages import UserSuccessMessages
from api.constants.users.user_variables import UserGroupType
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    NacRolePermissions,
    NacRoles,
    User,
    UserGroup,
    UserPasswordCode,
    UserToken,
)
from api.schemas.users.users_schema import (
    UserGroupCreateRequestSchema,
    UserSuccessResponseSchema,
    UserUpdatePasswordResponseSchema,
    UserUpdatePasswordSchema,
)
from fastapi import status
from sqlalchemy import and_, asc, desc, or_
from sqlalchemy.sql import func


class UsersDao(BaseDao):
    def get_users_list(self, query_params):
        page = query_params["page"]
        page_size = query_params["pageSize"]
        user_type = query_params["user_type"]
        filtered = query_params["filtered"]

        query = self.db_session.query(User)

        try:
            response_data = []
            if user_type == "inactive":
                six_months_ago = datetime.now() - timedelta(days=6 * 30)
                response_data = (
                    query.filter_by(deleted_at=None)
                    .filter(or_(User.last_login < six_months_ago, User.last_login.is_(None)))
                    .order_by(User.id)
                    .all()
                )

                total = query.filter_by(deleted_at=None).count()

                return {
                    "data": response_data,
                    "page": page + 1,
                    "pages": math.ceil(total / page_size),
                    "count": total,
                    "pageSize": page_size,
                }

            else:
                filter_data = []

                for filter_item in filtered:
                    if filter_item["value"]:
                        filter_data.append(
                            User.__getattribute__(User, filter_item["id"]).ilike("%" + filter_item["value"] + "%")
                        )

                filter_query = ()

                if len(filter_data):
                    filter_query = tuple(filter_data)

                response_data = (
                    query.filter_by(deleted_at=None)
                    .order_by(asc(User.first_name), asc(User.last_name))
                    .filter(and_(*filter_query))
                    .offset(page * page_size)
                    .limit(page_size)
                    .all()
                )

                total = query.filter_by(deleted_at=None).count()

                return {
                    "data": response_data,
                    "page": page + 1,
                    "pages": math.ceil(total / page_size),
                    "count": total,
                    "pageSize": page_size,
                }
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message=UserErrors.USERS_LIST_ERROR.value,
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_user(self, request, request_data, is_nac_user):
        try:
            default_user_data = self.get_default_user_data(
                user_groups=request_data.user_groups,
                nac_user_roles=request_data.nac_user_roles,
                is_nac_user=is_nac_user,
            )
            user = User(
                first_name=request_data.first_name,
                last_name=request_data.last_name,
                email_address=request_data.email_address,
                created_by=request.state.user.id,
                access_key=True,
                password=(request_data.password if (request_data.password and request_data.password != "") else False),
                restricted_user=(
                    request_data.restricted_user
                    if request_data.restricted_user and request_data.restricted_user != ""
                    else False
                ),
                default_user_data=default_user_data,
            )
            self.db_session.add(user)
            self.db_session.commit()
            return user
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CREATE_USER_ERROR.value},
            )

    def get_user_by_email(self, email):
        try:
            return self.db_session.query(User).filter_by(email_address=email.lower(), deleted_at=None).first()
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.USER_BY_EMAIL_ERROR.value},
            )

    def get_user_by_id(self, user_id: int) -> User:
        """
        Gets the user details given the user id

        Args:
            user_id: user's id

        Returns:
            User details of the given user id
        """
        try:
            return self.db_session.query(User).filter_by(id=user_id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.GET_USER_ERROR.value},
            )

    def check_user_exists(self, email):
        try:
            return self.db_session.query(User).filter_by(email_address=email.lower()).count()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CHECK_USER_ERROR.value},
            )

    def update_user_password(
        self, user: User, request_data: UserUpdatePasswordSchema
    ) -> UserUpdatePasswordResponseSchema:
        """
        Updates the user login password

        Args:
            user: user object
            request_data: request data payload object

        Returns:
            A message specifying successful update of the user password
        """
        try:
            new_password = (
                getattr(request_data, "password")
                if getattr(request_data, "email", None)
                else getattr(request_data, "new_password")
            )
            user.password_hash = hashlib.pbkdf2_hmac(
                "sha256",
                new_password.encode("utf-8"),
                "codxauth".encode("utf-8"),
                100000,
                dklen=128,
            )
            self.db_session.commit()
            return {"message": UserSuccessMessages.USER_PASSWORD_UPDATE_SUCCESS_MESSAGE.value}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.USER_PASSWORD_UPDATE_ERROR.value},
            )

    def get_user_group_app_publish(self):
        try:
            return self.db_session.query(UserGroup).filter_by(deleted_at=None, app_publish=True).all()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CREATE_USER_ERROR.value},
            )

    def get_nac_role_by_name(self, name):
        try:
            return self.db_session.query(NacRoles).filter_by(name=name).first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.NAC_ROLE_BY_NAME_ERROR.value},
            )

    def get_default_user_data(self, user_groups, nac_user_roles, is_nac_user, auto_generation=False):
        try:
            updated_user_groups = []
            updated_nac_user_roles = []
            updated_user_groups.append(self.db_session.query(UserGroup).filter_by(name="default-user").first())
            if auto_generation:
                updated_user_groups.append(
                    self.db_session.query(UserGroup).filter(func.lower(UserGroup.name) == "coach").first()
                )
            if user_groups:
                for user_group_item in user_groups:
                    updated_user_groups.append(self.db_session.query(UserGroup).filter_by(id=user_group_item).first())
            if nac_user_roles and is_nac_user:
                for nac_user_role_item in nac_user_roles:
                    updated_nac_user_roles.append(
                        self.db_session.query(NacRoles).filter_by(id=nac_user_role_item).first()
                    )
            return {
                "user_groups": updated_user_groups,
                "nac_user_roles": updated_nac_user_roles,
            }
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.GET_DEFAULT_USER_DATA_ERROR.value},
            )

    def get_user_groups(self):
        try:
            return self.db_session.query(UserGroup).filter_by(deleted_at=None).order_by(desc(UserGroup.created_at))
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.GET_USER_GROUPS_ERROR.value},
            )

    def create_user_groups(self, request_data: UserGroupCreateRequestSchema, user_id):
        try:
            new_user_group = UserGroup(
                name=request_data.name,
                app=request_data.app,
                case_studies=request_data.case_studies,
                my_projects_only=request_data.my_projects_only,
                my_projects=request_data.my_projects,
                all_projects=request_data.all_projects,
                widget_factory=request_data.widget_factory,
                environments=request_data.environments,
                app_publish=request_data.app_publish,
                prod_app_publish=request_data.prod_app_publish,
                rbac=request_data.rbac,
                user_group_type=UserGroupType.USER_CREATED.value,
                created_by=user_id,
            )

            self.db_session.add(new_user_group)
            self.db_session.commit()

            return new_user_group
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"Error": UserErrors.CREATE_USER_GROUP_ERROR.value},
            )

    def get_user_group_by_id(self, user_group_id):
        try:
            user_group = (
                self.db_session.query(UserGroup)
                .filter_by(
                    id=user_group_id,
                    deleted_at=None,
                )
                .order_by(desc(UserGroup.created_at))
                .first()
            )

            return user_group

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.GET_USER_GROUP_BY_ID_ERROR.value},
            )

    def check_user_group_exist(self, user_group_id):
        try:
            user_group_exists = self.db_session.query(UserGroup).filter_by(id=user_group_id).count()

            return user_group_exists

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CHECK_USER_GROUP_ERROR.value},
            )

    def check_user_group_mapped_to_user(self, user_group_id):
        try:
            mapped_user_count = (
                self.db_session.query(UserGroup).filter(User.user_groups.any(UserGroup.id == user_group_id)).count()
            )
            if mapped_user_count > 0:
                return True

            return False

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CHECK_USER_MAPPED_TO_USER_GROUP_ERROR.value},
            )

    def update_user_group(self, request_data: UserGroupCreateRequestSchema, user_group_id, user_id):
        try:
            user_group = self.get_user_group_by_id(user_group_id)
            if user_group:
                user_group.name = request_data.name
                user_group.app = request_data.app
                user_group.case_studies = request_data.case_studies
                user_group.my_projects_only = request_data.my_projects_only
                user_group.my_projects = request_data.my_projects
                user_group.all_projects = request_data.all_projects
                user_group.widget_factory = request_data.widget_factory
                user_group.environments = request_data.environments
                user_group.app_publish = request_data.app_publish
                user_group.prod_app_publish = request_data.prod_app_publish if request_data.prod_app_publish else None
                user_group.rbac = request_data.rbac
                user_group.updated_by = user_id
                self.db_session.commit()

                return {"status": True}

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": UserErrors.USER_GROUP_UPDATE_ERROR.value},
            )

    def delete_user_group_by_id(self, user_group_id, user_id):
        try:
            user_group = self.db_session.query(UserGroup).filter_by(id=user_group_id).first()

            user_group.deleted_at = func.now()
            user_group.deleted_by = user_id
            self.db_session.commit()
            return user_group.name

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.DELETE_USER_GROUP_ERROR.value},
            )

    def get_nac_role_permissions(self):
        try:
            response = self.db_session.query(NacRolePermissions).filter(NacRoles.deleted_at.is_(None)).all()

            return response

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.NAC_ROLE_PERMISSIONS_ERROR.value},
            )

    def get_nac_role_permission_by_id(self, nac_role_permission_id):
        try:
            response = self.db_session.query(NacRolePermissions).filter_by(id=nac_role_permission_id).first()
            return response
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.NAC_ROLE_PERMISSIONS_BY_ID_ERROR.value},
            )

    def get_nac_user_roles(self):
        try:
            response = self.db_session.query(NacRoles).filter(NacRoles.deleted_at.is_(None)).all()

            return response

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.NAC_USER_ROLES_ERROR.value},
            )

    def get_nac_user_role_by_id(self, nac_user_role_id):
        try:
            response = self.db_session.query(NacRoles).filter_by(id=nac_user_role_id).first()

            return response

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"Error": UserErrors.NAC_USER_ROLES_BY_ID_ERROR.value},
            )

    def check_nac_role_exist_by_name(self, role_name):
        try:
            return self.db_session.query(NacRoles).filter_by(name=role_name).count()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CHECK_NAC_ROLE_ERROR.value},
            )

    def check_nac_role_exist_by_name_update(self, role_name, role_id):
        """
        Check Nac role exists by name other than the updating role id
        """
        try:
            return (
                self.db_session.query(NacRoles)
                .filter(
                    and_(
                        NacRoles.deleted_at.is_(None),
                        NacRoles.name == role_name,
                        NacRoles.id != role_id,
                    )
                )
                .count()
            )
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CHECK_NAC_ROLE_ERROR.value},
            )

    def check_nac_role_exist_by_id(self, role_id):
        try:
            return self.db_session.query(NacRoles).filter_by(id=role_id).count()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CHECK_NAC_ROLE_ERROR.value},
            )

    def create_nac_role(self, name, role_permissions, user_id):
        try:
            new_nac_role = NacRoles(
                name=name,
                role_permissions=role_permissions,
                user_role_type=UserGroupType.USER_CREATED.value,
                created_by=user_id,
            )

            self.db_session.add(new_nac_role)
            self.db_session.commit()
            return new_nac_role
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CREATE_NAC_ROLE_ERROR.value},
            )

    def update_nac_role(self, nac_user_role_id, request_data, user_id):
        try:
            user_role: NacRoles = self.get_nac_user_role_by_id(nac_user_role_id)
            user_role.name = request_data.name
            user_role.role_permissions = [self.get_nac_role_permission_by_id(id) for id in request_data.permissions]
            user_role.updated_by = user_id
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.UPDATE_NAC_ROLE_ERROR.value},
            )

    def delete_nac_user_role(self, nac_user_role_id, user_id):
        try:
            nac_role: NacRoles = self.get_nac_user_role_by_id(nac_user_role_id)
            if len(nac_role.users):
                nac_role.users = []

            nac_role.role_permissions = []
            nac_role.deleted_at = func.now()
            nac_role.deleted_by = user_id
            self.db_session.commit()

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.DELETE_NAC_ROLE_ERROR.value},
            )

    def create_user_token(self, user_name: str, user_email: str, access: str, token: str) -> UserToken:
        """
        Creates a new user token

        Args:
            user_name: user name
            user_email: user email
            access: stringified user accessses
            token: user token

        Returns:
            Newly created user token object
        """
        try:
            user_token = UserToken(
                None, user_name=user_name, user_email=user_email, execution_token=token, access=access
            )
            self.db_session.add(user_token)
            self.db_session.commit()
            return user_token
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CREATE_USER_TOKEN_ERROR.value},
            )

    def get_user_tokens_by_email(self, user_email: str) -> List[UserToken]:
        """
        Gets list of all user tokens given user email

        Args:
            user_email: user email

        Returns:
            List of all user tokens
        """
        try:
            tokens = (
                self.db_session.query(UserToken)
                .filter_by(deleted_at=None, user_email=user_email)
                .order_by(UserToken.id)
                .all()
            )
            return tokens
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.USER_GET_TOKENS_ERROR.value},
            )

    def create_user_passcode(self, user_id: int, user_email: str, secret: str, attempt: int) -> UserPasswordCode:
        """
        Creates a new user password code

        Args:
            user_id: user id
            user_email: user email
            secret: user passsword secret
            attempt: number of attempts done by the user

        Returns:
            Newly created user password code object
        """
        try:
            user_password_code = UserPasswordCode(
                user_id=user_id, user_email=user_email, secret=secret, attempt=attempt
            )
            self.db_session.add(user_password_code)
            self.db_session.commit()
            return user_password_code
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CREATE_USER_PASSCODE_ERROR.value},
            )

    def get_user_passcode_by_user_id(self, user_id: int) -> UserPasswordCode:
        """
        Gets user password code given user id

        Args:
            user_id: user id

        Returns:
            user password code object
        """
        try:
            return self.db_session.query(UserPasswordCode).filter_by(user_id=user_id).first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.NAC_ROLE_BY_NAME_ERROR.value},
            )

    def update_user_passcode(
        self,
        user_password_code: UserPasswordCode,
        verify_attempt: int = None,
        attempt: int = None,
        secret: str = None,
        updated_at: datetime = None,
    ) -> UserSuccessResponseSchema:
        """
        Updates the user password code with the given details

        Args:
            user_password_code: user password code object
            verify_attempt: int
            attempt: number of attempts done by the user
            secret: user passsword secret
            updated_at: timestamp when this record is updated

        Returns:
            success message
        """
        try:
            user_password_code.verify_attempt = verify_attempt if verify_attempt else user_password_code.verify_attempt
            user_password_code.attempt = attempt if attempt else user_password_code.attempt
            user_password_code.secret = secret if secret else user_password_code.secret
            user_password_code.updated_at = updated_at if updated_at else user_password_code.updated_at
            self.db_session.commit()
            return {"message": UserSuccessMessages.USER_PASSCODE_UPDATE_SUCCESS_MESSAGE.value}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.USER_PASSCODE_UPDATE_ERROR.value},
            )

    def add_user(
        self,
        first_name: str,
        last_name: str,
        email_address: str,
        user_groups: List,
        restricted_user: bool,
        access_key: bool,
        login: bool,
    ) -> User:
        """
        Adds user

        Args:
            first_name: user first name
            last_name: user last name
            email_address: user email address
            user_groups: user groups
            restricted_user: flag to know whether user is a restricted user
            access_key: access key flag
            login: flag to update user's last login time

        Returns:
            Added user object
        """
        try:
            default_user_data = self.get_default_user_data(
                user_groups=user_groups,
                nac_user_roles=[],
                is_nac_user=False,
            )
            user = User(
                first_name=first_name,
                last_name=last_name,
                email_address=email_address,
                restricted_user=restricted_user,
                access_key=access_key,
                login=login,
                default_user_data=default_user_data,
            )
            self.db_session.add(user)
            self.db_session.commit()
            return user
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.CREATE_USER_ERROR.value},
            )

    def update_user_last_login(self, user: User) -> User:
        """
        Updates the user last login time

        Args:
            user: user object to update

        Returns:
            User object
        """
        try:
            user.last_login = func.now()
            self.db_session.commit()

            return user
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.USER_LAST_LOGIN_UPDATE_ERROR.value},
            )

    def update_user_failed_login_details(self, user: User, failed_login_count: int, failed_login_at: str) -> User:
        """
        Updates the user failed login details

        Args:
            user: user object to update
            failed_login_count: failed login count
            failed_login_at: failed login timestamp

        Returns:
            User object
        """
        try:
            user.failed_login_count = failed_login_count
            user.failed_login_at = failed_login_at
            self.db_session.commit()

            return user
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.USER_FAILED_LOGIN_DETAILS_UPDATE_ERROR.value},
            )

    def update_user_last_logout(self, user: User) -> User:
        """
        Updates the user last logout time

        Args:
            user: user object to update

        Returns:
            User object
        """
        try:
            user.last_logout = func.now()
            self.db_session.commit()

            return user
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": UserErrors.USER_LAST_LOGOUT_UPDATE_ERROR.value},
            )
