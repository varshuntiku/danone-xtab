import logging
from typing import List

from api.constants.connected_systems.driver_error_messages import DriverErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ConnSystemDriver
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class DriverDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_drivers(self, conn_system_dashboard_id: int) -> List[ConnSystemDriver]:
        """
        Gets list of all drivers

        Returns:
            List of drivers
        """
        try:
            return (
                self.db_session.query(ConnSystemDriver)
                .filter_by(
                    dashboard_id=conn_system_dashboard_id,
                    deleted_at=None
                )
                .order_by(ConnSystemDriver.order_by)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DriverErrors.GET_DRIVERS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_driver(
        self,
        conn_system_dashboard_id: int,
        name: str,
        order_by: int,
        is_active: bool,
        end_user_add: bool,
        created_by: int,
    ) -> ConnSystemDriver:
        """
        Adds new Connected system driver to the database

        Args:
            name: name
            industry: industry
            function: function
            description: description
            driver_url: driver url
            is_active: is_active
            created_by: id of user creating the driver

        Returns:
            Connected system driver object
        """
        try:
            connSystemDriver = ConnSystemDriver(
                dashboard_id=conn_system_dashboard_id,
                name=name,
                order_by=order_by,
                is_active=is_active,
                end_user_add=end_user_add,
                created_by=created_by,
            )
            self.db_session.add(connSystemDriver)
            self.db_session.commit()
            return connSystemDriver
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DriverErrors.CREATE_DRIVER_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_driver(self, conn_system_driver_id: int) -> ConnSystemDriver:
        """
        Gets conn system driver given id

        Args:
            conn_system_driver_id: conn system driver id

        Returns:
            Connected System Driver object
        """
        try:
            return self.db_session.query(ConnSystemDriver).filter_by(id=conn_system_driver_id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DriverErrors.GET_DRIVER_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_driver(
        self,
        connSystemDriver: ConnSystemDriver,
        name: str,
        order_by: int,
        is_active: bool,
        end_user_add: bool,
        updated_by: int,
    ) -> dict:
        """
        Updates the given connected system driver

        Args:
            connSystemDriver: Connected System Driver object to update
            name: name
            industry: industry
            function: function
            description: description
            small_logo_blob_name: small_logo_blob_name
            is_active: is_active
            updated_by: id of user updating the conn system driver

        Returns:
            Success message
        """
        try:
            connSystemDriver.name = name
            connSystemDriver.order_by = order_by
            connSystemDriver.is_active = is_active
            connSystemDriver.end_user_add = end_user_add
            connSystemDriver.updated_at = func.now()
            connSystemDriver.updated_by = updated_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DriverErrors.UPDATE_DRIVER_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_driver(self, connSystemDriver: ConnSystemDriver, deleted_by: int) -> dict:
        """
        Deletes the given connected system driver

        Args:
            connSystemDriver: Connected System Driver object to update
            deleted_by: id of user deleting the driver

        Returns:
            Success message
        """
        try:
            connSystemDriver.deleted_at = func.now()
            connSystemDriver.deleted_by = deleted_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DriverErrors.DELETE_DRIVER_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
