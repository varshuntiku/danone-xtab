from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.connected_systems.initiative_schema import (
    CreateInitiativeResponseSchema,
    CreateInitiativeSchema,
    InitiativeDataSchema,
    InitiativeSchema,
    UpdateInitiativeSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.serializers.connected_systems.initiative_serializer import (
    InitiativeDataSerializer,
    InitiativeListSerializer,
)
from api.services.connected_systems.initiative_service import InitiativeService


class InitiativeController(BaseController):
    def get_initiatives(self, conn_system_dashboard_id: int) -> List[InitiativeSchema]:
        with InitiativeService() as initiative_service:
            initiatives = initiative_service.get_initiatives(conn_system_dashboard_id)
            response = []
            for initiative in initiatives:
                serializer = InitiativeListSerializer(initiative)
                response.append(serializer.serialized_data)
            return response

    def get_initiative(self, conn_system_initiative_id: int) -> InitiativeDataSchema:
        with InitiativeService() as initiative_service:
            initiative = initiative_service.get_initiative(conn_system_initiative_id)
            serializer = InitiativeDataSerializer(initiative)
            return serializer.serialized_data

    def create_initiative(
        self, user_id: int, conn_system_goal_id: int, request_data: CreateInitiativeSchema
    ) -> CreateInitiativeResponseSchema:
        with InitiativeService() as initiative_service:
            response = initiative_service.create_initiative(user_id, conn_system_goal_id, request_data)
            return response

    def update_initiative(
        self, user_id: int, conn_system_initiative_id: int, request_data: UpdateInitiativeSchema
    ) -> MessageResponseSchema:
        with InitiativeService() as initiative_service:
            response = initiative_service.update_initiative(user_id, conn_system_initiative_id, request_data)
            return response

    def delete_initiative(self, user_id: int, conn_system_initiative_id: int) -> MessageResponseSchema:
        with InitiativeService() as initiative_service:
            response = initiative_service.delete_initiative(user_id, conn_system_initiative_id)
            return response
