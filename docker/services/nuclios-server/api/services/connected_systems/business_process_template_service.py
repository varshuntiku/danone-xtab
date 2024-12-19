import json
from typing import List

from api.constants.connected_systems.business_process_template_error_messages import (
    BusinessProcessTemplateErrors,
)
from api.constants.connected_systems.business_process_template_success_messages import (
    BusinessProcessTemplateSuccess,
)
from api.daos.connected_systems.business_process_template_dao import (
    BusinessProcessTemplateDao,
)
from api.dtos.connected_systems.business_process_template_dto import (
    BusinessProcessTemplateDTO,
    CreateBusinessProcessTemplateDTO,
)
from api.middlewares.error_middleware import GeneralException
from api.schemas.connected_systems.business_process_template_schema import (
    CreateBusinessProcessTemplateResponseSchema,
    CreateBusinessProcessTemplateSchema,
    UpdateBusinessProcessTemplateSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService
from fastapi import status


class BusinessProcessTemplateService(BaseService):
    def __init__(self):
        super().__init__()
        self.business_process_template_dao = BusinessProcessTemplateDao(self.db_session)

    def get_business_process_templates(self, conn_system_dashboard_id: int) -> List[BusinessProcessTemplateDTO]:
        business_process_templates = self.business_process_template_dao.get_business_process_templates(
            conn_system_dashboard_id
        )
        return [
            BusinessProcessTemplateDTO(business_process_template)
            for business_process_template in business_process_templates
        ]

    def get_business_process_templates_by_driver(self, conn_system_driver_id: int) -> List[BusinessProcessTemplateDTO]:
        business_process_templates = self.business_process_template_dao.get_business_process_templates_by_driver(
            conn_system_driver_id
        )
        return [
            BusinessProcessTemplateDTO(business_process_template)
            for business_process_template in business_process_templates
        ]

    def get_business_process_template(
        self, conn_system_business_process_template_id: int
    ) -> BusinessProcessTemplateDTO:
        business_process_template = self.business_process_template_dao.get_business_process_template(
            conn_system_business_process_template_id
        )
        return BusinessProcessTemplateDTO(business_process_template)

    def create_business_process_template(
        self, user_id: int, conn_system_driver_id: int, request_data: CreateBusinessProcessTemplateSchema
    ) -> CreateBusinessProcessTemplateResponseSchema:
        business_process_template = self.business_process_template_dao.create_business_process_template(
            conn_system_driver_id=conn_system_driver_id,
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            process_config=json.dumps(getattr(request_data, "process_config", None))
            if getattr(request_data, "process_config", None)
            else None,
            created_by=user_id,
        )
        return {
            "status": "success",
            "business_process_template_data": CreateBusinessProcessTemplateDTO(business_process_template),
        }

    def update_business_process_template(
        self,
        user_id: int,
        conn_system_business_process_template_id: int,
        request_data: UpdateBusinessProcessTemplateSchema,
    ) -> MessageResponseSchema:
        business_process_template = self.business_process_template_dao.get_business_process_template(
            conn_system_business_process_template_id
        )

        if not business_process_template:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": BusinessProcessTemplateErrors.BUSINESS_PROCESS_TEMPLATE_NOT_FOUND_ERROR.value},
            )

        self.business_process_template_dao.update_business_process_template(
            connSystemBusinessProcessTemplate=business_process_template,
            driver_id=getattr(request_data, "driver_id", None),
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            process_config=json.dumps(getattr(request_data, "process_config", None))
            if getattr(request_data, "process_config", None)
            else None,
            updated_by=user_id,
        )
        return {"message": BusinessProcessTemplateSuccess.BUSINESS_PROCESS_TEMPLATE_UPDATE_SUCCESS.value}

    def delete_business_process_template(
        self, user_id: int, conn_system_business_process_template_id: int
    ) -> MessageResponseSchema:
        business_process_template = self.business_process_template_dao.get_business_process_template(
            conn_system_business_process_template_id
        )

        if not business_process_template:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": BusinessProcessTemplateErrors.BUSINESS_PROCESS_TEMPLATE_NOT_FOUND_ERROR.value},
            )

        self.business_process_template_dao.delete_business_process_template(
            connSystemBusinessProcessTemplate=business_process_template,
            deleted_by=user_id,
        )
        return {"message": BusinessProcessTemplateSuccess.BUSINESS_PROCESS_TEMPLATE_DELETE_SUCCESS.value}
