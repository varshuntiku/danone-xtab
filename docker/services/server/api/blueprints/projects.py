#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import math
import uuid

from api.codex_models.code_utils import code_demo as jupyter_code_demo
from api.codex_models.code_utils import get_code_metadata as git_code_metadata
from api.codex_models.code_utils import preview_code as git_preview_code
from api.codex_models.projects import Projects
from api.constants.functions import (
    ExceptionLogger,
    json_response,
    json_response_count,
    sanitize_content,
)
from api.helpers import get_clean_postdata
from api.hierarchy import hierarchy
from api.middlewares import (
    all_projects_required,
    any_projects_required,
    app_required,
    login_required,
    projects_access_info_required,
)
from api.models import (
    AppConfig,
    ProblemDefinitionVersion,
    Project,
    ProjectAttachment,
    ProjectCode,
    ProjectComment,
    ProjectNotebook,
    ProjectNotebookConfig,
    ProjectNotebookConfigTag,
    ProjectNotebookTriggered,
    ProjectStatus,
    User,
    UserGroup,
    Widget,
    WidgetGroup,
    db,
)

# from flask import current_app as app
from flask import Blueprint, g, json, request
from sqlalchemy import asc, desc  # , and_
from sqlalchemy.sql import func

bp = Blueprint("Projects", __name__)


def create_project_list(row):
    return


@bp.route("/codex-api/projects", methods=["GET"])
@login_required
@app_required
def list():
    """Returns all the project assigned to a particular user with the project detail.

    Returns:
        JSON: {list of projects, status, count}
    """
    user_groups_list = g.user.user_groups
    filter_projects = False

    for user_group in user_groups_list:
        if user_group.my_projects_only:
            filter_projects = True

    projects = Project.query.filter_by(parent_project_id=None).order_by(Project.name).all()

    if filter_projects:
        my_projects = []

        for project in projects:
            for assignee in project.assignees:
                if assignee.id == g.user.id:
                    my_projects.append(project)

        projects = my_projects

    return json_response_count(
        [
            {
                "id": row.id,
                "name": row.name,
                "industry": row.industry if row.industry else "--",
                "function": get_hierarchy_function(row.name, row.industry),
                "problem_area": row.problem_area
                if row.problem_area
                else get_hierarchy_problem_area(row.name, row.industry),
                "project_status": ProjectStatus.get_label(row.project_status),
                "assignees": [
                    {
                        "id": group_row.id,
                        "name": f"{group_row.first_name} {group_row.last_name}",
                    }
                    for group_row in row.assignees
                ],
                "assignees_label": [f"{group_row.first_name} {group_row.last_name}" for group_row in row.assignees],
                # "assignee": f'{row.assignee_user.first_name} {row.assignee_user.last_name}' if row.assignee_user else '--',
                "reviewer": f"{row.review_user.first_name} {row.review_user.last_name}" if row.review_user else "--",
                "casestudy_count": Project.query.filter_by(parent_project_id=row.id).count(),
                "origin": row.origin if row.origin else "--",
                "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                if row.created_by
                else "--",
                "updated_by": f"{row.updated_by_user.first_name} {row.updated_by_user.last_name}"
                if row.updated_by
                else "--",
                "created_at": row.created_at.strftime("%d %B, %Y %H:%M"),
                "updated_at": row.updated_at.strftime("%d %B, %Y %H:%M") if row.updated_at else "--",
            }
            for row in projects
        ],
        200,
        Project.query.count(),
    )


