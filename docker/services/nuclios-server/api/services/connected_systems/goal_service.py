import json
from typing import List

from api.constants.connected_systems.goal_error_messages import GoalErrors
from api.constants.connected_systems.goal_success_messages import GoalSuccess
from api.daos.connected_systems.goal_dao import GoalDao
from api.dtos.connected_systems.goal_dto import CreateGoalDTO, GoalDTO
from api.middlewares.error_middleware import GeneralException
from api.schemas.connected_systems.goal_schema import (
    CreateGoalResponseSchema,
    CreateUpdateGoalSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService
from fastapi import status


class GoalService(BaseService):
    def __init__(self):
        super().__init__()
        self.goal_dao = GoalDao(self.db_session)

    def get_goals(self, conn_system_dashboard_id: int) -> List[GoalDTO]:
        goals = self.goal_dao.get_goals(conn_system_dashboard_id)
        return [GoalDTO(goal) for goal in goals]

    def get_goal(self, conn_system_goal_id: int) -> GoalDTO:
        goal = self.goal_dao.get_goal(conn_system_goal_id)
        return GoalDTO(goal)

    def create_goal(
        self, user_id: int, conn_system_dashboard_id: int, request_data: CreateUpdateGoalSchema
    ) -> CreateGoalResponseSchema:
        goal = self.goal_dao.create_goal(
            conn_system_dashboard_id=conn_system_dashboard_id,
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            objectives=json.dumps(getattr(request_data, "objectives", None))
            if getattr(request_data, "objectives", None)
            else None,
            created_by=user_id,
        )
        return {"status": "success", "goal_data": CreateGoalDTO(goal)}

    def update_goal(
        self, user_id: int, conn_system_goal_id: int, request_data: CreateUpdateGoalSchema
    ) -> MessageResponseSchema:
        goal = self.goal_dao.get_goal(conn_system_goal_id)

        if not goal:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": GoalErrors.GOAL_NOT_FOUND_ERROR.value},
            )

        self.goal_dao.update_goal(
            connSystemGoal=goal,
            name=getattr(request_data, "name", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            objectives=json.dumps(getattr(request_data, "objectives", None))
            if getattr(request_data, "objectives", None)
            else None,
            updated_by=user_id,
        )
        return {"message": GoalSuccess.GOAL_UPDATE_SUCCESS.value}

    def delete_goal(self, user_id: int, conn_system_goal_id: int) -> MessageResponseSchema:
        goal = self.goal_dao.get_goal(conn_system_goal_id)

        if not goal:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": GoalErrors.GOAL_NOT_FOUND_ERROR.value},
            )

        self.goal_dao.delete_goal(
            connSystemGoal=goal,
            deleted_by=user_id,
        )
        return {"message": GoalSuccess.GOAL_DELETE_SUCCESS.value}
