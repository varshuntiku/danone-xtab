# from api.databases.session import SessionLocal
from datetime import datetime

import pytz
from api.databases.dependencies import get_db
from api.middlewares.error_middleware import GeneralException
from fastapi import status


class BaseDao:
    def __init__(self):
        self.db_session = next(get_db())
        # self.db_session = SessionLocal()

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type:
            # logging.debug(f"Exception {exc_type} occurred with value {exc_value}")
            raise GeneralException(
                message={str(exc_value)},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        self.db_session.close()

    def perform_rollback(self):
        self.db_session.rollback()
        self.db_session.close()
        self.db_session = next(get_db())

    def close_session(self):
        self.db_session.close()

    def perform_pagination(self, query, page, page_size):
        if page >= 0 and page_size > 0:
            return query.offset((page + 1) * page_size - page_size).limit(
                page_size
            )  # Adding +1 as frontend is working with 0 indexing
        return query

    def set_created_at(self):
        utc_now = datetime.now(pytz.utc)
        timezone = pytz.timezone("Asia/Kolkata")
        local_time = utc_now.astimezone(timezone)
        return local_time
