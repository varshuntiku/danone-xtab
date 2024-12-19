from api.db_models.dsw_execution_environment.dsw_execution_environment import (
    DSWExecutionEnvironment,
)
from api.db_models.projects.projects import Project
from api.models import CodexModelMixin, db


class DSWExecutionEnvironmentProjectMapping(CodexModelMixin, db.Model):
    project_id = db.Column(db.Integer, db.ForeignKey(Project.id))
    execution_environment_id = db.Column(db.Integer, db.ForeignKey(DSWExecutionEnvironment.id))
    config = db.Column(db.JSON)

    project = db.relationship("Project", backref="dsw_execution_env_project_mappings")
    execution_env = db.relationship("DSWExecutionEnvironment", backref="dsw_execution_env_project_mappings")
