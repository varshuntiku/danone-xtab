from sqlalchemy.orm import Session


class BaseDao:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def perform_rollback(self):
        self.db_session.rollback()

    def perform_commit(self):
        self.db_session.commit()
        self.db_session.close()

    def perform_pagination(self, query, page, page_size):
        if page >= 0 and page_size > 0:
            return query.offset((page + 1) * page_size - page_size).limit(
                page_size
            )  # Adding +1 as frontend is working with 0 indexing
        return query
