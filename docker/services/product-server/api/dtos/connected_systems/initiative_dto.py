class InitiativeDTO:
    def __init__(self, initiative_data):
        self.id = initiative_data.id
        self.name = initiative_data.name
        self.order_by = initiative_data.order_by
        self.is_active = initiative_data.is_active
        self.objectives = initiative_data.objectives
        self.goal = initiative_data.goal.name
        self.goal_id = initiative_data.goal.id
