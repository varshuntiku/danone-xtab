import logging

from api.daos.base_daos import BaseDao
from api.models.base_models import User
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class LoginDao(BaseDao):
    """
    Login DAO.
    """

    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_user_by_email(self, email_address):
        return self.db_session.query(User).filter_by(email_address=email_address.lower()).first()

    def update_user_login_detail(self, user, validated_data):
        try:
            user.failed_login_count = validated_data["failed_login_count"]
            user.failed_login_at = validated_data["failed_login_at"]
            self.db_session.commit()
            return True
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            return False

    def update_user_logout_detail(self, request):
        try:
            user = request.state.user
            user.last_logout = func.now()
            self.db_session.commit()
            return True
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            return False
