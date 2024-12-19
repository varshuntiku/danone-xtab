import logging
from datetime import datetime, timedelta

import pytz
from api.databases.session import SessionLocal
from api.models.base_models import ExecutionEnvironment


def handle_interrupted_services() -> callable:
    logging.info("Startup process to handle interrupted service is initiated.")
    db_session = SessionLocal()

    utc_now = datetime.now(pytz.utc)
    timezone = pytz.timezone("Asia/Kolkata")
    local_time = utc_now.astimezone(timezone)
    datetime_validity = local_time - timedelta(days=1)

    entries_to_bulk_update = []

    try:
        interrupted_execution_environments = (
            db_session.query(ExecutionEnvironment)
            .filter(
                ExecutionEnvironment.deleted_at.is_(None),
                ExecutionEnvironment.is_active.is_(True),
                ExecutionEnvironment.created_at > datetime_validity,
                ExecutionEnvironment.status.notin_(["Running", "Failed", "Stopped"]),
            )
            .all()
        )

        if interrupted_execution_environments:
            for execution_environment in interrupted_execution_environments:
                entries_to_bulk_update.append({"id": execution_environment.id, "status": "Failed"})

        db_session.bulk_update_mappings(ExecutionEnvironment, entries_to_bulk_update)
        db_session.commit()
        logging.info("Startup process to handle interrupted service is completed sucessfully.")
    except Exception as e:
        logging.exception(f"Handle Interrupted Service is failed on startup due to {e}.")
        db_session.rollback()
