import logging

from api.configs.settings import get_app_settings
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import scoped_session, sessionmaker

settings = get_app_settings()

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_size=30, max_overflow=40, pool_recycle=1800)
all_sessions = []
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

GLOBAL_TIMEOUT = 10000  # 60 seconds

# Set up the event listener
# @event.listens_for(engine, "before_cursor_execute")
# def set_query_timeout(conn, cursor, statement, parameters, context, executemany):
#     cursor.statement_timeout = GLOBAL_TIMEOUT


def limit_all_sessions():
    global all_sessions
    if len(all_sessions) > 100:
        all_sessions = all_sessions[-70:]


def SessionLocal():
    session_ = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
    # if not all_sessions:
    all_sessions.append(session_)
    # else:
    #     all_sessions[0] = session_
    limit_all_sessions()
    return session_


def force_restart_engine(close_sessions=False, retries=0):
    global engine
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_size=30, max_overflow=40, pool_recycle=1800)
    if close_sessions:
        try:
            expire_all_sessions()
            close_all_sessions()
        except Exception as e:
            logging.info(f"Error closing all sessions: {e}")
            if retries > 2:
                pass
            return force_restart_engine(close_sessions, retries + 1)


def expire_all_sessions():
    """Rollback all registered sessions."""
    for session in all_sessions:
        try:
            session.expire_all()
            # rollback()
        except SQLAlchemyError as e:
            logging.info(f"Error rolling back session: {e}")


def close_all_sessions():
    """Close all registered sessions."""
    for session in all_sessions:
        session.close()
    # all_sessions.clear()
    logging.info("Closed all sessions.")
