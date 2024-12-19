#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.codex_models.projects import Projects
from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.helpers import get_clean_postdata
from api.middlewares import app_required, casestudies_required, login_required
from api.models import Project, ProjectStatus, User, db
from flasgger.utils import swag_from
from flask import Blueprint, g, request
from sqlalchemy.sql import func

bp = Blueprint("CaseStudies", __name__)


@bp.route("/codex-api/casestudies/<int:project_id>", methods=["GET"])
@swag_from("./documentation/casestudies/instance_list.yml")
@login_required
@app_required
def instance_list(project_id):
    instance_list = []
    try:
        instance_list = [
            {
                "id": row.id,
                "name": row.name,
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
                "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                if row.created_by
                else "--",
                "updated_by": f"{row.updated_by_user.first_name} {row.updated_by_user.last_name}"
                if row.updated_by
                else "--",
                "created_at": row.created_at.strftime("%d %B, %Y %H:%M"),
                "updated_at": row.updated_at.strftime("%d %B, %Y %H:%M") if row.updated_at else "--",
            }
            for row in Project.query.filter_by(parent_project_id=project_id).all()
        ]
        return json_response_count(instance_list, 200, Project.query.count())
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching case studies"}, 500)


@bp.route("/codex-api/casestudies/<int:project_id>", methods=["POST"])
@swag_from("./documentation/casestudies/create_instance.yml")
@login_required
@casestudies_required
def create_instance(project_id):
    try:
        request_data = get_clean_postdata(request)

        projects_object = Projects(project_id)
        instance = projects_object.create_casestudy(request_data)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error :": "Error creating case study"}, 422)

    return json_response({"id": instance.id, "name": instance.name})


@bp.route("/codex-api/casestudies/<int:project_id>/users", methods=["GET"])
@swag_from("./documentation/casestudies/instance_user_list.yml")
@login_required
@casestudies_required
def instance_user_list(project_id):
    return json_response_count(
        [{"id": row.id, "name": row.first_name + " " + row.last_name} for row in User.query.all()],
        200,
        User.query.count(),
    )


@bp.route("/codex-api/casestudies/<int:project_id>/<int:instance_id>", methods=["GET"])
@swag_from("./documentation/casestudies/show_instance.yml")
@login_required
@casestudies_required
def show_instance(project_id, instance_id):
    """Returns the project info for the given instance_id

    Args:
        instance_id ([type]): [description]

    Returns:
        json: {id,name,project_status,assignees,reviewer}
    """
    try:
        item = Project.query.filter_by(id=instance_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "project_status": item.project_status,
                "assignees": [group_row.id for group_row in item.assignees] if item.assignees else [],
                # "assignee": item.assignee,
                "reviewer": item.reviewer,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


# TODO remove [post?]?
@bp.route("/codex-api/casestudies/<int:project_id>/<int:instance_id>", methods=["PUT", "POST"])
@swag_from("./documentation/casestudies/update_instance_put.yml", methods=["PUT"])
@login_required
@casestudies_required
def update_instance(project_id, instance_id):
    try:
        project = Project.query.filter_by(id=instance_id).first()
        if project is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Could not update"}, 422)

    try:
        project.name = request_data["name"]
        project.industry = None
        project.project_status = (
            request_data["project_status"]
            if "project_status" in request_data and request_data["project_status"]
            else None,
        )
        project.assignees = (
            [User.query.filter_by(id=group_row).first() for group_row in request_data["assignees"]]
            if "assignees" in request_data
            else []
        )
        # project.assignee = request_data['assignee']
        project.reviewer = request_data["reviewer"] if "reviewer" in request_data and request_data["reviewer"] else None
        project.updated_by = g.user.id
        db.session.commit()
        project = Project.query.filter_by(id=instance_id).first()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error updating case study"}, 500)


@bp.route("/codex-api/casestudies/<int:project_id>/<int:instance_id>", methods=["DELETE"])
@swag_from("./documentation/casestudies/delete_instance.yml")
@login_required
@casestudies_required
def delete_instance(project_id, instance_id):
    """Deletes the project using the given instance_id by adding time and date in deleted_at column

    Args:
        instance_id ([type]): [description]

    Returns:
        json : {'deleted_rows': 1}
    """
    try:
        project = Project.query.filter_by(id=instance_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        project.deleted_at = func.now()
        project.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Delete operation error"}, 500)