@bp.route("/codex-api/projects/list", methods=["PUT", "POST"])
@login_required
@app_required
@projects_access_info_required
def ajax_list():
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing request data"}, 422)

    my_projects_only = g.projects_access["my_projects_only"]
    my_projects = g.projects_access["my_projects"]
    all_projects = g.projects_access["all_projects"]

    projects = Project.query.filter_by(parent_project_id=None)

    # projects_count = Project.query.filter_by(parent_project_id=None)

    if my_projects_only and not (my_projects or all_projects):
        projects = projects.filter(Project.assignees.any(User.id == g.user.id))
        # projects_count = projects_count.filter(
        #     Project.assignees.any(User.id == g.user.id))

    if "filtered" in request_data:
        for filter_item in request_data["filtered"]:
            if filter_item["value"]:
                if filter_item["id"] == "name":
                    # projects_count = projects_count.filter(
                    #     Project.name.ilike(filter_item['value'] + '%'))
                    projects = projects.filter(Project.name.ilike(filter_item["value"] + "%"))
                if filter_item["id"] == "industry":
                    # projects_count = projects_count.filter(
                    #     Project.industry.ilike(filter_item['value'] + '%'))
                    projects = projects.filter(Project.industry.ilike(filter_item["value"] + "%"))
                elif filter_item["id"] == "assignees_label":
                    # projects_count = projects_count.filter(Project.assignees.any(
                    #     User.first_name.ilike(filter_item['value'] + '%')))
                    projects = projects.filter(Project.assignees.any(User.first_name.ilike(filter_item["value"] + "%")))
                elif filter_item["id"] == "reviewer":
                    # projects_count = projects_count.filter(Project.review_user.has(
                    #     User.first_name.ilike(filter_item['value'] + '%')))
                    projects = projects.filter(
                        Project.review_user.has(User.first_name.ilike(filter_item["value"] + "%"))
                    )
                elif filter_item["id"] == "created_by":
                    # projects_count = projects_count.filter(Project.created_by_user.has(
                    #     User.first_name.ilike(filter_item['value'] + '%')))
                    projects = projects.filter(
                        Project.created_by_user.has(User.first_name.ilike(filter_item["value"] + "%"))
                    )
                elif filter_item["id"] == "updated_by":
                    # projects_count = projects_count.filter(Project.updated_by_user.has(
                    #     User.first_name.ilike(filter_item['value'] + '%')))
                    projects = projects.filter(
                        Project.updated_by_user.has(User.first_name.ilike(filter_item["value"] + "%"))
                    )
                elif filter_item["id"] == "account":
                    # projects_count = projects_count.filter(
                    #     Project.account.ilike(filter_item['value'] + '%'))
                    projects = projects.filter(Project.account.ilike(filter_item["value"] + "%"))

                elif filter_item["id"] == "origin":
                    # projects_count = projects_count.filter(
                    #     Project.account.ilike(filter_item['value'] + '%'))
                    projects = projects.filter(Project.origin.ilike(filter_item["value"] + "%"))
    projects_count = projects.count()

    if request_data.get("sorted", False):  # desc == descending order
        added_name_sort = False
        for sort_item in request_data["sorted"]:
            if "desc" in sort_item and sort_item["desc"]:
                if sort_item["id"] == "name":
                    added_name_sort = True
                projects = projects.order_by(desc(getattr(Project, sort_item["id"])))

            else:
                if sort_item["id"] == "id":
                    added_name_sort = True
                projects = projects.order_by(asc(getattr(Project, sort_item["id"])))

        if not added_name_sort:
            projects = projects.order_by(Project.name)
    else:
        projects = projects.order_by(desc(Project.created_at))

    projects = projects.limit(request_data["pageSize"]).offset(request_data["page"] * request_data["pageSize"])

    response_data = []
    for row in projects:
        row_data = {
            "id": row.id,
            "name": row.name,
            "industry": row.industry if row.industry else "--",
            "function": get_hierarchy_function(row.name, row.industry),
            "problem_area": row.problem_area
            if row.problem_area
            else get_hierarchy_problem_area(row.name, row.industry),
            "project_status": ProjectStatus.get_label(row.project_status),
            "assignees": [
                {
                    "id": group_row.id,
                    "name": f"{group_row.first_name} {group_row.last_name}",
                }
                for group_row in row.assignees
            ],
            "assignees_label": [f"{group_row.first_name} {group_row.last_name}" for group_row in row.assignees]
            if len(row.assignees) > 0
            else ["--"],
            # "assignee": f'{row.assignee_user.first_name} {row.assignee_user.last_name}' if row.assignee_user else '--',
            "reviewer": f"{row.review_user.first_name} {row.review_user.last_name}" if row.review_user else "--",
            "casestudy_count": Project.query.filter_by(parent_project_id=row.id).count(),
            "origin": row.origin if row.origin else "--",
            "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
            if row.created_by
            else "--",
            "updated_by": f"{row.updated_by_user.first_name} {row.updated_by_user.last_name}"
            if row.updated_by
            else "--",
            "created_at": row.created_at.strftime("%d %B, %Y %H:%M"),
            "updated_at": row.updated_at.strftime("%d %B, %Y %H:%M") if row.updated_at else "--",
            "account": row.account if row.account else "--",
            "user_access": {
                "view": has_view_access(row),
                "edit": has_edit_access(row),
                "delete": has_delete_access(row),
            },
        }
        if row.origin == "PDF":
            row_pd_version = ProblemDefinitionVersion.query.filter_by(
                project_id=row.id, deleted_at=None, is_current=True
            ).first()
            row_data["pd_version_id"] = row_pd_version.version_id
            row_data["version_updated_at"] = (
                row_pd_version.updated_at.timestamp() if row_pd_version.updated_at else None
            )
        response_data.append(row_data)

    return json_response(
        {
            "data": response_data,
            "page": request_data["page"],
            "pages": math.ceil(projects_count / request_data["pageSize"]),
            "count": projects_count,
        }
    )


