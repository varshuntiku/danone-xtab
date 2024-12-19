import json
from typing import List

from api.constants.connected_systems.initiative_error_messages import InitiativeErrors
from api.constants.connected_systems.initiative_success_messages import (
    InitiativeSuccess,
)
from api.daos.connected_systems.initiative_dao import InitiativeDao
from api.dtos.connected_systems.initiative_dto import CreateInitiativeDTO, InitiativeDTO
from api.middlewares.error_middleware import GeneralException
from api.schemas.connected_systems.initiative_schema import (
    CreateInitiativeResponseSchema,
    CreateInitiativeSchema,
    UpdateInitiativeSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService
from fastapi import status


class InitiativeService(BaseService):
    def __init__(self):
        super().__init__()
        self.initiative_dao = InitiativeDao(self.db_session)

    def get_initiatives(self, conn_system_dashboard_id: int) -> List[InitiativeDTO]:
        initiatives = self.initiative_dao.get_initiatives(conn_system_dashboard_id)
        return [InitiativeDTO(initiative) for initiative in initiatives]

    def get_initiative(self, conn_system_initiative_id: int) -> InitiativeDTO:
        initiative = self.initiative_dao.get_initiative(conn_system_initiative_id)
        return InitiativeDTO(initiative)

    def create_initiative(
        self, user_id: int, conn_system_goal_id: int, request_data: CreateInitiativeSchema
    ) -> CreateInitiativeResponseSchema:
        initiative = self.initiative_dao.create_initiative(
            conn_system_goal_id=conn_system_goal_id,
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            objectives=json.dumps(getattr(request_data, "objectives", None))
            if getattr(request_data, "objectives", None)
            else None,
            created_by=user_id,
        )
        return {"status": "success", "initiative_data": CreateInitiativeDTO(initiative)}

    def update_initiative(
        self, user_id: int, conn_system_initiative_id: int, request_data: UpdateInitiativeSchema
    ) -> MessageResponseSchema:
        initiative = self.initiative_dao.get_initiative(conn_system_initiative_id)

        if not initiative:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": InitiativeErrors.INITIATIVE_NOT_FOUND_ERROR.value},
            )

        self.initiative_dao.update_initiative(
            connSystemInitiative=initiative,
            goal_id=getattr(request_data, "goal_id", None),
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            objectives=json.dumps(getattr(request_data, "objectives", None))
            if getattr(request_data, "objectives", None)
            else None,
            updated_by=user_id,
        )
        return {"message": InitiativeSuccess.INITIATIVE_UPDATE_SUCCESS.value}

    def delete_initiative(self, user_id: int, conn_system_initiative_id: int) -> MessageResponseSchema:
        initiative = self.initiative_dao.get_initiative(conn_system_initiative_id)

        if not initiative:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": InitiativeErrors.INITIATIVE_NOT_FOUND_ERROR.value},
            )

        self.initiative_dao.delete_initiative(
            connSystemInitiative=initiative,
            deleted_by=user_id,
        )
        return {"message": InitiativeSuccess.INITIATIVE_DELETE_SUCCESS.value}
