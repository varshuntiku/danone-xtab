import math
import os
import time
import uuid
from datetime import timedelta

import jwt
from api.constants.functions import (
    ExceptionLogger,
    json_response,
    json_response_count,
    sanitize_content,
)
from api.db_models.projects.projects import (
    ProblemDefinitionVersion,
    Project,
    ProjectStatus,
    db,
)
from api.db_models.user_management.users import User, UserGroup
from api.helpers import delete_blob, get_clean_postdata, upload_blob
from api.hierarchy import hierarchy
from api.middlewares import (
    all_projects_required,
    any_projects_required,
    app_required,
    login_required,
    project_internal_service_access_required,
    projects_access_info_required,
)
from api.services.dsw_execution_environment.dsw_execution_environment_project_mapping_service import (
    DSWExecutionEnvironmentProjectMappingService,
)
from azure.storage.fileshare import ShareServiceClient
from flasgger.utils import swag_from
from flask import Blueprint
from flask import current_app as app
from flask import g, json, request
from sqlalchemy import asc, desc  # , and_
from sqlalchemy.sql import func, or_

bp = Blueprint("Projects", __name__)


@bp.route("/codex-product-api/project-attachment", methods=["POST"])
@swag_from("./documentation/projects/project_contnet_upload.yml")
@login_required
def project_contnet_upload():
    try:
        file = request.files["file"]
        file_name = file.filename

        t = round(time.time() * 1000)
        file_name = file_name.split(".")[0] + "_" + str(t) + "." + ".".join(file_name.split(".")[1:])

        url = upload_blob(file.read(), "projects/" + file_name, timedelta(days=365 * 1000))
        response = {"path": url, "filename": file_name}
        return json_response(response)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error in operation"}, 500)


@bp.route("/codex-product-api/project-attachment", methods=["DELETE"])
@swag_from("./documentation/projects/project_contnet_delete.yml")
@login_required
def project_contnet_delete():
    try:
        file_name = request.args.get("file_name", "")
        resp = delete_blob("projects/" + file_name)
        print("resp", resp)
        response = {"message": "Deleted the file from Blob", "filename": file_name}
        return json_response(response)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error in delete operation"}, 500)


@bp.route("/codex-product-api/projects/list", methods=["PUT", "POST"])
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
                    projects = projects.filter(func.lower(Project.name).like("%" + filter_item["value"].lower() + "%"))
                if filter_item["id"] == "industry":
                    projects = projects.filter(
                        func.lower(Project.industry).like("%" + filter_item["value"].lower() + "%")
                    )
                elif filter_item["id"] == "assignees_label":
                    projects = projects.filter(
                        Project.assignees.any(
                            or_(
                                func.lower(User.first_name).like("%" + filter_item["value"].lower() + "%"),
                                func.lower(User.last_name).like("%" + filter_item["value"].lower() + "%"),
                            )
                        )
                    )
                elif filter_item["id"] == "reviewer":
                    projects = projects.filter(
                        Project.review_user.has(
                            or_(
                                func.lower(User.first_name).like("%" + filter_item["value"].lower() + "%"),
                                func.lower(User.last_name).like("%" + filter_item["value"].lower() + "%"),
                            )
                        )
                    )
                elif filter_item["id"] == "created_by":
                    projects = projects.filter(
                        Project.created_by_user.has(
                            or_(
                                func.lower(User.first_name).like("%" + filter_item["value"].lower() + "%"),
                                func.lower(User.last_name).like("%" + filter_item["value"].lower() + "%"),
                            )
                        )
                    )
                elif filter_item["id"] == "updated_by":
                    projects = projects.filter(
                        Project.updated_by_user.has(
                            or_(
                                func.lower(User.first_name).like("%" + filter_item["value"].lower() + "%"),
                                func.lower(User.last_name).like("%" + filter_item["value"].lower() + "%"),
                            )
                        )
                    )
                elif filter_item["id"] == "account":
                    projects = projects.filter(
                        func.lower(Project.account).like("%" + filter_item["value"].lower() + "%")
                    )

                elif filter_item["id"] == "origin":
                    projects = projects.filter(
                        func.lower(Project.origin).like("%" + filter_item["value"].lower() + "%")
                    )

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


@bp.route("/codex-product-api/projects", methods=["GET"])
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


