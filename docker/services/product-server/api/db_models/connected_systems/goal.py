from api.db_models.connected_systems.dashboard import ConnSystemDashboard
from api.models import CodexModelMixin, db


class ConnSystemGoal(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    dashboard_id = db.Column(db.Integer, db.ForeignKey(ConnSystemDashboard.id))
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    order_by = db.Column(db.Integer, nullable=False, default=0)
    objectives = db.Column(db.Text, nullable=True)

    initiatives = db.relationship(
        "ConnSystemInitiative", backref="goal", lazy="select", order_by="ConnSystemInitiative.order_by"
    )

    def __init__(self, name, dashboard_id, order_by, objectives, created_by, is_active=True):
        self.name = name
        self.dashboard_id = dashboard_id
        self.is_active = is_active
        self.order_by = order_by
        self.objectives = objectives
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Goal {self.name}>"