@bp.route("/codex-api/projects", methods=["POST"])
@login_required
@any_projects_required
def create():
    """Creates a new project, returns project id & name.

    Returns:
        JSON: {id, name}
    """
    try:
        request_data = get_clean_postdata(request)

        project = Project(
            name=request_data["name"],
            industry=request_data["industry"],
            project_status=request_data.get("project_status", 1),
            assignees=[group_row for group_row in request_data["assignees"]] if "assignees" in request_data else [],
            # assignee=request_data['assignee'],
            reviewer=request_data.get("reviewer", 1),
            created_by=g.user.id,
            account=request_data.get("account", None),  # account name
            # problem area to come from UI
            problem_area=request_data.get("problem_area", None),
            origin=request_data.get("origin", None),
        )

        db.session.add(project)
        db.session.commit()

        response = {"id": project.id, "name": project.name}

        if request_data.get("origin", False) in "PDF":
            pd_version_id = uuid.uuid4()
            # TODO: delete the testing version name
            pd_version_name = (
                request_data["version_name"]
                if request_data.get("version_name", False)
                else project.name + " (auto-generated)"
            )
            content = json.dumps(request_data.get("content", {}))
            content = sanitize_content(content)
            project_pd = ProblemDefinitionVersion(
                version_id=pd_version_id,
                version_name=pd_version_name,
                project_id=project.id,
                is_current=True,
                content=content,  # project definition json
                created_by=g.user.id,
            )

            db.session.add(project_pd)
            db.session.commit()

            project_pd_data = {
                "version_id": project_pd.version_id,
                "version_updated_at": project_pd.updated_at.timestamp() if project_pd.updated_at else None,
            }

            response["version_id"] = project_pd_data["version_id"]
            response["version_updated_at"] = project_pd_data["version_updated_at"]

        return json_response(response)

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error creating project"}, 422)


@bp.route("/codex-api/projects/widgets", methods=["GET"])
@login_required
@app_required
def widget_list():
    """Returns a list of all the widgets with their info ordered by name and
    widget groups ordered by id

    Returns:
        JSON: {widgets,widget_group}
    """
    return json_response(
        {
            "widgets": [
                {"id": row.id, "name": row.name, "group_id": row.group_id}
                for row in Widget.query.order_by(Widget.name).all()
            ],
            "widget_groups": [
                {
                    "id": row.id,
                    "name": row.name,
                    "code": row.code,
                    "light_color": row.light_color,
                    "dark_color": row.dark_color,
                    "in_port": row.in_port,
                    "out_port": row.out_port,
                }
                for row in WidgetGroup.query.order_by(WidgetGroup.id).all()
            ],
        }
    )


