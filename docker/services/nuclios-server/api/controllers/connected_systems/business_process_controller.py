from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.connected_systems.business_process_schema import (
    BusinessProcessDataSchema,
    BusinessProcessSchema,
    CreateBusinessProcessResponseSchema,
    CreateBusinessProcessSchema,
    CreateBusinessProcessFromTemplateSchema,
    UpdateBusinessProcessSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.serializers.connected_systems.business_process_serializer import (
    BusinessProcessDataSerializer,
    BusinessProcessListSerializer,
)
from api.services.connected_systems.business_process_service import (
    BusinessProcessService,
)


class BusinessProcessController(BaseController):
    def get_business_processes(self, conn_system_dashboard_id: int) -> List[BusinessProcessSchema]:
        with BusinessProcessService() as business_process_service:
            business_processes = business_process_service.get_business_processes(conn_system_dashboard_id)
            response = []
            for business_process in business_processes:
                serializer = BusinessProcessListSerializer(business_process)
                response.append(serializer.serialized_data)
            return response

    def get_business_processes_by_driver(self, conn_system_driver_id: int) -> List[BusinessProcessSchema]:
        with BusinessProcessService() as business_process_service:
            business_processes = business_process_service.get_business_processes_by_driver(conn_system_driver_id)
            response = []
            for business_process in business_processes:
                serializer = BusinessProcessListSerializer(business_process)
                response.append(serializer.serialized_data)
            return response

    def get_business_process(self, conn_system_business_process_id: int) -> BusinessProcessDataSchema:
        with BusinessProcessService() as business_process_service:
            business_process = business_process_service.get_business_process(conn_system_business_process_id)
            serializer = BusinessProcessDataSerializer(business_process)
            return serializer.serialized_data

    def create_business_process(
        self, user_id: int, conn_system_driver_id: int, request_data: CreateBusinessProcessSchema
    ) -> CreateBusinessProcessResponseSchema:
        with BusinessProcessService() as business_process_service:
            response = business_process_service.create_business_process(user_id, conn_system_driver_id, request_data)
            return response

    def create_business_process_from_template(
        self, user_id: int, conn_system_driver_id: int, request_data: CreateBusinessProcessFromTemplateSchema
    ) -> CreateBusinessProcessResponseSchema:
        with BusinessProcessService() as business_process_service:
            response = business_process_service.create_business_process_from_template(user_id, conn_system_driver_id, request_data)
            return response

    def update_business_process(
        self, user_id: int, conn_system_business_process_id: int, request_data: UpdateBusinessProcessSchema
    ) -> MessageResponseSchema:
        with BusinessProcessService() as business_process_service:
            response = business_process_service.update_business_process(
                user_id, conn_system_business_process_id, request_data
            )
            return response

    def delete_business_process(self, user_id: int, conn_system_business_process_id: int) -> MessageResponseSchema:
        with BusinessProcessService() as business_process_service:
            response = business_process_service.delete_business_process(user_id, conn_system_business_process_id)
            return response
