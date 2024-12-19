from api.helpers.generic_helpers import GenericHelper

generic_helper = GenericHelper()


class InitiativeDTO:
    def __init__(self, connSystemInitiative):
        self.id = connSystemInitiative.id
        self.name = connSystemInitiative.name
        self.order_by = connSystemInitiative.order_by
        self.is_active = connSystemInitiative.is_active
        self.objectives = connSystemInitiative.objectives
        self.goal = connSystemInitiative.goal.name
        self.goal_id = connSystemInitiative.goal.id
        self.created_at = connSystemInitiative.created_at
        self.created_by_user = connSystemInitiative.created_by_user if connSystemInitiative.created_by else "--"
        self.updated_at = connSystemInitiative.updated_at


class CreateInitiativeDTO:
    def __init__(self, connSystemInitiative):
        self.id = connSystemInitiative.id
        self.goal_id = connSystemInitiative.goal_id
        self.name = connSystemInitiative.name
        self.order_by = connSystemInitiative.order_by
        self.is_active = connSystemInitiative.is_active
