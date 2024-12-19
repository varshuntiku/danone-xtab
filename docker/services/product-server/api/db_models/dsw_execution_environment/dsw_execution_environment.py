from api.models import CodexModelMixin, db


class DSWExecutionEnvironment(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    desc = db.Column(db.Text)
    config = db.Column(db.JSON)

    def __init__(self, name, desc, config):
        self.name = name
        self.desc = desc
        self.config = config
