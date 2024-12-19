from enum import Enum

from api.db_models.user_management.users import User
from api.models import CodexModelMixin, QueryWithSoftDelete, db
from sqlalchemy.dialects.postgresql import UUID

project_assignee_identifier = db.Table(
    "project_assignee_identifier",
    db.Column("project_id", db.Integer, db.ForeignKey("project.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
)


class Project(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    industry = db.Column(db.Text, nullable=True)
    parent_project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=True)
    # 1 - Not started 2 - In progress 3 - Ready for review 4 - Reviewed 5 - Deployed to production
    project_status = db.Column(db.Integer, default=1)
    design_metadata = db.Column(db.Text, nullable=True)
    artifact_metadata = db.Column(db.Text, nullable=True)
    blueprint = db.Column(db.Text, nullable=True)
    assignee = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    reviewer = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    assignees = db.relationship("User", secondary=project_assignee_identifier)

    # for PD framework
    account = db.Column(db.String(200), nullable=True)
    problem_area = db.Column(db.String(1000), nullable=True)

    parent_project = db.relationship("Project", foreign_keys=[parent_project_id])
    assignee_user = db.relationship("User", foreign_keys=[assignee])
    review_user = db.relationship("User", foreign_keys=[reviewer])
    origin = db.Column(db.String(50), nullable=True)

    query_class = QueryWithSoftDelete

    def __init__(
        self,
        name,
        industry,
        project_status,
        assignees,
        reviewer,
        created_by,
        parent_project_id=None,
        blueprint=None,
        design_metadata=None,
        account=None,
        problem_area=None,
        origin=None,
    ):
        self.name = name
        self.industry = industry
        self.project_status = project_status
        # self.assignee = assignee
        self.reviewer = reviewer
        self.created_by = created_by
        self.parent_project_id = parent_project_id
        self.blueprint = blueprint
        self.design_metadata = design_metadata
        self.account = account
        self.problem_area = problem_area
        self.origin = origin

        if assignees:
            for assignee_item in assignees:
                self.assignees.append(User.query.filter_by(id=assignee_item).first())


class ProjectStatus(Enum):
    NOT_STARTED = 1
    IN_PROGRESS = 2
    READY_FOR_REVIEW = 3
    REVIEWED = 4
    DEPLOYED_TO_PROD = 5

    def get_label(value):
        if value == 1:
            return "NOT STARTED"
        elif value == 2:
            return "IN PROGRESS"
        elif value == 3:
            return "READY FOR REVIEW"
        elif value == 4:
            return "REVIEWED"
        elif value == 5:
            return "DEPLOYED TO PROD"
        else:
            return "NONE"


class ProblemDefinitionVersion(CodexModelMixin, db.Model):
    version_id = db.Column(UUID(as_uuid=True), unique=True)
    version_name = db.Column(db.String(1000), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=True)
    is_current = db.Column(db.Boolean, nullable=False)
    content = db.Column(db.Text, nullable=True)

    project = db.relationship("Project", foreign_keys=[project_id])

    def __init__(self, version_id, version_name, project_id, is_current, content, created_by):
        self.version_id = version_id
        self.version_name = version_name
        self.project_id = project_id
        self.is_current = is_current
        self.content = content
        self.created_by = created_by
