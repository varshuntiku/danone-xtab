from api.helpers.generic_helpers import GenericHelper

generic_helper = GenericHelper()


class GoalDTO:
    def __init__(self, connSystemGoal):
        self.id = connSystemGoal.id
        self.name = connSystemGoal.name
        self.order_by = connSystemGoal.order_by
        self.is_active = connSystemGoal.is_active
        self.objectives = connSystemGoal.objectives
        self.initiatives = connSystemGoal.initiatives
        self.created_at = connSystemGoal.created_at
        self.created_by_user = connSystemGoal.created_by_user if connSystemGoal.created_by else "--"
        self.updated_at = connSystemGoal.updated_at


class CreateGoalDTO:
    def __init__(self, connSystemGoal):
        self.id = connSystemGoal.id
        self.name = connSystemGoal.name
        self.order_by = connSystemGoal.order_by
        self.is_active = connSystemGoal.is_active
