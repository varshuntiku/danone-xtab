from api.db_models.connected_systems.driver import ConnSystemDriver
from api.models import CodexModelMixin, db


class ConnSystemBusinessProcess(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey(ConnSystemDriver.id))
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    order_by = db.Column(db.Integer, nullable=False, default=0)
    process_config = db.Column(db.Text, nullable=True)
    intelligence_config = db.Column(db.Text, nullable=True)
    foundation_config = db.Column(db.Text, nullable=True)

    # stake_holders = db.relationship("StakeHolder", backref="problem_definition", lazy="dynamic")
    # problem_overviews = db.relationship("ProblemOverview", backref="problem_definition", lazy="dynamic")

    def __init__(
        self,
        name,
        driver_id,
        order_by,
        process_config,
        intelligence_config,
        foundation_config,
        created_by,
        is_active=True,
    ):
        self.name = name
        self.driver_id = driver_id
        self.is_active = is_active
        self.order_by = order_by
        self.process_config = process_config
        self.intelligence_config = intelligence_config
        self.foundation_config = foundation_config
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Business Process {self.name}>"
