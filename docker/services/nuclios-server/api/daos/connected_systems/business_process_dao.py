import logging
from typing import List

from api.constants.connected_systems.business_process_error_messages import (
    BusinessProcessErrors,
)
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ConnSystemBusinessProcess, ConnSystemDriver
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_, func


class BusinessProcessDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_business_processes(self, conn_system_dashboard_id: int) -> List[ConnSystemBusinessProcess]:
        """
        Gets list of all business processes

        Returns:
            List of business processes
        """
        try:
            return (
                self.db_session.query(ConnSystemBusinessProcess)
                .filter(
                    and_(
                        ConnSystemDriver.dashboard_id == conn_system_dashboard_id,
                        ConnSystemBusinessProcess.deleted_at.is_(None),
                    )
                )
                .join(ConnSystemDriver)
                .order_by(ConnSystemBusinessProcess.driver_id, ConnSystemBusinessProcess.order_by)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessErrors.GET_BUSINESS_PROCESSES_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_business_processes_by_driver(self, conn_system_driver_id: int) -> List[ConnSystemBusinessProcess]:
        """
        Gets list of all business processes

        Returns:
            List of business processes
        """
        try:
            return (
                self.db_session.query(ConnSystemBusinessProcess)
                .filter_by(driver_id=conn_system_driver_id, deleted_at=None)
                .order_by(ConnSystemBusinessProcess.driver_id, ConnSystemBusinessProcess.order_by)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessErrors.GET_BUSINESS_PROCESSES_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_business_process(
        self,
        conn_system_driver_id: int,
        name: str,
        order_by: int,
        is_active: bool,
        process_config: str,
        intelligence_config: str,
        foundation_config: str,
        created_by: int,
    ) -> ConnSystemBusinessProcess:
        """
        Adds new Connected system business_process to the database

        Args:
            name: name
            industry: industry
            function: function
            description: description
            business_process_url: business_process url
            is_active: is_active
            created_by: id of user creating the business_process

        Returns:
            Connected system business_process object
        """
        try:
            connSystemBusinessProcess = ConnSystemBusinessProcess(
                driver_id=conn_system_driver_id,
                name=name,
                order_by=order_by,
                is_active=is_active,
                process_config=process_config,
                intelligence_config=intelligence_config,
                foundation_config=foundation_config,
                created_by=created_by,
            )
            self.db_session.add(connSystemBusinessProcess)
            self.db_session.commit()
            return connSystemBusinessProcess
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessErrors.CREATE_BUSINESS_PROCESS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_business_process(self, conn_system_business_process_id: int) -> ConnSystemBusinessProcess:
        """
        Gets conn system business_process given id

        Args:
            conn_system_business_process_id: conn system business_process id

        Returns:
            Connected System BusinessProcess object
        """
        try:
            return (
                self.db_session.query(ConnSystemBusinessProcess)
                .filter_by(id=conn_system_business_process_id, deleted_at=None)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessErrors.GET_BUSINESS_PROCESS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_business_process(
        self,
        connSystemBusinessProcess: ConnSystemBusinessProcess,
        driver_id: str,
        name: str,
        order_by: int,
        is_active: bool,
        process_config: str,
        intelligence_config: str,
        foundation_config: str,
        updated_by: int,
    ) -> dict:
        """
        Updates the given connected system business_process

        Args:
            connSystemBusinessProcess: Connected System BusinessProcess object to update
            name: name
            industry: industry
            function: function
            description: description
            small_logo_blob_name: small_logo_blob_name
            is_active: is_active
            updated_by: id of user updating the conn system business_process

        Returns:
            Success message
        """
        try:
            connSystemBusinessProcess.driver_id = driver_id
            connSystemBusinessProcess.name = name
            connSystemBusinessProcess.order_by = order_by
            connSystemBusinessProcess.is_active = is_active
            connSystemBusinessProcess.process_config = process_config
            connSystemBusinessProcess.intelligence_config = intelligence_config
            connSystemBusinessProcess.foundation_config = foundation_config
            connSystemBusinessProcess.updated_at = func.now()
            connSystemBusinessProcess.updated_by = updated_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessErrors.UPDATE_BUSINESS_PROCESS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_business_process(self, connSystemBusinessProcess: ConnSystemBusinessProcess, deleted_by: int) -> dict:
        """
        Deletes the given connected system business_process

        Args:
            connSystemBusinessProcess: Connected System BusinessProcess object to update
            deleted_by: id of user deleting the business_process

        Returns:
            Success message
        """
        try:
            connSystemBusinessProcess.deleted_at = func.now()
            connSystemBusinessProcess.deleted_by = deleted_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": BusinessProcessErrors.DELETE_BUSINESS_PROCESS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
