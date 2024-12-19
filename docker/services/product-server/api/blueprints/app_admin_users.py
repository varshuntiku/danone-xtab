#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.constants.functions import ExceptionLogger, json_response
from api.helpers import get_clean_postdata
from api.middlewares import login_required
from api.models import AppUser, AppUserRole, app_user_role_identifier, db
from flasgger.utils import swag_from
from flask import Blueprint, g, json, request
from sqlalchemy.sql import asc, func

bp = Blueprint("AppAdminUsers", __name__)


@bp.route("/codex-product-api/app-admin/app-users/<int:app_id>", methods=["GET"])
@swag_from("./documentation/app_admin/app_admin_users/app_users.yml")
@login_required
def app_users(app_id):
    try:
        response = [
            {
                "id": row.id,
                "first_name": row.first_name,
                "last_name": row.last_name,
                "email_address": row.user_email,
                "is_admin": row.is_admin,
                "user_roles": [{"id": userrole_row.id, "name": userrole_row.name} for userrole_row in row.user_roles],
                "responsibilities": json.loads(row.permissions).get("responsibilities", [])
                if row.permissions
                else False,
            }
            for row in AppUser.query.filter(AppUser.app_id == app_id).order_by(asc(AppUser.id))
        ]

        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in fetching app users"}, 500)


@bp.route("/codex-product-api/app-admin/app-user-roles/<int:app_id>", methods=["GET"])
@swag_from("./documentation/app_admin/app_admin_users/app_user_roles.yml")
@login_required
def app_user_roles(app_id):
    try:
        response = [
            {
                "id": row.id,
                "name": row.name,
                "permissions": json.loads(row.permissions) if row.permissions else False,
            }
            for row in AppUserRole.query.filter(AppUserRole.app_id == app_id).order_by(asc(AppUserRole.id))
        ]
        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in fetching app user roles"}, 500)


