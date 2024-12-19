import json

from api.models.base_models import ProjectStatus
from api.utils.app.app import sanitize_content
from api.utils.app.projects import (
    get_hierarchy_function,
    get_hierarchy_problem_area,
    has_delete_access,
    has_edit_access,
    has_view_access,
)


class GetProjectsListDTO:
    def __init__(self, project, casestudy_count):
        self.id = project.id
        self.name = project.name
        self.industry = project.industry if project.industry else "--"
        self.function = get_hierarchy_function(project.name, project.industry)
        self.problem_area = (
            project.problem_area if project.problem_area else get_hierarchy_problem_area(project.name, project.industry)
        )
        self.project_status = ProjectStatus.get_label(project.project_status)
        self.assignees = (
            [
                {"id": group_project.id, "name": f"{group_project.first_name} {group_project.last_name}"}
                for group_project in project.assignees
            ],
        )
        self.assignees_label = [
            f"{group_project.first_name} {group_project.last_name}" for group_project in project.assignees
        ]
        # "assignee"= f'{project.assignee_user.first_name} {project.assignee_user.last_name}' if project.assignee_user else '--',
        self.reviewer = (
            f"{project.review_user.first_name} {project.review_user.last_name}" if project.review_user else "--"
        )
        self.casestudy_count = casestudy_count
        self.origin = project.origin if project.origin else "--"
        self.created_by = (
            f"{project.created_by_user.first_name} {project.created_by_user.last_name}" if project.created_by else "--"
        )
        self.updated_by = (
            f"{project.updated_by_user.first_name} {project.updated_by_user.last_name}" if project.updated_by else "--"
        )
        self.created_at = project.created_at.strftime("%d %B, %Y %H:%M")
        self.updated_at = project.updated_at.strftime("%d %B, %Y %H:%M") if project.updated_at else "--"


class GetVersionViewDTO:
    def __init__(self, data):
        self.version_id = data.version_id
        self.version_name = data.version_name
        self.is_current = data.is_current
        self.content = json.loads(data.content) if data.content else {}
        self.created_by_user = (
            f"{data.created_by_user.first_name} {data.created_by_user.last_name}" if data.created_by else "--"
        )
        self.created_at = data.created_at.timestamp()
        self.updated_by_user = (
            f"{data.updated_by_user.first_name} {data.updated_by_user.last_name}" if data.updated_by else "--"
        )
        self.version_updated_at = data.updated_at.timestamp() if data.updated_at else None


class ProblemDefinitionVersionsDTO:
    def __init__(self, pd_version):
        self.version_id = pd_version.version_id
        self.version_name = pd_version.version_name
        self.is_current = pd_version.is_current
        self.created_by_user = (
            f"{pd_version.created_by_user.first_name} {pd_version.created_by_user.last_name}"
            if pd_version.created_by
            else "--"
        )
        self.created_at = pd_version.created_at.timestamp()
        self.updated_by_user = (
            f"{pd_version.updated_by_user.first_name} {pd_version.updated_by_user.last_name}"
            if pd_version.updated_by
            else "--"
        )


class ProjectDTO:
    def __init__(self, project, project_access, user_id, problem_definition):
        self.id = project.id
        self.name = project.name
        self.industry = project.industry
        self.project_status = project.project_status
        self.assignees = [group_row.id for group_row in project.assignees] if project.assignees else []
        self.reviewer = project.reviewer
        self.is_instance = True if project.parent_project_id else False
        self.account = project.account
        self.problem_area = project.problem_area
        self.origin = project.origin
        self.created_by = (
            f"{project.created_by_user.first_name} {project.created_by_user.last_name}" if project.created_by else "--"
        )
        self.user_access = ProjectUserAccessDTO(project, project_access, user_id).__dict__
        if project.origin in ["PDF", "DS-Workbench"]:
            project_default_pd = problem_definition
            content = (
                json.loads(project_default_pd.content) if project_default_pd and project_default_pd.content else None
            )
            self.content = sanitize_content(content)
            self.version_id = project_default_pd.version_id if project_default_pd else None
            self.version_updated_at = project_default_pd.updated_at if project_default_pd else None
            self.is_current = project_default_pd.is_current if project_default_pd else None
            self.version_name = project_default_pd.version_name if project_default_pd else None


class ProjectUserAccessDTO:
    def __init__(self, project, project_access, user_id):
        self.view = has_view_access(project_access, project, user_id)
        self.edit = has_edit_access(project_access, project, user_id)
        self.delete = has_delete_access(project_access, project, user_id)


class ProjectAjaxListDTO:
    def __init__(self, project, project_access, user_id, casestudy_count, problem_definition):
        self.id = project.id
        self.name = project.name
        self.industry = project.industry if project.industry else "--"
        self.function = get_hierarchy_function(project.name, project.industry)
        self.problem_area = (
            project.problem_area if project.problem_area else get_hierarchy_problem_area(project.name, project.industry)
        )
        self.project_status = ProjectStatus.get_label(project.project_status)
        self.assignees = [
            {
                "id": group_row.id,
                "name": f"{group_row.first_name} {group_row.last_name}",
            }
            for group_row in project.assignees
        ]
        self.assignees_label = (
            [f"{group_row.first_name} {group_row.last_name}" for group_row in project.assignees]
            if len(project.assignees) > 0
            else ["--"]
        )
        self.reviewer = (
            f"{project.review_user.first_name} {project.review_user.last_name}" if project.review_user else "--"
        )
        self.casestudy_count = casestudy_count
        self.origin = project.origin if project.origin else "--"
        self.created_by = (
            f"{project.created_by_user.first_name} {project.created_by_user.last_name}" if project.created_by else "--"
        )
        self.updated_by = (
            f"{project.updated_by_user.first_name} {project.updated_by_user.last_name}" if project.updated_by else "--"
        )
        self.created_at = project.created_at.strftime("%d %B, %Y %H:%M")
        self.updated_at = project.updated_at.strftime("%d %B, %Y %H:%M") if project.updated_at else "--"
        self.account = project.account if project.account else "--"
        self.user_access = ProjectUserAccessDTO(project, project_access, user_id).__dict__
        if project.origin == "PDF":
            row_pd_version = problem_definition
            if row_pd_version is not None:
                self.pd_version_id = row_pd_version.version_id
                self.version_updated_at = row_pd_version.updated_at.timestamp() if row_pd_version.updated_at else None
