from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.connected_systems.business_process_template_schema import (
    BusinessProcessTemplateDataSchema,
    BusinessProcessTemplateSchema,
    CreateBusinessProcessTemplateResponseSchema,
    CreateBusinessProcessTemplateSchema,
    UpdateBusinessProcessTemplateSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.serializers.connected_systems.business_process_template_serializer import (
    BusinessProcessTemplateDataSerializer,
    BusinessProcessTemplateListSerializer,
)
from api.services.connected_systems.business_process_template_service import (
    BusinessProcessTemplateService,
)


class BusinessProcessTemplateController(BaseController):
    def get_business_process_templates(self, conn_system_dashboard_id: int) -> List[BusinessProcessTemplateSchema]:
        with BusinessProcessTemplateService() as business_process_template_service:
            business_process_templates = business_process_template_service.get_business_process_templates(
                conn_system_dashboard_id
            )
            response = []
            for business_process_template in business_process_templates:
                serializer = BusinessProcessTemplateListSerializer(business_process_template)
                response.append(serializer.serialized_data)
            return response

    def get_business_process_templates_by_driver(
        self, conn_system_driver_id: int
    ) -> List[BusinessProcessTemplateSchema]:
        with BusinessProcessTemplateService() as business_process_template_service:
            business_process_templates = business_process_template_service.get_business_process_templates_by_driver(
                conn_system_driver_id
            )
            response = []
            for business_process_template in business_process_templates:
                serializer = BusinessProcessTemplateListSerializer(business_process_template)
                response.append(serializer.serialized_data)
            return response

    def get_business_process_template(
        self, conn_system_business_process_template_id: int
    ) -> BusinessProcessTemplateDataSchema:
        with BusinessProcessTemplateService() as business_process_template_service:
            business_process_template = business_process_template_service.get_business_process_template(
                conn_system_business_process_template_id
            )
            serializer = BusinessProcessTemplateDataSerializer(business_process_template)
            return serializer.serialized_data

    def create_business_process_template(
        self, user_id: int, conn_system_driver_id: int, request_data: CreateBusinessProcessTemplateSchema
    ) -> CreateBusinessProcessTemplateResponseSchema:
        with BusinessProcessTemplateService() as business_process_template_service:
            response = business_process_template_service.create_business_process_template(
                user_id, conn_system_driver_id, request_data
            )
            return response

    def update_business_process_template(
        self,
        user_id: int,
        conn_system_business_process_template_id: int,
        request_data: UpdateBusinessProcessTemplateSchema,
    ) -> MessageResponseSchema:
        with BusinessProcessTemplateService() as business_process_template_service:
            response = business_process_template_service.update_business_process_template(
                user_id, conn_system_business_process_template_id, request_data
            )
            return response

    def delete_business_process_template(
        self, user_id: int, conn_system_business_process_template_id: int
    ) -> MessageResponseSchema:
        with BusinessProcessTemplateService() as business_process_template_service:
            response = business_process_template_service.delete_business_process_template(
                user_id, conn_system_business_process_template_id
            )
            return response
