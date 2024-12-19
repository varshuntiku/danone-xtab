from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String, Text


@mapper_registry.mapped
class ObjectivesGroup(BaseModelMixin):
    __tablename__ = "objectives_group"

    app_id = Column(Integer, ForeignKey("app.id"))
    group_name = Column(Text, nullable=False)
    description = Column(Text, nullable=False)

    def __init__(self, app_id, group_name, description):
        self.app_id = app_id
        self.group_name = group_name
        self.description = description


@mapper_registry.mapped
class Objectives(BaseModelMixin):
    __tablename__ = "objectives"

    group_id = Column(Integer, ForeignKey("objectives_group.id"))
    objective_name = Column(String(100), nullable=False)
    next_recommended_objective = Column(Integer, nullable=True)

    def __init__(self, group_id, objective_name, next_recommended_objective=None):
        self.group_id = group_id
        self.objective_name = objective_name
        self.next_recommended_objective = next_recommended_objective


@mapper_registry.mapped
class ObjectivesSteps(BaseModelMixin):
    __tablename__ = "objectives_steps"

    objective_id = Column(Integer, ForeignKey("objectives.id"))
    app_screen_id = Column(Integer, ForeignKey("app_screen.id"))
    title = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    graph_type = Column(Text, nullable=True)
    horizontal = Column(Boolean, nullable=True)

    def __init__(self, objective_id, title, description, order, graph_type, horizontal):
        self.objective_id = objective_id
        self.title = title
        self.description = description
        self.order = order
        self.graph_type = graph_type
        self.horizontal = horizontal


@mapper_registry.mapped
class objectives_steps_widget_value(BaseModelMixin):
    __tablename__ = "objectives_steps_widget_value"

    objectives_steps_id = Column(Integer, ForeignKey("objectives_steps.id"))
    widget_value = Column(JSON, nullable=True)
    title = Column(Text, nullable=True)
    sub_title = Column(Text, nullable=True)
    order = Column(Integer, default=0)

    def __init__(self, objectives_steps_id, widget_value, title, description, order):
        self.objectives_steps_id = objectives_steps_id
        self.widget_value = widget_value
        self.title = title
        self.description = description
        self.order = order
