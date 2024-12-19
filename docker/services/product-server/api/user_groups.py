#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.db_models.user_management.users import User, UserGroup
from api.helpers import get_clean_postdata
from api.middlewares import login_required, rbac_required
from api.models import UserGroupType, db
from flasgger.utils import swag_from
from flask import Blueprint, g, request
from sqlalchemy import desc
from sqlalchemy.sql import func

bp = Blueprint("UserGroups", __name__)


# TODO insert a try catch and create error endpoint
@bp.route("/codex-product-api/user-groups", methods=["GET"])
@swag_from("./documentation/user_groups/list.yml")
@login_required
# @rbac_required
def list():
    """Returns list of user group with their info
    Returns:
        JSON : {list of dictionaries with user group info, 200, count}
    """
    return json_response_count(
        [
            {
                "id": row.id,
                "name": row.name,
                "app": row.app,
                "case_studies": row.case_studies,
                "my_projects_only": row.my_projects_only,
                "my_projects": row.my_projects,
                "all_projects": row.all_projects,
                "widget_factory": row.widget_factory,
                "environments": row.environments,
                "app_publish": row.app_publish,
                "prod_app_publish": row.prod_app_publish,
                "rbac": row.rbac,
                "user_group_type": UserGroupType.get_label(row.user_group_type),
                "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                if row.created_by
                else "--",
            }
            for row in UserGroup.query.order_by(desc(UserGroup.created_at))
        ],
        200,
        UserGroup.query.count(),
    )


@bp.route("/codex-product-api/user-groups", methods=["POST"])
@swag_from("./documentation/user_groups/create.yml")
@login_required
@rbac_required
def create():
    """Creates a new user group
    Returns:
        JSON : {id, name}
    """
    try:
        request_data = get_clean_postdata(request)

        user_group = UserGroup(
            name=request_data["name"],
            app=request_data["app"] if "app" in request_data and request_data["app"] != "" else False,
            case_studies=request_data["case_studies"]
            if "case_studies" in request_data and request_data["case_studies"] != ""
            else False,
            my_projects_only=request_data["my_projects_only"]
            if "my_projects_only" in request_data and request_data["my_projects_only"] != ""
            else False,
            my_projects=request_data["my_projects"]
            if "my_projects" in request_data and request_data["my_projects"] != ""
            else False,
            all_projects=request_data["all_projects"]
            if "all_projects" in request_data and request_data["all_projects"] != ""
            else False,
            widget_factory=request_data["widget_factory"]
            if "widget_factory" in request_data and request_data["widget_factory"] != ""
            else False,
            environments=request_data["environments"]
            if "environments" in request_data and request_data["environments"] != ""
            else False,
            app_publish=request_data["app_publish"]
            if "app_publish" in request_data and request_data["app_publish"] != ""
            else False,
            prod_app_publish=request_data["prod_app_publish"]
            if "prod_app_publish" in request_data and request_data["prod_app_publish"] != ""
            else False,
            rbac=request_data["rbac"] if "rbac" in request_data and request_data["rbac"] != "" else False,
            user_group_type=UserGroupType.USER_CREATED.value,
            created_by=g.user.id,
        )
        db.session.add(user_group)
        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error : ": "Error creating user group"}, 422)

    return json_response({"message": "Success", "id": user_group.id, "name": user_group.name})


@bp.route("/codex-product-api/user-groups/<int:user_group_id>", methods=["GET"])
@swag_from("./documentation/user_groups/show.yml")
@login_required
@rbac_required
def show(user_group_id):
    """Returns the user group info for the given user group id
    Args:
        user_group_id ([type]): [description]
    Returns:
        JSON : {list of dictionaries with user group info, }
    """
    try:
        item = UserGroup.query.filter_by(id=user_group_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "user_group_type": item.user_group_type,
                "app": item.app,
                "case_studies": item.case_studies,
                "my_projects_only": item.my_projects_only,
                "my_projects": item.my_projects,
                "all_projects": item.all_projects,
                "widget_factory": item.widget_factory,
                "environments": item.environments,
                "publish": item.app_publish,
                "prod_app_publish": item.prod_app_publish,
                "rbac": item.rbac,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Item not found"}, 404)


# TODO add 404 422/401 etc exceptions
@bp.route("/codex-product-api/user-groups/<int:user_group_id>", methods=["PUT", "POST"])
@swag_from("./documentation/user_groups/update.yml", methods=["PUT"])
@login_required
@rbac_required
def update(user_group_id):
    """Update the user group info for the given user group id.
    Args:
        user_group_id ([type]): [description]
    Returns:
        JSON: {'status': True}
    """
    try:
        user_group = UserGroup.query.filter_by(id=user_group_id).first()
        if user_group is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        user_group.name = request_data["name"]
        user_group.app = request_data["app"] if "app" in request_data and request_data["app"] != "" else False
        user_group.case_studies = (
            request_data["case_studies"]
            if "case_studies" in request_data and request_data["case_studies"] != ""
            else False
        )
        user_group.my_projects_only = (
            request_data["my_projects_only"]
            if "my_projects_only" in request_data and request_data["my_projects_only"] != ""
            else False
        )
        user_group.my_projects = (
            request_data["my_projects"]
            if "my_projects" in request_data and request_data["my_projects"] != ""
            else False
        )
        user_group.all_projects = (
            request_data["all_projects"]
            if "all_projects" in request_data and request_data["all_projects"] != ""
            else False
        )
        user_group.widget_factory = (
            request_data["widget_factory"]
            if "widget_factory" in request_data and request_data["widget_factory"] != ""
            else False
        )
        user_group.environments = (
            request_data["environments"]
            if "environments" in request_data and request_data["environments"] != ""
            else False
        )
        user_group.app_publish = (
            request_data["app_publish"]
            if "app_publish" in request_data and request_data["app_publish"] != ""
            else False
        )
        user_group.prod_app_publish = (
            request_data["prod_app_publish"]
            if "prod_app_publish" in request_data and request_data["prod_app_publish"] != ""
            else False
        )
        user_group.rbac = request_data["rbac"] if "rbac" in request_data and request_data["rbac"] != "" else False
        user_group.updated_by = g.user.id
        db.session.commit()
        user_group = UserGroup.query.filter_by(id=user_group_id).first()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error updating user groups"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/user-groups/<int:user_group_id>", methods=["DELETE"])
@swag_from("./documentation/user_groups/delete.yml")
@login_required
@rbac_required
def delete(user_group_id):
    """Delete the user group info for the given user group id.
    Args:
        user_group_id ([type]): [description]
    Returns:
        json : {'deleted_rows': 1}
    """
    try:
        user_group = UserGroup.query.filter_by(id=user_group_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        mapped_user = User.query.filter(User.user_groups.any(UserGroup.id == user_group_id)).first()
        if mapped_user:
            return json_response({"error": "Cannot delete as user/users are mapped to this group"}, 400)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting user groups"}, 500)
    try:
        user_group.deleted_at = func.now()
        user_group.deleted_by = g.user.id
        db.session.commit()
        return json_response({"message": "Success", "deleted_user_group": user_group.name})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting user groups"}, 500)
    finally:
        db.session.close()