@bp.route("/codex-product-api/projects", methods=["POST"])
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
        db.session.flush()

        response = {"id": project.id, "name": project.name}

        if request_data.get("origin", False) in ["PDF", "DS-Workbench"]:
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
            db.session.flush()

            project_pd_data = {
                "version_id": project_pd.version_id,
                "version_updated_at": project_pd.updated_at.timestamp() if project_pd.updated_at else None,
            }

            response["version_id"] = project_pd_data["version_id"]
            response["version_updated_at"] = project_pd_data["version_updated_at"]
        db.session.commit()

        return json_response(response)

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error creating project"}, 422)


@bp.route("/codex-product-api/projects/<int:project_id>", methods=["GET"])
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
        if item.origin == "PDF" or request.args.get("pdfContent", None):
            project_default_pd = ProblemDefinitionVersion.query.filter_by(
                project_id=project_id, is_current=True, deleted_at=None
            ).first()
            content = (
                json.loads(project_default_pd.content) if project_default_pd and project_default_pd.content else None
            )
            response["content"] = sanitize_content(content)
            response["version_id"] = project_default_pd.version_id if project_default_pd else None
            response["version_updated_at"] = project_default_pd.updated_at if project_default_pd else None
            response["is_current"] = project_default_pd.is_current if project_default_pd else None
            response["version_name"] = project_default_pd.version_name if project_default_pd else None
        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


@bp.route("/codex-product-api/projects/<int:project_id>", methods=["PUT", "POST"])
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

        if project.origin in ["PDF", "DS-Workbench"]:
            project_pd = ProblemDefinitionVersion.query.filter_by(
                project_id=project_id,
                deleted_at=None,
                version_id=request_data["version_id"],
            ).first()
            project_pd.content = json.dumps(request_data.get("content", {}))
            project_pd.content = sanitize_content(project_pd.content)
            project_pd.updated_by = g.user.id

        db.session.commit()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error updating project details"}, 500)


@bp.route("/codex-product-api/projects/<int:project_id>", methods=["DELETE"])
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


@bp.route("/codex-product-api/projects/users", methods=["GET"])
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


@bp.route("/codex-product-api/projects/reviewers", methods=["GET"])
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


@bp.route("/codex-product-api/project/<int:id>/jphub_access_token", methods=["GET"])
@login_required
def get_jupyterhub_access_token(id):
    """Returns a list of all user with their id and name ordered by first_name.

    Returns:
        JSON: {token}
    """
    try:
        key_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "encode_key.pem"))
        private_key = open(key_file_path, "r").read()
        exe_env_project_mapping_service = DSWExecutionEnvironmentProjectMappingService()
        mapping = exe_env_project_mapping_service.get_by_project_id(project_id=id)
        data = {
            "u": g.user.email_address,
            "fn": g.user.first_name,
            "ln": g.user.last_name,
            "pid": id,
            "es": [
                {
                    "id": obj.id,
                    "eid": obj.execution_environment_id,
                    "c": obj.config or {},
                    "ec": obj.execution_env.config if obj.execution_env else {},
                }
                for obj in mapping
            ]
            if mapping
            else [],
        }
        encoded_token = jwt.encode(data, private_key, algorithm="RS256")
        return json_response({"token": encoded_token})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while getting jupyterhub_access_token"}, 500)


@bp.route("/codex-product-api/project/create-file-share", methods=["POST"])
@project_internal_service_access_required
def create_file_share():
    """Returns a list of all user with their id and name ordered by first_name.

    Returns:
        JSON: {token}
    """
    try:
        request_data = get_clean_postdata(request)
        folder_name = request_data.get("folder_name", "")
        FILESHARE_NAME = app.config.get("FILESHARE_NAME")
        AZURE_FILESHARE_CONNECTION_STRING = app.config.get("AZURE_FILESHARE_CONNECTION_STRING")
        if folder_name:
            share_service_client = ShareServiceClient.from_connection_string(AZURE_FILESHARE_CONNECTION_STRING)
            share_client = share_service_client.get_share_client(FILESHARE_NAME)
            if share_client.get_directory_client(folder_name).exists():
                return json_response({"error": f"Folder '{folder_name}' already exists in share."}, 409)
            share_client.create_directory(folder_name)
            return json_response({"message": f"Folder '{folder_name}' created successfully in share."}, 200)
        else:
            return json_response({"error": "folder_name not provided"}, 400)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in create-file-share"}, 500)
