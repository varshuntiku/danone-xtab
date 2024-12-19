import logging
from datetime import datetime
from typing import List

from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import LoginConfig, UserLoginAuthCode
from sqlalchemy.orm import Session


class SAMLDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def perform_commit(self):
        return super().perform_commit()

    def perform_rollback(self):
        return super().perform_rollback()

    def create_user_login_auth_code(
        self,
        user_email: str,
        auth_code: bytes,
        expiry: datetime,
    ) -> None:
        """
        Add user login auth code

        Args:
            user_email: email of user for which auth code was created
            auth_code: auth_code string
        """
        try:
            new_auth_code = UserLoginAuthCode(
                email=user_email,
                auth_code=auth_code,
                expiry=expiry,
            )
            self.db_session.add(new_auth_code)
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(message={"error": "Error creating auth code"})

    def update_user_login_auth_code(
        self,
        user_email: str,
        auth_code: bytes,
        expiry: datetime,
    ) -> None:
        """
        Update user login auth code

        Args:
            user_email: email of user for which auth code was created
            auth_code: auth_code string
            expiry (optional): expiry time for auth_code
        """
        try:
            user_login_auth_code: UserLoginAuthCode = self.get_user_login_auth_code_by_email(user_email)
            user_login_auth_code.auth_code = auth_code
            user_login_auth_code.expiry = expiry
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(message={"error": "Error updating auth code"})

    def check_user_login_auth_code_by_email(self, user_email: str) -> int:
        """
        Count of auth code entries by given email id

        Args:
            user_email: email of user for which auth code was created
        """
        try:
            exists = self.db_session.query(UserLoginAuthCode).filter_by(email=user_email).count()
            return exists
        except Exception as e:
            logging.exception(e)
            raise GeneralException(message={"error": "Error checking auth code exists"})

    def get_user_login_auth_code_by_email(self, user_email: str) -> UserLoginAuthCode:
        """
        Get user login auth code by email id

        Args:
            user_email: email of user
        """
        try:
            user_login_auth_code = self.db_session.query(UserLoginAuthCode).filter_by(email=user_email).first()
            return user_login_auth_code
        except Exception as e:
            logging.exception(e)
            raise GeneralException(message={"error": "Error getting auth code by email"})

    def get_login_config(self, config_name: str) -> LoginConfig:
        """
        Get Login Config

        Args:
            config_name: config name

        Returns:
            None
        """
        try:
            return self.db_session.query(LoginConfig).filter_by(config_name=config_name).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(message={"error": "Error getting login config"})

    def update_saml_config(self, login_config: LoginConfig, data) -> None:
        """
        Update saml login config data for saml

        Args:
            login_config: login config object
            form_data: request form data

        Returns:
            None
        """
        try:
            login_config.config_data = {
                "metadata_blob_name": "saml_metadata.xml",
                "display_name": data.get("display_name", None),
            }
            self.db_session.flush()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(message={"error": "Error getting login config"})

    def update_config(self, login_config: LoginConfig, data):
        """
        Update login config data

        Args:
            login_config: Login config object
            data: request data to be updated

        Returns:
            None
        """
        try:
            login_config.is_enabled = data.get("enabled", False)
            login_config.config_data = (
                {
                    **login_config.config_data,
                    "display_name": data.get("display_name", None),
                }
                if login_config.config_data
                else {"display_name": data.get("display_name", None)}
            )
            self.db_session.flush()
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(message={"error": "Error updating login config"})

    def get_config(self) -> List[LoginConfig]:
        """
        Get login config list

        Args:
             None

        Returns:
            List[LoginConfig]
        """
        try:
            return self.db_session.query(LoginConfig).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(message={"error": "Error getting login config"})
