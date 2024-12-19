from api.daos.connected_systems.goal_dao import GoalDao
from api.dtos.connected_systems.goal_dto import GoalDTO


class GoalService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    List of Packages and Libraries are loaded from product_server/requirements.txt.
    """

    def __init__(self):
        self.goal_dao = GoalDao()

    def get_goals(self, request):
        goals_data = self.goal_dao.get_goals(request)
        transformed_goals_data = []
        if goals_data:
            for goal_data in goals_data:
                transformed_goals_data.append(GoalDTO(goal_data))

        return transformed_goals_data

    def get_goal_data(self, request):
        goal_data = self.goal_dao.get_goal_data(request)
        transformed_goal_data = GoalDTO(goal_data)

        return transformed_goal_data

    def delete_goal(self, request):
        self.goal_dao.delete_goal(request)

    def save_goal(self, request):
        self.goal_dao.save_goal(request)
