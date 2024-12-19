class ObjectivesGroupDTO:
    def __init__(self, objective_group, connected_system_dao):
        self.description = objective_group.description
        self.group_name = objective_group.group_name
        self.objectives_list = [
            ObjectivesDTO(objective).__dict__ for objective in connected_system_dao.get_objectives(objective_group.id)
        ]


class ObjectivesDTO:
    def __init__(self, objective):
        self.objective_id = objective.id
        self.objective_name = objective.objective_name
        self.next_recommended_objective = objective.next_recommended_objective


class ObjectiveStepsDTO:
    def __init__(self, objective_step, connected_system_dao):
        self.title = objective_step.description
        self.description = objective_step.description
        self.graph_type = objective_step.graph_type
        self.horizontal = objective_step.horizontal
        self.order = objective_step.order
        self.app_screen_id = objective_step.app_screen_id
        self.graph_widgets = [
            ObjectiveStepsWidgetValueDTO(value).__dict__
            for value in connected_system_dao.get_objective_step_widgets(objective_step.id)
        ]


class ObjectiveStepsWidgetValueDTO:
    def __init__(self, value):
        self.title = value.title
        self.sub_title = value.sub_title
        self.widget_value = value.widget_value
