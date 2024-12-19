from api.db_models.connected_systems.goal import ConnSystemGoal
from api.models import CodexModelMixin, db


class ConnSystemInitiative(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey(ConnSystemGoal.id))
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    order_by = db.Column(db.Integer, nullable=False, default=0)
    objectives = db.Column(db.Text, nullable=True)

    def __init__(self, name, goal_id, order_by, objectives, created_by, is_active=True):
        self.name = name
        self.order_by = order_by
        self.goal_id = goal_id
        self.is_active = is_active
        self.objectives = objectives
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Initiative {self.name}>"
