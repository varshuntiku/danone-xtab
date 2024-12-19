from typing import List

from api.constants.connected_systems.driver_error_messages import DriverErrors
from api.constants.connected_systems.driver_success_messages import DriverSuccess
from api.daos.connected_systems.driver_dao import DriverDao
from api.dtos.connected_systems.driver_dto import CreateDriverDTO, DriverDTO
from api.middlewares.error_middleware import GeneralException
from api.schemas.connected_systems.driver_schema import (
    CreateDriverResponseSchema,
    CreateUpdateDriverSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService
from fastapi import status


class DriverService(BaseService):
    def __init__(self):
        super().__init__()
        self.driver_dao = DriverDao(self.db_session)

    def get_drivers(self, conn_system_dashboard_id: int) -> List[DriverDTO]:
        drivers = self.driver_dao.get_drivers(conn_system_dashboard_id)
        return [DriverDTO(driver) for driver in drivers]

    def get_driver(self, conn_system_driver_id: int) -> DriverDTO:
        driver = self.driver_dao.get_driver(conn_system_driver_id)
        return DriverDTO(driver)

    def create_driver(
        self, user_id: int, conn_system_dashboard_id: int, request_data: CreateUpdateDriverSchema
    ) -> CreateDriverResponseSchema:
        driver = self.driver_dao.create_driver(
            conn_system_dashboard_id=conn_system_dashboard_id,
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            end_user_add=getattr(request_data, "end_user_add", None),
            created_by=user_id,
        )
        return {"status": "success", "driver_data": CreateDriverDTO(driver)}

    def update_driver(
        self, user_id: int, conn_system_driver_id: int, request_data: CreateUpdateDriverSchema
    ) -> MessageResponseSchema:
        driver = self.driver_dao.get_driver(conn_system_driver_id)

        if not driver:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": DriverErrors.DRIVER_NOT_FOUND_ERROR.value},
            )

        self.driver_dao.update_driver(
            connSystemDriver=driver,
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            end_user_add=getattr(request_data, "end_user_add", None),
            updated_by=user_id,
        )
        return {"message": DriverSuccess.DRIVER_UPDATE_SUCCESS.value}

    def delete_driver(self, user_id: int, conn_system_driver_id: int) -> MessageResponseSchema:
        driver = self.driver_dao.get_driver(conn_system_driver_id)

        if not driver:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": DriverErrors.DRIVER_NOT_FOUND_ERROR.value},
            )

        self.driver_dao.delete_driver(
            connSystemDriver=driver,
            deleted_by=user_id,
        )
        return {"message": DriverSuccess.DRIVER_DELETE_SUCCESS.value}
