from api.db_models.connected_systems.business_process import ConnSystemBusinessProcess
from api.models import CodexModelMixin, db


class ConnSystemBusinessProcessStep(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    business_process_id = db.Column(db.Integer, db.ForeignKey(ConnSystemBusinessProcess.id))
    order_by = db.Column(db.Integer, nullable=False, default=0)

    def __init__(self, name, business_process_id, order_by, created_by, is_active=True):
        self.name = name
        self.is_active = is_active
        self.business_process_id = business_process_id
        self.order_by = order_by
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Business Process Step {self.name}>"