@bp.route("/codex-api/projects/users", methods=["GET"])
@login_required
@app_required
def user_list():
    """Returns a list of all user with their id and name ordered by first_name.

    Returns:
        JSON: {id, name}
    """
    try:
        return json_response_count(
            [
                {
                    "id": row.id,
                    "name": row.first_name + " " + row.last_name,
                    "email": row.email_address,
                }
                for row in User.query.order_by(User.first_name).all()
            ],
            200,
            User.query.count(),
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error retrieving list of users"}, 500)


@bp.route("/codex-api/projects/reviewers", methods=["GET"])
@login_required
@app_required
def reviewers_list():
    """Returns a list of all user with their id and name ordered by first_name.

    Returns:
        JSON: {id, name}
    """
    try:
        reviewers = User.query.filter(User.user_groups.any(UserGroup.all_projects)).all()
        return json_response_count(
            [
                {
                    "id": row.id,
                    "name": row.first_name + " " + row.last_name,
                    "email": row.email_address,
                }
                for row in reviewers
            ],
            200,
            User.query.count(),
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching users"}, 500)


def has_edit_access(project):
    assignees = project.assignees
    my_projects_only = g.projects_access["my_projects_only"]
    my_projects = g.projects_access["my_projects"]
    all_projects = g.projects_access["all_projects"]
    rbac = g.projects_access["rbac"]
    user_id = g.user.id
    if rbac:
        return True
    elif all_projects and project.created_by == user_id:
        return True
    elif all_projects and project.reviewer == user_id:
        return True
    elif my_projects or my_projects_only:
        for assignee in assignees:
            if assignee.id == g.user.id:
                return True
        return False
    else:
        return False


def has_view_access(project):
    assignees = project.assignees
    my_projects_only = g.projects_access["my_projects_only"]
    my_projects = g.projects_access["my_projects"]
    all_projects = g.projects_access["all_projects"]
    rbac = g.projects_access["rbac"]
    if rbac:
        return True
    elif all_projects:
        return True
    elif my_projects or my_projects_only:
        for assignee in assignees:
            if assignee.id == g.user.id:
                return True
        return False
    else:
        return False


def has_delete_access(project):
    all_projects = g.projects_access["all_projects"]
    rbac = g.projects_access["rbac"]
    user_id = g.user.id
    if rbac:
        return True
    elif all_projects and project.created_by == user_id:
        return True
    elif all_projects and project.reviewer == user_id:
        return True
    else:
        return False


@bp.route("/codex-api/projects/<int:project_id>", methods=["GET"])
@login_required
@app_required
@projects_access_info_required
def show(project_id):
    """Generates the project info for the given project id.

    Args:
        project_id ([type]): [description]

    Returns:
        [type]: {id, name, industry, project_status, assignees,
                 reviewer, is_instance}
    """
    try:
        item = Project.query.filter_by(id=project_id).first()

        if not has_view_access(item):
            return json_response({"error": "You do not have access to view this data"}, 403)

        response = {
            "id": item.id,
            "name": item.name,
            "industry": item.industry,
            "project_status": item.project_status,
            "assignees": [group_row.id for group_row in item.assignees] if item.assignees else [],
            # "assignee": item.assignee,
            "reviewer": item.reviewer,
            "is_instance": True if item.parent_project_id else False,
            "account": item.account,
            "problem_area": item.problem_area,
            "origin": item.origin,
            "created_by": f"{item.created_by_user.first_name} {item.created_by_user.last_name}"
            if item.created_by
            else "--",
            "user_access": {
                "view": has_view_access(item),
                "edit": has_edit_access(item),
                "delete": has_delete_access(item),
            },
        }
        if item.origin == "PDF":
            project_default_pd = ProblemDefinitionVersion.query.filter_by(
                project_id=project_id, is_current=True, deleted_at=None
            ).first()
            content = json.loads(project_default_pd.content) if project_default_pd.content else {}
            response["content"] = sanitize_content(content)
            response["version_id"] = project_default_pd.version_id
            response["version_updated_at"] = project_default_pd.updated_at
            response["is_current"] = project_default_pd.is_current
            response["version_name"] = project_default_pd.version_name
        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


@bp.route("/codex-api/projects/<int:project_id>", methods=["PUT", "POST"])
@login_required
@any_projects_required
@projects_access_info_required
def update(project_id):
    """Updates the project info for the given project id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {'status': True}
    """
    try:
        project = Project.query.filter_by(id=project_id).first()
        if project is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    if not has_edit_access(project):
        return json_response({"error": "You do not have access to edit this data"}, 403)

    try:
        project.name = request_data["name"]
        project.industry = request_data["industry"]
        project.project_status = request_data["project_status"]
        project.assignees = (
            [User.query.filter_by(id=group_row).first() for group_row in request_data["assignees"]]
            if "assignees" in request_data
            else []
        )
        project.assignees = [id for id in project.assignees if id is not None]
        project.reviewer = request_data["reviewer"]
        project.updated_by = g.user.id
        project.account = request_data.get("account", None)
        project.problem_area = request_data.get("problem_area", None)
        # project = Project.query.filter_by(id=project_id).first()

        if project.origin == "PDF":
            project_pd = ProblemDefinitionVersion.query.filter_by(
                project_id=project_id, deleted_at=None, version_id=request_data["version_id"]
            ).first()
            project_pd.content = json.dumps(request_data.get("content", {}))
            project_pd.content = sanitize_content(project_pd.content)
            project_pd.updated_by = g.user.id

        db.session.commit()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error updating project details"}, 500)


@bp.route("/codex-api/projects/<int:project_id>", methods=["DELETE"])
@login_required
@all_projects_required
def delete(project_id):
    """Deletes the project for the given project id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {'deleted_rows': 1}
    """
    try:
        project = Project.query.filter_by(id=project_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        project.deleted_at = func.now()
        project.deleted_by = g.user.id
        if project.origin == "PDF":
            project_pd_versions = ProblemDefinitionVersion.query.filter_by(project_id=project_id, deleted_at=None).all()
            for version in project_pd_versions:
                version.deleted_at = func.now()
                version.deleted_by = g.user.id
        db.session.commit()
        return json_response({"project_deleted": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting project"}, 500)


@bp.route("/codex-api/projects/get-project-artifacts/<int:project_id>", methods=["GET"])
@login_required
@app_required
def get_artifacts(project_id):
    """Retrieves artifact data for the given project id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {status, data}
    """
    try:
        project_object = Projects(project_id)

        return json_response({"status": "success", "data": project_object.get_artifact_summary()})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


@bp.route("/codex-api/projects/get-project-blueprint/<int:project_id>", methods=["GET"])
@login_required
@app_required
def get_blueprint(project_id):
    """Returns blueprint data, casestudy_count, comments data for the given project id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {status, data, casestudy_count, comment_count, comments}
    """
    try:
        project = Project.query.filter_by(id=project_id).first()
        if project is None:
            return json_response({"error": "item not found"}, 404)

        comment_count = ProjectComment.query.filter_by(project_id=project_id, widget_id=None).count()
        comments = [
            {"comment_text": row.comment_text, "widget_id": row.widget_id}
            for row in ProjectComment.query.filter_by(project_id=project_id).all()
        ]
        casestudy_count = Project.query.filter_by(parent_project_id=project_id).count()

        if project.blueprint is None:
            data = False
        else:
            data = json.loads(project.blueprint)

        return json_response(
            {
                "status": "success",
                "data": data,
                "casestudy_count": casestudy_count,
                "comment_count": comment_count,
                "comments": comments,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching project details"}, 404)


@bp.route("/codex-api/projects/get-project-metadata/<int:project_id>", methods=["GET"])
@login_required
@app_required
def get_metadata(project_id):
    """Returns design metadata of the project for the given project id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {status, data}
    """
    try:
        project = Project.query.filter_by(id=project_id).first()
        if project is None:
            return json_response({"error": "item not found"}, 404)

        if project.design_metadata is None:
            data = False
        else:
            data = json.loads(project.design_metadata)

        return json_response({"status": "success", "data": data})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


@bp.route(
    "/codex-api/projects/save-project-blueprint/<int:project_id>",
    methods=["PUT", "POST"],
)
@login_required
@any_projects_required
def save_blueprint(project_id):
    """Saves blueprint to the associated project id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {'status': 'success'}
    """
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        project = Project.query.filter_by(id=project_id).first()
        if project is None:
            return json_response({"error": "item not found"}, 404)

        project.blueprint = json.dumps(request_data["blueprint"])
        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error saving blueprint to project"}, 404)

    return json_response({"status": "success"})


@bp.route("/codex-api/projects/save-project-metadata/<int:project_id>", methods=["PUT"])
@login_required
@any_projects_required
def save_metadata(project_id):
    """Saves metadata to the associated project id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {'status': 'success'}
    """
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        project = Project.query.filter_by(id=project_id).first()
        if project is None:
            return json_response({"error": "item not found"}, 404)

        project.design_metadata = json.dumps(request_data["metadata"])
        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    return json_response({"status": "success"})


@bp.route("/codex-api/projects/get-project-artifacts/<int:project_id>", methods=["PUT"])
@login_required
@app_required
def get_project_artifacts(project_id):
    """Retrieves project artifact data for the given project id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {status, data}
    """
    try:
        request_data = get_clean_postdata(request)
        if "widget_id" in request_data:
            widget_id = request_data["widget_id"]
        else:
            widget_id = None
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        projects_object = Projects(project_id)
        data = projects_object.get_artifacts(widget_id)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching project artifacts"}, 422)

    return json_response({"status": "success", "data": data})


@bp.route("/codex-api/projects/save-project-artifact/<int:project_id>", methods=["PUT"])
@login_required
@any_projects_required
def save_project_artifact(project_id):
    """Saves new project artifact name and data in the given project id

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {status, tiny_url, attachment_id}
    """
    try:
        request_data = get_clean_postdata(request)
        artifact_data = request_data["data"]

        if "widget_id" in request_data:
            widget_id = request_data["widget_id"]
        else:
            widget_id = None

        artifact_name = request_data["name"] if "name" in request_data else None
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        projects_object = Projects(project_id)
        project_attachment = projects_object.save_artifact(artifact_data, artifact_name, widget_id)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error saving project artifact"}, 422)

    return json_response(
        {
            "status": "success",
            "tiny_url": project_attachment["tiny_url"],
            "attachment_id": project_attachment["attachment_id"],
        }
    )


@bp.route(
    "/codex-api/projects/delete-project-artifact/<int:project_attachment_id>",
    methods=["DELETE"],
)
@login_required
@any_projects_required
def delete_project_artifact(project_attachment_id):
    """Deletes the project_attachment for the given id.

    Args:
        widget_attachment_id ([type]): [description]

    Returns:
        JSON: {'deleted_rows': 1}
    """
    try:
        project_attachment = ProjectAttachment.query.filter_by(id=project_attachment_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        project_attachment.deleted_at = func.now()
        project_attachment.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting project attachment"}, 500)


@bp.route("/codex-api/projects/get-project", methods=["PUT"])
@login_required
@app_required
def get_project():
    """Returns project details which include info regarding project's widgets, transfomations, iterations and design metadata

    Returns:
        JSON: {status, data}
    """
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    response_data = {}
    # project_name = f"{request_data['problem'].strip()} - {request_data['industry'].strip()}"

    technique_widget_group = WidgetGroup.query.filter_by(code="MODEL_BUILD").first()
    transform_widget_group = WidgetGroup.query.filter_by(code="TRANSFORM").first()

    try:
        projects_object = Project.query.filter(
            Project.name.ilike(request_data["problem"].strip()),
            Project.industry.ilike(request_data["industry"].strip()),
        ).first()

        project_ids = []

        if projects_object is not None:
            project_ids.append(projects_object.id)
            # Blueprint
            blueprint = json.loads(projects_object.blueprint)
            techniques = []
            transformations = []

            for node in blueprint["nodes"]:
                # Techniques
                if node["extras"]["widget_type"] == technique_widget_group.id and node["name"] not in techniques:
                    techniques.append(node["name"])

                # Transformations
                if node["extras"]["widget_type"] == transform_widget_group.id and node["name"] not in transformations:
                    transformations.append(node["name"])

            case_studies = Project.query.filter_by(parent_project_id=projects_object.id).all()

            for case_study in case_studies:
                project_ids.append(case_study.id)
                casestudy_blueprint = json.loads(case_study.blueprint)

                for node in casestudy_blueprint["nodes"]:
                    # Techniques
                    if node["extras"]["widget_type"] == technique_widget_group.id:
                        technique_name = node["name"].strip()
                        if technique_name not in techniques:
                            techniques.append(technique_name)

                    # Transformations
                    if (
                        node["extras"]["widget_type"] == transform_widget_group.id
                        and node["name"] not in transformations
                    ):
                        transformation_name = node["name"].strip()
                        if transformation_name not in transformations:
                            transformations.append(transformation_name)

            # Iterations Submitted
            project_iterations = (
                ProjectNotebook.query.with_entities(
                    ProjectNotebook.id,
                    User.first_name,
                    func.max(ProjectNotebookConfig.created_at),
                    func.count(ProjectNotebookConfig.id),
                    Project.id,
                    Project.parent_project_id,
                )
                .filter(ProjectNotebook.project_id.in_(project_ids))
                .join(
                    ProjectNotebookConfig,
                    ProjectNotebookConfig.project_nb_id == ProjectNotebook.id,
                )
                .join(User, User.id == ProjectNotebook.created_by)
                .join(Project, Project.id == ProjectNotebook.project_id)
                .group_by(
                    ProjectNotebook.id,
                    User.first_name,
                    Project.id,
                    Project.parent_project_id,
                )
                .order_by(desc(func.max(ProjectNotebookConfig.created_at)))
                .limit(5)
                .all()
            )

            iterations = [
                {
                    "notebook_id": row[0],
                    "creator": row[1],
                    "count": row[3],
                    "project_id": row[4],
                    "parent_project_id": row[5],
                    "last_submitted_at": row[2].strftime("%d %B, %Y"),
                }
                for row in project_iterations
            ]

            # Apps
            project_app = (
                ProjectNotebook.query.with_entities(
                    ProjectNotebook.id,
                    AppConfig.deployed_app_id,
                    Project.id,
                    Project.parent_project_id,
                    AppConfig.id,
                )
                .filter(ProjectNotebook.project_id.in_(project_ids))
                .join(AppConfig, AppConfig.notebook_id == ProjectNotebook.id)
                .join(Project, Project.id == ProjectNotebook.project_id)
                .first()
            )

            design_metadata = json.loads(projects_object.design_metadata)

            response_data = {
                "project_id": projects_object.id,
                "project_name": projects_object.name,
                "design_metadata": design_metadata,
                "techniques": techniques,
                "transformations": transformations,
                "iterations": iterations,
                "deployed_app_notebook_id": project_app[0] if project_app else False,
                "deployed_app_id": project_app[1] if project_app else False,
                "deployed_app_app_id": project_app[4] if project_app else False,
                "deployed_app_project_id": project_app[2] if project_app else False,
                "deployed_app_parent_project_id": project_app[3] if project_app else False,
            }
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching project details"}, 422)

    return json_response({"status": "success", "data": response_data})


@bp.route("/codex-api/projects/get-comments/<int:project_id>", methods=["PUT"])
@login_required
@app_required
def get_comments(project_id):
    """Returns list of comments for the given project and widget id

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {status, data}
    """
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        projects_object = Projects(project_id)
        response_data = projects_object.get_comments(request_data["widget_id"])
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in fetching comments"}, 422)

    return json_response({"status": "success", "data": response_data})


@bp.route("/codex-api/projects/add-comment/<int:project_id>", methods=["PUT"])
@login_required
@app_required
def create_comment(project_id):
    """Create comment for the given project and widget id

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {id}
    """
    try:
        request_data = get_clean_postdata(request)

        project_comment = ProjectComment(
            comment_text=request_data["comment_text"],
            project_id=project_id,
            created_by=g.user.id,
            widget_id=request_data["widget_id"] if request_data["widget_id"] else None,
        )
        db.session.add(project_comment)
        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error adding comment"}, 422)

    return json_response({"id": project_comment.id})


@bp.route("/codex-api/projects/delete-comment/<int:comment_id>", methods=["PUT"])
@login_required
@app_required
def delete_comment(comment_id):
    """Deletes comment using the given comment id.

    Args:
        comment_id ([type]): [description]

    Returns:
        JSON: {'deleted_rows': 1}
    """
    try:
        project_comment = ProjectComment.query.filter_by(id=comment_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        project_comment.deleted_at = func.now()
        project_comment.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting comment"}, 500)


@bp.route("/codex-api/projects/get-code/<int:project_id>", methods=["PUT"])
@login_required
@app_required
def get_code(project_id):
    """Fetches the project code for the given project and widget id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {response}
    """
    response = {"data": ""}

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing request data"}, 422)

    try:
        project_code = ProjectCode.query.filter_by(project_id=project_id, widget_id=request_data["widget_id"]).first()

        if project_code is not None:
            response["data"] = project_code.code_text
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        response["error"] = "Error in querying project code"

    try:
        if "base_widget_id" in request_data and request_data["base_widget_id"] and request_data["base_widget_id"] != "":
            widget = Widget.query.filter_by(id=request_data["base_widget_id"]).first()

            if widget and widget.test_code_params:
                code_details = json.loads(widget.test_code_params)
                widget_code = git_preview_code(code_details)

                response["base_data"] = widget_code
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        response["base_error"] = "Error fetching widget code"

    return json_response(response)


@bp.route("/codex-api/projects/save-code/<int:project_id>", methods=["PUT"])
@login_required
@any_projects_required
def save_code(project_id):
    """Saves the code text and widget id in the project code table for the given project id.

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {id}
    """
    try:
        request_data = get_clean_postdata(request)

        project_code = ProjectCode.query.filter_by(project_id=project_id, widget_id=request_data["widget_id"]).first()

        if project_code is None:
            project_code = ProjectCode(
                code_text=request_data["code_text"],
                project_id=project_id,
                created_by=g.user.id,
                widget_id=request_data["widget_id"],
            )
            db.session.add(project_code)
        else:
            project_code.code_text = request_data["code_text"]
            project_code.project_id = project_id
            project_code.created_by = g.user.id
            project_code.widget_id = request_data["widget_id"]

        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error saving widget code"}, 422)

    return json_response({"id": project_code.id})


@bp.route("/codex-api/projects/get-widget-components", methods=["PUT"])
@login_required
@app_required
def get_widget_components():
    """Returns metadata and code details for the given widget id

    Returns:
        JSON: {status, metadata, code_demo, code_details}
    """
    metadata = False
    code_demo = False
    code_details = False
    try:
        request_data = get_clean_postdata(request)

        widget = Widget.query.filter_by(id=request_data["widget_id"]).first()

        if widget and widget.test_code_params and widget.test_code_params != "":
            code_details = json.loads(widget.test_code_params)
            widget_code = git_preview_code(code_details)
            metadata = git_code_metadata(widget_code, widget.widget_group.code)
            code_demo = jupyter_code_demo(code_details)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        metadata = False
        code_demo = False

    return json_response(
        {
            "status": "success",
            "metadata": metadata,
            "code_demo": code_demo,
            "code_details": code_details,
        }
    )


@bp.route("/codex-api/projects/get-widget-components/<int:widget_id>", methods=["GET"])
@login_required
@app_required
def get_widget_components_fromid(widget_id):
    """Returns metadata and code details for the given widget id

    Args:
        widget_id ([type]): [description]

    Returns:
        JSON: {status, metadata, code_demo, code_details}
    """
    metadata = False
    code_demo = False
    code_details = False
    try:
        widget = Widget.query.filter_by(id=widget_id).first()

        if widget and widget.test_code_params and widget.test_code_params != "":
            code_details = json.loads(widget.test_code_params)
            widget_code = git_preview_code(code_details)
            metadata = git_code_metadata(widget_code, widget.widget_group.code)
            code_demo = jupyter_code_demo(code_details)
    except Exception as error_msg:
        metadata = False
        code_demo = False
        ExceptionLogger(error_msg)

    return json_response(
        {
            "status": "success",
            "metadata": metadata,
            "code_demo": code_demo,
            "code_details": code_details,
        }
    )


@bp.route("/codex-api/projects/download-code/<int:project_id>", methods=["GET"])
@login_required
@any_projects_required
def download_code(project_id):
    """Fetches the blueprint code for the given project_id in a tinyurl

    Args:
        project_id ([type]): [description]

    Returns:
        JSON: {status, url}
    """
    try:
        project_object = Projects(project_id)
        tiny_url = project_object.get_blueprint_code()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response(
            {
                "status": "success",
                "error_message": "Error fetching project blueprint code",
            }
        )

    return json_response({"status": "success", "url": tiny_url})


@bp.route("/codex-api/projects/upload-config-params/<string:access_token>", methods=["PUT"])
def upload_config_params(access_token):
    """Saves the configuration parameters of user's project notebook in project_notebook_config and project_notebook_config_tag tables

    Args:
        access_token ([type]): [description]

    Returns:
        json: {'success': True}
    """
    project_nb = ProjectNotebook.query.filter_by(access_token=access_token).first()

    if project_nb:
        try:
            request_data = json.loads(get_clean_postdata(request))
            params = {
                "widgets": request_data["widgets"],
                "tags": request_data["tags"],
                "params": request_data["params"] if "params" in request_data else False,
            }
        except Exception as error_msg:
            ExceptionLogger(error_msg)
            return json_response({"error": "Error parsing request data"}, 422)

        try:
            exogs = None
            if "exogs" in request_data["params"]:
                exogs = "|".join(request_data["params"]["exogs"])

            iteration_params = None
            if "args" in request_data["params"] and request_data["params"]["args"]:
                iteration_params = []
                for arg_key in request_data["params"]["args"]:
                    iteration_params.append(arg_key + " - " + str(request_data["params"]["args"][arg_key]))
                iteration_params = "|".join(iteration_params)

            project_nb_config = ProjectNotebookConfig(
                project_nb_id=project_nb.id,
                config_params=json.dumps(params),
                results=json.dumps(request_data["results"]),
                technique=request_data["params"]["technique"] if "technique" in request_data["params"] else None,
                dep_var=request_data["params"]["dep_var"] if "dep_var" in request_data["params"] else None,
                accuracy=request_data["params"]["accuracy"] if "accuracy" in request_data["params"] else None,
                exogs=exogs,
                params=iteration_params,
            )
            db.session.add(project_nb_config)
            db.session.flush()

            for tag_key, tag_value in request_data["tags"].items():
                project_nb_config_tag = ProjectNotebookConfigTag(
                    project_nb_config_id=project_nb_config.id,
                    tag_name=tag_key,
                    tag_value=tag_value,
                )
                db.session.add(project_nb_config_tag)
                db.session.flush()

            db.session.commit()

            return json_response({"success": True})
        except Exception as error_msg:
            ExceptionLogger(error_msg)
            return json_response({"error": "Error in saving configuration"}, 500)
    else:
        return json_response({"error": "Project notebook not found"}, 404)


@bp.route("/codex-api/projects/delete-iterations/<string:access_token>", methods=["PUT"])
def delete_all(access_token):
    """Deletes all the notebook configuration tags from the logged in users table.

    Args:
        access_token ([type]): [description]

    Returns:
        JSON: {deleted_rows}
    """
    project_nb = ProjectNotebook.query.filter_by(access_token=access_token).first()

    deleted_rows = 0

    if project_nb:
        project_nb_configs = ProjectNotebookConfig.query.filter_by(project_nb_id=project_nb.id).all()

        for project_nb_config in project_nb_configs:
            try:
                project_nb_config_tags = ProjectNotebookConfigTag.query.filter_by(
                    project_nb_config_id=project_nb_config.id
                ).all()
            except Exception as error_msg:
                ExceptionLogger(error_msg)

            try:
                for project_nb_config_tag in project_nb_config_tags:
                    project_nb_config_tag.deleted_at = func.now()

                project_nb_config.deleted_at = func.now()

                db.session.commit()
                deleted_rows = deleted_rows + 1
            except Exception as error_msg:
                ExceptionLogger(error_msg)

        return json_response({"deleted_rows": deleted_rows})
    else:
        return json_response({"error": "Project notebook not found"}, 404)


@bp.route("/codex-api/projects/update-run-status/<string:access_token>", methods=["PUT"])
def update_run_status(access_token):
    """Updates the notebook trigger data for the logged in user's project.

    Args:
        access_token ([type]): [description]

    Returns:
        JSON: {'success': True}
    """
    project_nb = ProjectNotebook.query.filter_by(access_token=access_token).first()

    if project_nb:
        try:
            request_data = json.loads(get_clean_postdata(request))
            triggered_run_id = request_data["triggered_run_id"]
            status = request_data["status"]
            trigger_run_url = request_data["trigger_run_url"] if "trigger_run_url" in request_data else None
        except Exception as error_msg:
            ExceptionLogger(error_msg)
            return json_response({"error": "Error parsing request data"}, 422)

        try:
            triggered_run = ProjectNotebookTriggered.query.filter_by(id=triggered_run_id).first()
            triggered_run.trigger_status = status
            triggered_run.trigger_run_url = trigger_run_url
            db.session.commit()

            return json_response({"success": True})
        except Exception as error_msg:
            ExceptionLogger(error_msg)
            return json_response({"error": "Error in operation"}, 500)
    else:
        return json_response({"error": "Project notebook not found"}, 404)


def get_hierarchy_function(problem, industry):
    for problem_item in hierarchy["problems"]:
        if problem_item["problem"].lower() == problem.lower() and problem_item["industry"].lower() == industry.lower():
            return problem_item["function"]

    return "--"


def get_hierarchy_problem_area(problem, industry):
    for problem_item in hierarchy["problems"]:
        if problem_item["problem"].lower() == problem.lower() and problem_item["industry"].lower() == industry.lower():
            return problem_item["problem_area"]

    return "--"
