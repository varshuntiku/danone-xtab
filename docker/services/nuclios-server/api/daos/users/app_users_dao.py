import logging
from typing import Dict, List

from api.constants.users.app_users_error_messages import AppUsersErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import App, AppUser, AppUserRole, app_user_role_identifier
from fastapi import status
from sqlalchemy import and_
from sqlalchemy.orm import Session
from sqlalchemy.sql import asc, func


class AppUsersDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def perform_rollback(self):
        """
        Perform rollback if an error occured
        """
        return super().perform_rollback()

    def perform_commit(self):
        """
        Perform commit after all necessary operation are completed without error
        """
        return super().perform_commit()

    def get_app_user_roles_by_app_id(self, app_id: int) -> List[AppUserRole]:
        """
        Gets ordered app user roles given the app id

        Args:
            app_id: app's id

        Returns:
            Ordered app user roles list
        """
        try:
            return (
                self.db_session.query(AppUserRole)
                .filter_by(app_id=app_id, deleted_at=None)
                .order_by(asc(AppUserRole.id))
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USER_ROLES_ERROR.value},
            )

    def get_app_users_by_app_id(self, app_id: int) -> List[AppUser]:
        """
        Gets ordered app users given the app id

        Args:
            app_id: app's id

        Returns:
            Ordered app users list
        """
        try:
            return self.db_session.query(AppUser).filter_by(app_id=app_id, deleted_at=None).order_by(asc(AppUser.id))
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USERS_ERROR.value},
            )

    def get_app_user_by_id(self, id: int) -> AppUser:
        """
        Gets app user given id

        Args:
            id: app user's id

        Returns:
            app user object
        """
        try:
            return self.db_session.query(AppUser).filter_by(id=id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USER_ERROR.value},
            )

    def get_app_user_role_by_id(self, id: int) -> AppUserRole:
        """
        Gets app user role given id

        Args:
            id: app user role's id

        Returns:
            app user role object
        """
        try:
            return self.db_session.query(AppUserRole).filter_by(id=id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USER_ROLE_ERROR.value},
            )

    def get_all_app_users_by_id(self, ids_list: List[int]) -> List[AppUser]:
        """
        Gets app users list given a list of ids

        Args:
            ids_list: app users ids list

        Returns:
            list of app users
        """
        try:
            return self.db_session.query(AppUser).filter(AppUser.id.in_(ids_list)).filter_by(deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USERS_ERROR.value},
            )

    def get_app_user_role_identifier_by_role_id(self, role_id: int) -> List:
        """
        Gets all app users mappings given a role id

        Args:
            role_id: appuser role id

        Returns:
            app users list with the given role
        """
        try:
            return self.db_session.query(app_user_role_identifier).filter_by(app_user_role_id=role_id).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USERS_ROLE_MAPPING_ERROR.value},
            )

    def delete_app_user_role(self, app_user_role: AppUserRole, role_id: int, user_id: int) -> Dict:
        """
        Deletes the app user role

        Args:
            app_user_role: AppUserRole object
            role_id: appuser role id
            user_id: id of the user deleting the role

        Returns:
            success message
        """
        try:
            app_user_role.deleted_at = func.now()
            app_user_role.deleted_by = user_id
            self.delete_app_user_role_identifier(role_id)
            self.db_session.commit()
            return {"success": True}

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.DELETE_APP_USER_ROLE_ERROR.value},
            )

    def delete_app_user_role_identifier(self, role_id: int):
        """
        Deletes entries associated with the passed role id

        Args:
            role_id: appuser role id
        """
        try:
            return self.db_session.query(app_user_role_identifier).filter_by(app_user_role_id=role_id).delete()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.DELETE_APP_USER_ROLE_ERROR.value},
            )

    def delete_app_user(self, app_user: AppUser, app_user_id: int, user_id: int, flush_only: bool = False) -> Dict:
        """
        Deletes the app user

        Args:
            app_user: AppUser object
            app_user_id: appuser id
            user_id: id of the user deleting the role

        Returns:
            success message
        """
        try:
            app_user.deleted_at = func.now()
            app_user.deleted_by = user_id
            self.delete_app_user_identifier(app_user_id)

            self.db_session.flush() if flush_only else self.db_session.commit()

            return {"success": True}

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.DELETE_APP_USER_ERROR.value},
            )

    def delete_app_user_identifier(self, app_user_id: int):
        """
        Deletes entries associated with the passed app user id

        Args:
            app_user_id: appuser id
        """
        try:
            return self.db_session.query(app_user_role_identifier).filter_by(app_user_id=app_user_id).delete()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.DELETE_APP_USER_ERROR.value},
            )

    def update_app_user_role(
        self, app_user_role: AppUserRole, name: str, app_id: int, permissions: str, user_id: int
    ) -> Dict:
        """
        Updates app user role

        Args:
            app_user_role: AppUserRole object
            name: role name
            app_id: app id
            permissions: role permissions
            user_id: id of the user updating the app user role

        Returns:
            success message
        """
        try:
            app_user_role.name = name
            app_user_role.app_id = app_id
            app_user_role.permissions = permissions
            app_user_role.updated_by = user_id
            app_user_role.updated_at = func.now()
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.UPDATE_APP_USER_ROLE_ERROR.value},
            )

    def get_custom_filtered_app_user_role(self, name: str, app_id: int, app_user_role_id: int) -> AppUserRole:
        """
        Gets app user role for some custom filters

        Args:
            name: role name
            app_id: app id
            app_user_role_id: app user role id

        Returns:
            The filtered app user role object
        """
        try:
            return (
                self.db_session.query(AppUserRole)
                .filter_by(name=name)
                .filter_by(app_id=app_id)
                .filter(AppUserRole.id != app_user_role_id)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USER_ROLE_ERROR.value},
            )

    def update_app_user(
        self,
        app_user: AppUser,
        first_name: str,
        last_name: str,
        app_id: int,
        user_email: str,
        user_roles: List[AppUserRole],
        permissions: str,
        user_id: int,
    ) -> Dict:
        """
        Updates app user

        Args:
            app_user: AppUser object
            app_id: app id
            first_name: user first name
            last_name: user last name
            user_email: user email address
            user_roles: the user roles
            permissions: role permissions
            user_id: id of the user updating the app user role

        Returns:
            success message
        """
        try:
            app_user.app_id = app_id
            app_user.first_name = first_name
            app_user.last_name = last_name
            app_user.user_email = user_email
            app_user.user_roles = user_roles
            app_user.permissions = permissions
            app_user.updated_by = user_id
            app_user.updated_at = func.now()
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.UPDATE_APP_USER_ERROR.value},
            )

    def get_custom_filtered_app_user(self, email_address: str, app_id: int, app_user_id: int) -> AppUser:
        """
        Gets app user for some custom filters

        Args:
            email_address: user email address
            app_id: app id
            app_user_id: app user id

        Returns:
            The filtered app user object
        """
        try:
            return (
                self.db_session.query(AppUser)
                .filter_by(user_email=email_address)
                .filter_by(app_id=app_id)
                .filter(AppUser.id != app_user_id)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USER_ERROR.value},
            )

    def get_role_by_name_app_id(self, name: str, app_id: int) -> AppUserRole:
        """
        Gets app user role given role name and app id

        Args:
            name: role name
            app_id: app id

        Returns:
            The filtered app user role object
        """
        try:
            return self.db_session.query(AppUserRole).filter_by(name=name).filter_by(app_id=app_id).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USER_ROLE_ERROR.value},
            )

    def create_app_user_role(self, name: str, app_id: int, permissions: str, user_id: int) -> AppUserRole:
        """
        Creates new app user role

        Args:
            name: role name
            app_id: app id
            permissions: permissions associated with the role

        Returns:
            Newly created app user role object
        """
        try:
            app_user_role = AppUserRole(name=name, app_id=app_id, permissions=permissions, created_by=user_id)
            self.db_session.add(app_user_role)
            self.db_session.commit()
            return app_user_role
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.CREATE_APP_USER_ROLE_ERROR.value},
            )

    def get_app_user_by_email_app_id(self, email_address: str, app_id: int) -> AppUser:
        """
        Gets app user given user email address and app id

        Args:
            email_address: user email address
            app_id: app id

        Returns:
            The filtered app user object
        """
        try:
            return (
                self.db_session.query(AppUser)
                .filter(
                    (func.lower(AppUser.user_email) == func.lower(email_address))
                    & (AppUser.app_id == app_id)
                    & (AppUser.deleted_at.is_(None))
                )
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USER_ERROR.value},
            )

    def create_app_user(
        self,
        first_name: str,
        last_name: str,
        app_id: int,
        email_address: str,
        user_roles: List[int],
        permissions: str,
        user_id: int,
        flush_only: bool = False,
    ) -> AppUserRole:
        """
        Creates new app user

        Args:
            app_id: app id
            first_name: user first name
            last_name: user last name
            user_email: user email address
            user_roles: list of user role ids
            permissions: permissions associated with the role

        Returns:
            Newly created app user object
        """
        try:
            app_user = AppUser(
                app_id=app_id,
                first_name=first_name,
                last_name=last_name,
                user_email=email_address,
                user_roles=user_roles,
                permissions=permissions,
                created_by=user_id,
            )
            self.db_session.add(app_user)
            self.db_session.flush() if flush_only else self.db_session.commit()
            return app_user
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.CREATE_APP_USER_ERROR.value},
            )

    def get_all_app_users_by_app_id(self, app_id: int) -> List[AppUser]:
        """
        Gets app users list given app id

        Args:
            app_id: app id

        Returns:
            list of app users
        """
        try:
            return self.db_session.query(AppUser).filter_by(app_id=app_id).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.GET_APP_USERS_ERROR.value},
            )

    def update_app_user_permissions(self, app_user: AppUser, permissions: str, user_id: int) -> Dict:
        """
        Updates app user permissions

        Args:
            app_user: AppUser object
            permissions: role permissions
            user_id: id of the user updating the app user role

        Returns:
            success message
        """
        try:
            app_user.permissions = permissions
            app_user.updated_by = user_id
            app_user.updated_at = func.now()
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.UPDATE_APP_USER_ERROR.value},
            )

    def get_all_user_apps_by_email(self, email_address: str) -> List[AppUser]:
        """
        Gets apps for the given email address

        Args:
            email_address: email address of the logged in user

        Returns:
            List of user apps
        """
        try:
            return (
                self.db_session.query(AppUser)
                .filter((func.lower(AppUser.user_email) == func.lower(email_address)) & (AppUser.deleted_at.is_(None)))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.USER_APPS_ERROR.value},
            )

    def get_all_apps_by_email(self, email_address: str) -> List:
        """
        Gets all apps with the app details for the given email address

        Args:
            email_address: email address of the logged in user

        Returns:
            List of user apps
        """
        try:
            return (
                self.db_session.query(AppUser, App)
                .filter(
                    and_(
                        AppUser.user_email == email_address,
                        AppUser.app_id == App.id,
                        AppUser.deleted_at.is_(None),
                    )
                )
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppUsersErrors.USER_APPS_ERROR.value},
            )
