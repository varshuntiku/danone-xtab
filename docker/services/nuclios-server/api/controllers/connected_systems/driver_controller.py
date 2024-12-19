from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.connected_systems.driver_schema import (
    CreateDriverResponseSchema,
    CreateUpdateDriverSchema,
    DriverDataSchema,
    DriverFrontendSchema,
    DriverSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.serializers.connected_systems.driver_serializer import (
    DriverDataSerializer,
    DriverFrontendSerializer,
    DriverListSerializer,
)
from api.services.connected_systems.driver_service import DriverService


class DriverController(BaseController):
    def get_driver_details(self, conn_system_dashboard_id: int) -> List[DriverFrontendSchema]:
        with DriverService() as goal_service:
            goals = goal_service.get_drivers(conn_system_dashboard_id)
            response = []
            for goal in goals:
                serializer = DriverFrontendSerializer(goal)
                response.append(serializer.serialized_data)
            return response

    def get_drivers(self, conn_system_dashboard_id: int) -> List[DriverSchema]:
        with DriverService() as driver_service:
            drivers = driver_service.get_drivers(conn_system_dashboard_id)
            response = []
            for driver in drivers:
                serializer = DriverListSerializer(driver)
                response.append(serializer.serialized_data)
            return response

    def get_driver(self, conn_system_driver_id: int) -> DriverDataSchema:
        with DriverService() as driver_service:
            driver = driver_service.get_driver(conn_system_driver_id)
            serializer = DriverDataSerializer(driver)
            return serializer.serialized_data

    def create_driver(
        self, user_id: int, conn_system_dashboard_id: int, request_data: CreateUpdateDriverSchema
    ) -> CreateDriverResponseSchema:
        with DriverService() as driver_service:
            response = driver_service.create_driver(user_id, conn_system_dashboard_id, request_data)
            return response

    def update_driver(
        self, user_id: int, conn_system_driver_id: int, request_data: CreateUpdateDriverSchema
    ) -> MessageResponseSchema:
        with DriverService() as driver_service:
            response = driver_service.update_driver(user_id, conn_system_driver_id, request_data)
            return response

    def delete_driver(self, user_id: int, conn_system_driver_id: int) -> MessageResponseSchema:
        with DriverService() as driver_service:
            response = driver_service.delete_driver(user_id, conn_system_driver_id)
            return response
