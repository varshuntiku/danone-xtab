from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.connected_systems.goal_schema import (
    CreateGoalResponseSchema,
    CreateUpdateGoalSchema,
    GoalDataSchema,
    GoalFrontendSchema,
    GoalSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.serializers.connected_systems.goal_serializer import (
    GoalDataSerializer,
    GoalFrontendSerializer,
    GoalListSerializer,
)
from api.services.connected_systems.goal_service import GoalService


class GoalController(BaseController):
    def get_goal_details(self, conn_system_dashboard_id: int) -> List[GoalFrontendSchema]:
        with GoalService() as goal_service:
            goals = goal_service.get_goals(conn_system_dashboard_id)
            response = []
            for goal in goals:
                serializer = GoalFrontendSerializer(goal)
                response.append(serializer.serialized_data)
            return response

    def get_goals(self, conn_system_dashboard_id: int) -> List[GoalSchema]:
        with GoalService() as goal_service:
            goals = goal_service.get_goals(conn_system_dashboard_id)
            response = []
            for goal in goals:
                serializer = GoalListSerializer(goal)
                response.append(serializer.serialized_data)
            return response

    def get_goal(self, conn_system_goal_id: int) -> GoalDataSchema:
        with GoalService() as goal_service:
            goal = goal_service.get_goal(conn_system_goal_id)
            serializer = GoalDataSerializer(goal)
            return serializer.serialized_data

    def create_goal(
        self, user_id: int, conn_system_dashboard_id: int, request_data: CreateUpdateGoalSchema
    ) -> CreateGoalResponseSchema:
        with GoalService() as goal_service:
            response = goal_service.create_goal(user_id, conn_system_dashboard_id, request_data)
            return response

    def update_goal(
        self, user_id: int, conn_system_goal_id: int, request_data: CreateUpdateGoalSchema
    ) -> MessageResponseSchema:
        with GoalService() as goal_service:
            response = goal_service.update_goal(user_id, conn_system_goal_id, request_data)
            return response

    def delete_goal(self, user_id: int, conn_system_goal_id: int) -> MessageResponseSchema:
        with GoalService() as goal_service:
            response = goal_service.delete_goal(user_id, conn_system_goal_id)
            return response
