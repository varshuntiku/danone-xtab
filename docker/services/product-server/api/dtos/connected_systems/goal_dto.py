class GoalDTO:
    def __init__(self, goal_data):
        self.id = goal_data.id
        self.name = goal_data.name
        self.order_by = goal_data.order_by
        self.is_active = goal_data.is_active
        self.objectives = goal_data.objectives
        self.initiatives = goal_data.initiatives
