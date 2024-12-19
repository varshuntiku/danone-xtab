import json
from typing import List

from api.constants.connected_systems.business_process_error_messages import (
    BusinessProcessErrors,
)
from api.constants.connected_systems.business_process_success_messages import (
    BusinessProcessSuccess,
)
from api.controllers.connected_systems.business_process_template_controller import (
    BusinessProcessTemplateController,
)
from api.daos.connected_systems.business_process_dao import BusinessProcessDao
from api.dtos.connected_systems.business_process_dto import (
    BusinessProcessDTO,
    CreateBusinessProcessDTO,
)
from api.middlewares.error_middleware import GeneralException
from api.schemas.connected_systems.business_process_schema import (
    CreateBusinessProcessFromTemplateSchema,
    CreateBusinessProcessResponseSchema,
    CreateBusinessProcessSchema,
    UpdateBusinessProcessSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService
from fastapi import status


class BusinessProcessService(BaseService):
    def __init__(self):
        super().__init__()
        self.business_process_dao = BusinessProcessDao(self.db_session)

    def get_business_processes(self, conn_system_dashboard_id: int) -> List[BusinessProcessDTO]:
        business_processes = self.business_process_dao.get_business_processes(conn_system_dashboard_id)
        return [BusinessProcessDTO(business_process) for business_process in business_processes]

    def get_business_processes_by_driver(self, conn_system_driver_id: int) -> List[BusinessProcessDTO]:
        business_processes = self.business_process_dao.get_business_processes_by_driver(conn_system_driver_id)
        return [BusinessProcessDTO(business_process) for business_process in business_processes]

    def get_business_process(self, conn_system_business_process_id: int) -> BusinessProcessDTO:
        business_process = self.business_process_dao.get_business_process(conn_system_business_process_id)
        return BusinessProcessDTO(business_process)

    def create_business_process(
        self, user_id: int, conn_system_driver_id: int, request_data: CreateBusinessProcessSchema
    ) -> CreateBusinessProcessResponseSchema:
        business_process = self.business_process_dao.create_business_process(
            conn_system_driver_id=conn_system_driver_id,
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            process_config=json.dumps(getattr(request_data, "process_config", None))
            if getattr(request_data, "process_config", None)
            else None,
            intelligence_config=json.dumps(getattr(request_data, "intelligence_config", None))
            if getattr(request_data, "intelligence_config", None)
            else None,
            foundation_config=json.dumps(getattr(request_data, "foundation_config", None))
            if getattr(request_data, "foundation_config", None)
            else None,
            created_by=user_id,
        )
        return {"status": "success", "business_process_data": CreateBusinessProcessDTO(business_process)}

    def create_business_process_from_template(
        self, user_id: int, conn_system_driver_id: int, request_data: CreateBusinessProcessFromTemplateSchema
    ) -> CreateBusinessProcessResponseSchema:
        business_process_template_controller = BusinessProcessTemplateController()
        template_id = getattr(request_data, "template_id", None)
        if template_id:
            business_process_template_data = business_process_template_controller.get_business_process_template(
                getattr(request_data, "template_id", None)
            )
            business_process_template_data["process_config"]["name"] = getattr(request_data, "name", None)

        business_process = self.business_process_dao.create_business_process(
            conn_system_driver_id=conn_system_driver_id,
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            process_config=json.dumps(business_process_template_data["process_config"])
            if business_process_template_data["process_config"]
            else None,
            intelligence_config=None,
            foundation_config=None,
            created_by=user_id,
        )

        return {"status": "success", "business_process_data": CreateBusinessProcessDTO(business_process)}

    def update_business_process(
        self, user_id: int, conn_system_business_process_id: int, request_data: UpdateBusinessProcessSchema
    ) -> MessageResponseSchema:
        business_process = self.business_process_dao.get_business_process(conn_system_business_process_id)

        if not business_process:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": BusinessProcessErrors.BUSINESS_PROCESS_NOT_FOUND_ERROR.value},
            )

        self.business_process_dao.update_business_process(
            connSystemBusinessProcess=business_process,
            driver_id=getattr(request_data, "driver_id", None),
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            process_config=json.dumps(getattr(request_data, "process_config", None))
            if getattr(request_data, "process_config", None)
            else None,
            intelligence_config=json.dumps(getattr(request_data, "intelligence_config", None))
            if getattr(request_data, "intelligence_config", None)
            else None,
            foundation_config=json.dumps(getattr(request_data, "foundation_config", None))
            if getattr(request_data, "foundation_config", None)
            else None,
            updated_by=user_id,
        )
        return {"message": BusinessProcessSuccess.BUSINESS_PROCESS_UPDATE_SUCCESS.value}

    def delete_business_process(self, user_id: int, conn_system_business_process_id: int) -> MessageResponseSchema:
        business_process = self.business_process_dao.get_business_process(conn_system_business_process_id)

        if not business_process:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": BusinessProcessErrors.BUSINESS_PROCESS_NOT_FOUND_ERROR.value},
            )

        self.business_process_dao.delete_business_process(
            connSystemBusinessProcess=business_process,
            deleted_by=user_id,
        )
        return {"message": BusinessProcessSuccess.BUSINESS_PROCESS_DELETE_SUCCESS.value}