@bp.route("/codex-product-api/app-admin/app-user-roles", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin_users/create_app_user_role.yml")
@login_required
def create_app_user_role():
    try:
        request_data = get_clean_postdata(request)

        app_roles = (
            AppUserRole.query.filter_by(name=request_data["name"]).filter_by(app_id=request_data["app_id"]).first()
        )

        if app_roles is not None:
            return json_response({"error": "Role name is conflicting."}, 409)

        user_role = AppUserRole(
            name=request_data["name"],
            app_id=request_data["app_id"],
            permissions=json.dumps(request_data["permissions"]),
        )
        db.session.add(user_role)
        db.session.commit()
        return json_response({"id": user_role.id, "name": user_role.name})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in updating app user roles"}, 422)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app-user-roles/<int:app_user_role_id>",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin_users/update_app_user_role.yml")
@login_required
def update_app_user_role(app_user_role_id):
    try:
        user_role = AppUserRole.query.filter_by(id=app_user_role_id).first()
        if user_role is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
        other_role_with_same_name = (
            AppUserRole.query.filter_by(name=request_data["name"])
            .filter_by(app_id=request_data["app_id"])
            .filter(AppUserRole.id != app_user_role_id)
            .first()
        )

        if other_role_with_same_name:
            return json_response({"error": "Role name is conflicting."}, 409)

        user_role.name = request_data["name"]
        user_role.app_id = request_data["app_id"]
        user_role.permissions = json.dumps(request_data["permissions"])

        db.session.commit()
        response = {"id": user_role.id, "name": user_role.name}
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in updating app user roles"}, 422)
    finally:
        db.session.close()

    return json_response(response)


@bp.route(
    "/codex-product-api/app-admin/app-user-roles/<int:app_user_role_id>",
    methods=["DELETE"],
)
@swag_from("./documentation/app_admin/app_admin_users/delete_app_user_role.yml")
@login_required
def delete_app_user_role(app_user_role_id):
    try:
        user_role = AppUserRole.query.filter_by(id=app_user_role_id).first()
        if user_role is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        confirm = request.args.get("confirm", False)
        if not confirm:
            user_role_mapping = [
                row.app_user_id
                for row in db.session.query(app_user_role_identifier).filter_by(app_user_role_id=app_user_role_id).all()
            ]
            associated_users = AppUser.query.filter(AppUser.id.in_(user_role_mapping)).all()
            if len(associated_users):
                return json_response({"error": "Role is associated with users."}, 409)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in deleting app user roles"}, 500)

    try:
        user_role.deleted_at = func.now()
        db.session.query(app_user_role_identifier).filter_by(app_user_role_id=app_user_role_id).delete()
        db.session.commit()
        response = {"id": user_role.id, "name": user_role.name}
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in deleting app user roles"}, 422)
    finally:
        db.session.close()

    return json_response(response)


@bp.route("/codex-product-api/app-admin/app-users", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin_users/create_app_user.yml")
@login_required
def create_app_user():
    try:
        request_data = get_clean_postdata(request)

        app_user = (
            AppUser.query.filter_by(user_email=request_data["email_address"].lower())
            .filter_by(app_id=request_data["app_id"])
            .first()
        )

        if app_user is not None:
            return json_response({"error": "App user already exists"}, 409)
        else:
            app_user = AppUser(
                app_id=request_data["app_id"],
                first_name=request_data["first_name"],
                last_name=request_data["last_name"],
                user_email=request_data["email_address"].lower(),
                user_roles=[group_id for group_id in request_data["user_roles"]]
                if "user_roles" in request_data
                else [],
                permissions=json.dumps({"responsibilities": request_data["responsibilities"]})
                if "responsibilities" in request_data
                else None,
            )
            db.session.add(app_user)
            db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in updating app users"}, 422)
    finally:
        db.session.close()

    return json_response({"status": "success"})


@bp.route("/codex-product-api/app-admin/app-users/<int:app_user_id>", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin_users/update_app_user.yml")
@login_required
def update_app_user(app_user_id):
    try:
        app_user = AppUser.query.filter_by(id=app_user_id).first()
        if app_user is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)

        other_user_with_same_email = (
            AppUser.query.filter_by(user_email=request_data["email_address"].lower())
            .filter_by(app_id=request_data["app_id"])
            .filter(AppUser.id != app_user_id)
            .first()
        )

        if other_user_with_same_email is not None:
            return json_response({"error": "Email id is conflicting"}, 409)

        app_user.app_id = request_data["app_id"]
        app_user.first_name = request_data["first_name"]
        app_user.last_name = request_data["last_name"]
        app_user.user_email = request_data["email_address"].lower()
        app_user.user_roles = (
            [AppUserRole.query.filter_by(id=group_row).first() for group_row in request_data["user_roles"]]
            if "user_roles" in request_data
            else []
        )
        if app_user.permissions:
            permissions = json.loads(app_user.permissions)
            permissions["responsibilities"] = request_data["responsibilities"]
            app_user.permissions = json.dumps(permissions)
        else:
            app_user.permissions = json.dumps({"responsibilities": request_data["responsibilities"]})

        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in updating app users"}, 422)
    finally:
        db.session.close()

    return json_response({"status": "success"})


@bp.route("/codex-product-api/app-admin/app-users/<int:app_user_id>", methods=["DELETE"])
@swag_from("./documentation/app_admin/app_admin_users/delete_app_user.yml")
@login_required
def delete_app_user(app_user_id):
    try:
        app_user = AppUser.query.filter_by(id=app_user_id).first()
        if app_user is None:
            return json_response({"error": "item not found"}, 404)
        if app_user.user_email == g.logged_in_email:
            return json_response({"error": "Deleting self account is not allowed."}, 400)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        app_user.deleted_at = func.now()
        db.session.query(app_user_role_identifier).filter_by(app_user_id=app_user_id).delete()
        db.session.commit()
        response = {"id": app_user.id}
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in deleting app users"}, 422)
    finally:
        db.session.close()

    return json_response(response)


@bp.route("/codex-product-api/app-admin/app-users/<int:app_id>", methods=["PUT"])
@swag_from("./documentation/app_admin/app_admin_users/update_app_user_responsibilities.yml")
@login_required
def update_app_user_responsibilities(app_id):
    """Update the app user responsibilities when the existing responsibilities get updated

    Args:
        app_id (int): id of the application for which app user responsibilities should be updated

    Returns:
        json: {'message': 'Successfully updated the responsibiltiies for app users}
    """
    try:
        request_data = get_clean_postdata(request)
        if request_data.get("deleted_responsibilities", False):
            deleted_responsibilities = request_data.get("deleted_responsibilities")
            app_users = AppUser.query.filter_by(app_id=app_id).all()
            for user in app_users:
                user_permissions = json.loads(user.permissions) if user.permissions else ""
                if user_permissions:
                    user_resp = user_permissions.get("responsibilities", [])
                    if user_resp:
                        updated_user_resp = list(set(user_resp) - set(deleted_responsibilities))
                        user_permissions["responsibilities"] = updated_user_resp
                        user.permissions = json.dumps(user_permissions)

            db.session.commit()
            return json_response({"message": "Successfully updated the responsibiltiies for app users"})
        else:
            return json_response({"error": "Error parsing request data"}, 422)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error updating the responsibilities for the app user"}, 500)
    finally:
        db.session.close()
