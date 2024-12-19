from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.db_models.user_management.users import NacRolePermissions, NacRoles
from api.helpers import get_clean_postdata
from api.middlewares import login_required
from api.models import UserGroupType, db
from flasgger.utils import swag_from
from flask import Blueprint, g, request
from sqlalchemy import and_, desc
from sqlalchemy.sql import func

bp = Blueprint("NacUserRoles", __name__)

# TODO: Add swagger docs, api test cases and check whether middleware similar to rbac_required is needed for few apis


@bp.route("/codex-product-api/nac-role-permissions", methods=["GET"])
@swag_from("./documentation/nac_user_roles/permission_list.yml")
@login_required
def nac_permissions_list():
    """Returns list of permission along with its details

    Returns:
        JSON: list of permission name, id and created_by
    """
    try:
        permission_list = NacRolePermissions.query.filter_by(deleted_at=None).order_by(
            desc(NacRolePermissions.created_at)
        )
        return json_response_count(
            [
                {
                    "id": row.id,
                    "name": row.name.upper(),
                    "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                    if row.created_by
                    else "--",
                }
                for row in permission_list
            ],
            200,
            permission_list.count(),
        )
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"Error : ": "Error fetching nac roles"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/nac-user-roles", methods=["GET"])
@swag_from("./documentation/nac_user_roles/list.yml")
@login_required
def nac_roles_list():
    """Returns list of NAC role its associated permission along with other details

    Returns:
        JSON: list of NAC role and its details
    """
    try:
        role_list = NacRoles.query.filter_by(deleted_at=None).order_by(desc(NacRoles.created_at))
        return json_response_count(
            [
                {
                    "id": row.id,
                    "name": row.name,
                    "permissions": [group_row.name.upper() for group_row in row.role_permissions],
                    "user_role_type": UserGroupType.get_label(row.user_role_type),
                    "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                    if row.created_by
                    else "--",
                }
                for row in role_list
            ],
            200,
            role_list.count(),
        )
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"Error : ": "Error fetching nac roles"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/nac-user-roles", methods=["POST"])
@swag_from("./documentation/nac_user_roles/create.yml")
@login_required
# @rbac_required
def create_nac_role():
    """Creates and add new NAC role

    Returns:
        JSON: id and name of newly created NAC role
    """
    try:
        request_data = get_clean_postdata(request)
        is_existing_role = NacRoles.query.filter_by(deleted_at=None, name=request_data["name"]).first()
        if is_existing_role:
            return json_response({"error": "Role already exists"}, 400)
        else:
            nac_role = NacRoles(
                name=request_data["name"],
                role_permissions=[group_row for group_row in request_data["role_permissions"]]
                if "role_permissions" in request_data
                else [],
                user_role_type=UserGroupType.USER_CREATED.value,
                created_by=g.user.id,
            )
            db.session.add(nac_role)
            db.session.commit()
            return json_response({"message": "Success", "id": nac_role.id, "name": nac_role.name})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error : ": "Error creating user role"}, 422)
    finally:
        db.session.close()


@bp.route("/codex-product-api/nac-user-roles/<int:nac_user_role_id>", methods=["GET"])
@swag_from("./documentation/nac_user_roles/show.yml")
@login_required
# @rbac_required
def show_nac_role(nac_user_role_id):
    """Returns NAC role details for the given nac_role_id

    Args:
        nac_user_role_id (int): id of nac role

    Returns:
        JSON: information about the nac role
    """
    try:
        item = NacRoles.query.filter_by(deleted_at=None, id=nac_user_role_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "permissions": [group_row.name.upper() for group_row in item.role_permissions],
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Item not found"}, 404)
    finally:
        db.session.close()


# # TODO add 404 422/401 etc exceptions
@bp.route("/codex-product-api/nac-user-roles/<int:nac_role_id>", methods=["PUT", "POST"])
@swag_from("./documentation/nac_user_roles/update.yml", methods=["PUT"])
@login_required
# @rbac_required
def update_nac_role(nac_role_id):
    """Update the NAC role data for the provided nac_role_id
    Args:
        nac_role_id (int): id of NAC role

    Returns:
        JSON: Success message and response status
    """
    try:
        nac_role = NacRoles.query.filter_by(deleted_at=None, id=nac_role_id).first()
        if nac_role is None:
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
        is_existing_role = NacRoles.query.filter(
            and_(
                NacRoles.deleted_at.is_(None),
                NacRoles.name == request_data["name"],
                NacRoles.id != nac_role_id,
            )
        ).first()
        if is_existing_role:
            return json_response({"error": "Role already exists"}, 400)
        else:
            nac_role.name = request_data["name"]
            nac_role.role_permissions = (
                [NacRolePermissions.query.filter_by(id=group_row).first() for group_row in request_data["permissions"]]
                if "permissions" in request_data
                else []
            )

            nac_role.updated_by = g.user.id
            db.session.commit()
            return json_response({"message": "Updated successfully"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error updating user role"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/nac-user-roles/<int:nac_role_id>", methods=["DELETE"])
@swag_from("./documentation/nac_user_roles/delete.yml")
@login_required
# @rbac_required
def delete_nac_role_delete(nac_role_id):
    """Deletes the NAC role for given nac_role_id

    Args:
        nac_role_id (int): id of nac role

    Returns:
        JSON: response success/error message
    """
    try:
        nac_role = NacRoles.query.filter_by(deleted_at=None, id=nac_role_id).first()
        if nac_role is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        if len(nac_role.users):
            db.session.execute(f"delete from public.nac_user_role_identifier where nac_role_id={nac_role_id}")
            db.session.execute(f"delete from public.nac_role_permissions_identifier where nac_role_id={nac_role_id}")

        nac_role.deleted_at = func.now()
        nac_role.deleted_by = g.user.id
        db.session.commit()
        return json_response({"message": "Deleted Successfully"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error deleting user role"}, 500)
    finally:
        db.session.close()
