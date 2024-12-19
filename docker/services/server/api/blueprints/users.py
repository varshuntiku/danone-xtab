#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import datetime
import hashlib
import secrets
from datetime import datetime as dt
from pathlib import Path

from api.auth import authenticate
from api.blueprints.user_groups import list as user_group_list_fn
from api.connectors.product_db_helpers import apps_dbconn, apps_execute_query
from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.constants.variables import CustomException
from api.helpers import get_clean_postdata
from api.middlewares import login_required, rbac_required
from api.models import NacRoles, User, UserGroup, UserPasswordCode, db
from api.util.email_trigger import send_email_smtp
from api.util.multi_factor_auth import generate_totp, validate_timestamp, validate_totp
from api.util.token_util import decode_token, encode_payload
from bson import json_util
from flasgger.utils import swag_from
from flask import Blueprint
from flask import current_app as app
from flask import g, request
from sqlalchemy import and_, asc, desc
from sqlalchemy.sql import func

bp = Blueprint("Users", __name__)


@bp.route("/codex-api/users/list", methods=["PUT"])
@swag_from("./documentation/users/list.yml")
@login_required
# @rbac_required
def list():
    """Returns list of users in paginated format

    Returns:
        json: {list of users, current page, total number of pages, total user count, page size}
    """
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing request data"}, 422)

    try:
        users_list = User.query.filter_by(deleted_at=None)
        data_per_page = get_data_per_page(int(request_data["pageSize"]))

        if request_data.get("filtered", False):
            filter_data = []
            for filter_item in request_data.get("filtered"):
                if filter_item["value"]:
                    filter_data.append(User.__getattribute__(User, filter_item["id"]).ilike(filter_item["value"] + "%"))
            if len(filter_data):
                filter_query = tuple(filter_data)
                users_list = users_list.filter(and_(*filter_query))

        if request_data.get("sorted", False):
            for sort_item in request_data["sorted"]:
                if (
                    sort_item["id"] == "first_name"
                    or sort_item["id"] == "last_name"
                    or sort_item["id"] == "email_address"
                    or sort_item["id"] == "created_at"
                    or sort_item["id"] == "restricted_user"
                    or sort_item["id"] == "user_group"
                ):
                    if "desc" in sort_item and sort_item["desc"]:
                        users_list = users_list.order_by(desc(getattr(User, sort_item["id"])))
                    else:
                        users_list = users_list.order_by(asc(getattr(User, sort_item["id"])))
        else:
            users_list = users_list.order_by(desc(User.created_at))

        paginate_query = {
            "page": request_data["page"] + 1 if request_data.get("page") else None,
            "per_page": data_per_page,
        }

        users_list = users_list.paginate(
            error_out=False,
            page=paginate_query["page"],
            per_page=paginate_query["per_page"],
        )

        return json_response(
            {
                "data": [
                    {
                        "id": row.id,
                        "first_name": row.first_name,
                        "last_name": row.last_name,
                        "email_address": row.email_address,
                        "last_login": row.last_login.strftime("%d %B, %Y %H:%M") if row.last_login else "--",
                        "access_key": row.access_key,
                        "user_groups": [{"id": group_row.id, "name": group_row.name} for group_row in row.user_groups],
                        "nac_user_roles": [
                            {"id": group_row.id, "name": group_row.name} for group_row in row.nac_user_roles
                        ],
                        "user_groups_label": [group_row.name.upper() for group_row in row.user_groups],
                        "restricted_user": row.restricted_user,
                    }
                    for row in users_list.items
                ],
                "page": users_list.page - 1,
                "pages": users_list.pages,
                "count": users_list.total,
                "pageSize": len(users_list.items),
            }
        )

    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while fetching users"}, 400)


def get_data_per_page(data):
    if data:
        return data if data <= 100 else 100
    else:
        return 10


@bp.route("/codex-api/users/user-groups", methods=["GET"])
@login_required
# @rbac_required
def user_group_list():
    return user_group_list_fn()


@bp.route("/codex-api/users", methods=["POST"])
@swag_from("./documentation/users/create.yml")
@login_required
# @rbac_required
def create():
    try:
        request_data = get_clean_postdata(request)
        if 1 in request_data["user_groups"]:
            request_data["user_groups"].remove(1)
        user = User.query.filter_by(email_address=request_data["email_address"].lower()).first()

        user_group_app_publish = UserGroup.query.filter_by(deleted_at=None, app_publish=True).all()

        app_publish_group_id = [item.id for item in user_group_app_publish]

        request_user_groups = request_data["user_groups"] if "user_groups" in request_data else []
        is_nac_user = set(app_publish_group_id).intersection(request_user_groups)

        if is_nac_user:
            default_nac_role = request_data["nac_user_roles"] if request_data.get("nac_user_roles", False) else []
            # TODO: need to add a check if the app default user role is deleted
            if not len(default_nac_role):
                default_nac_role.append(NacRoles.query.filter_by(name="App Default User").first())
                request_data["nac_user_roles"] = [default_nac_role[0].id]

        if user is not None:
            return json_response({"error": "User already exists"}, 409)
        else:
            user = User(
                first_name=request_data["first_name"],
                last_name=request_data["last_name"],
                email_address=request_data["email_address"].lower(),
                created_by=g.user.id,
                access_key=True,
                user_groups=[group_row for group_row in request_data["user_groups"]]
                if "user_groups" in request_data
                else [],
                nac_user_roles=[group_row for group_row in request_data["nac_user_roles"]]
                if "nac_user_roles" in request_data and len(is_nac_user)
                else [],
                password=(
                    request_data["password"]
                    if ("password" in request_data and request_data["password"] and request_data["password"] != "")
                    else False
                ),
                restricted_user=request_data["restricted_user"]
                if "restricted_user" in request_data and request_data["restricted_user"] != ""
                else False,
            )
            db.session.add(user)
            db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error adding user"}, 422)

    return json_response({"id": user.id, "first_name": user.first_name})


@bp.route("/codex-api/users/update", methods=["POST"])
@login_required
# @rbac_required
def update_for_app():
    try:
        request_data = get_clean_postdata(request)

        user = User.query.filter_by(email_address=request_data["email_address"].lower()).first()

        if user is None:
            user = User(
                first_name=request_data["first_name"],
                last_name=request_data["last_name"],
                email_address=request_data["email_address"].lower(),
                created_by=g.user.id,
                access_key=True,
                user_groups=[group_row for group_row in request_data["user_groups"]]
                if "user_groups" in request_data
                else [],
                password=(
                    request_data["password"]
                    if ("password" in request_data and request_data["password"] and request_data["password"] != "")
                    else False
                ),
                restricted_user=request_data["restricted_user"]
                if "restricted_user" in request_data and request_data["restricted_user"] != ""
                else False,
            )
            db.session.add(user)
        else:
            if request_data.get("createNewUser", False):
                return json_response({"error": "User already exists"}, 409)
            else:
                user.first_name = request_data["first_name"]
                user.last_name = request_data["last_name"]
                user.email_address = request_data["email_address"].lower()
                user.updated_by = g.user.id

                if "password" in request_data and request_data["password"] and request_data["password"] != "":
                    user.password_hash = hashlib.pbkdf2_hmac(
                        "sha256",
                        request_data["password"].encode("utf-8"),
                        "codxauth".encode("utf-8"),
                        100000,
                        dklen=128,
                    )

        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error updating user"}, 422)

    return json_response({"id": user.id, "first_name": user.first_name})


# TODO add 500 exception


@bp.route("/codex-api/users/<int:user_id>", methods=["GET"])
@swag_from("./documentation/users/show.yml")
@login_required
# @rbac_required
def show(user_id):
    try:
        item = User.query.filter_by(id=user_id).first()
        return json_response(
            {
                "id": item.id,
                "first_name": item.first_name,
                "last_name": item.last_name,
                "email_address": item.email_address,
                "user_groups": [group_row.id for group_row in item.user_groups] if item.user_groups else [],
                "nac_user_roles": [group_row.id for group_row in item.nac_user_roles] if item.nac_user_roles else [],
                "restricted_user": item.restricted_user,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


@bp.route("/codex-api/users/<int:user_id>", methods=["PUT", "POST"])
@swag_from("./documentation/users/update.yml", methods=["PUT"])
@login_required
@rbac_required
def update(user_id):
    try:
        request_data = get_clean_postdata(request)
        user = User.query.filter_by(id=user_id).first()
        # print("User Email",user.email_address)
        if user is None:
            return json_response({"error": "item not found"}, 404)

        else:
            if request_data["email_address"] != user.email_address:
                existing_mail_check = User.query.filter_by(email_address=request_data["email_address"]).first()
                if existing_mail_check is not None:
                    return json_response(
                        {
                            "status": "error",
                            "message": "A user with the email {email} already exists".format(
                                email=request_data["email_address"]
                            ),
                        },
                        409,
                    )

            # TODO what if the email entered belongs to a deleted user.

            user.first_name = request_data["first_name"]
            user.last_name = request_data["last_name"]
            user.email_address = request_data["email_address"]

            user.user_groups = (
                [UserGroup.query.filter_by(id=group_row).first() for group_row in request_data["user_groups"]]
                if "user_groups" in request_data
                else []
            )

            user_group_app_publish = UserGroup.query.filter_by(deleted_at=None, app_publish=True).all()

            app_publish_group_id = [item.id for item in user_group_app_publish]

            request_user_groups = request_data["user_groups"] if "user_groups" in request_data else []
            is_nac_user = set(app_publish_group_id).intersection(request_user_groups)

            if is_nac_user:
                default_nac_role = request_data["nac_user_roles"] if request_data.get("nac_user_roles", False) else []
                # TODO: need to add a check if the app default user role is deleted
                if not len(default_nac_role):
                    default_nac_role.append(NacRoles.query.filter_by(name="App Default User").first())
                    request_data["nac_user_roles"] = [default_nac_role[0].id]

            user.nac_user_roles = (
                [NacRoles.query.filter_by(id=group_row).first() for group_row in request_data["nac_user_roles"]]
                if "nac_user_roles" in request_data and len(is_nac_user)
                else []
            )

            if "password" in request_data and request_data["password"] and request_data["password"] != "":
                user.password_hash = hashlib.pbkdf2_hmac(
                    "sha256",
                    request_data["password"].encode("utf-8"),
                    "codxauth".encode("utf-8"),
                    100000,
                    dklen=128,
                )

            user.restricted_user = (
                request_data["restricted_user"]
                if "restricted_user" in request_data and request_data["restricted_user"] != ""
                else False
            )
            user.updated_by = g.user.id
            db.session.commit()

            user = User.query.filter_by(id=user_id).first()
            return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error updating user"}, 500)


@bp.route("/codex-api/users/<int:user_id>", methods=["DELETE"])
@swag_from("./documentation/users/delete.yml")
@login_required
@rbac_required
def delete(user_id):
    try:
        user = User.query.filter_by(id=user_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Item not found"}, 404)

    try:
        user.deleted_at = func.now()
        user.deleted_by = g.user.id
        db.session.commit()
        try:
            app_conn_uri = app.config["APPS_DB_URI"]
            conn = apps_dbconn(app_conn_uri)
            apps_execute_query(
                conn,
                "UPDATE app_user SET deleted_at = %s WHERE user_email = %s and deleted_at IS NULL",
                (dt.now(), user.email_address),
            )
        except Exception as error_msg:
            ExceptionLogger(error_msg)

        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error deleting users"}, 500)


@bp.route("/codex-api/users-email", methods=["GET"])
# @swag_from("./documentation/users/list.yml")
# @login_required
# @rbac_required
def user_email():
    return json_response_count(
        # [{
        #     "first_name": row.first_name,
        #     "last_name": row.last_name,
        #     "email_address": row.email_address,
        # } for row in User.query.order_by(desc(User.created_at))],
        [row.email_address for row in User.query.order_by(desc(User.created_at))],
        200,
        User.query.count(),
    )


@bp.route("/codex-api/user/generate-code", methods=["POST"])
@swag_from("../documentation/users/generate_code.yml")
def generate_code():
    """Generate 6 digit OTP for user which will be valid for 5 mins and send it over email

    Args:

    Returns:
        JSON: ({"message": "Code generated successfully"}, 200,
        headers={"userId": id of the user})
    """
    try:
        request_data = get_clean_postdata(request)
        user_code = None
        if request_data.get("email"):
            user = User.query.filter_by(email_address=request_data.get("email")).first()
            if user:
                code_secret = hashlib.pbkdf2_hmac(
                    "sha256",
                    secrets.token_urlsafe(16).encode("utf-8"),
                    "codxauth".encode("utf-8"),
                    100000,
                    dklen=128,
                )
                user_password = UserPasswordCode.query.filter_by(user_id=user.id).first()
                # cur_day = None
                # last_update = None
                # created_on = None
                password_data = None
                if not user_password:
                    user_code = generate_totp(code_secret, 6)
                    code_hash = user_code.get("code_hash", False)
                    password_data = UserPasswordCode(
                        user_id=user.id,
                        user_email=user.email_address,
                        secret=code_hash.encode("utf-8"),
                        attempt=1,
                    )

                else:
                    is_gen_code = get_passcode_data(user_password, key="is_gen_code")
                    if is_gen_code:
                        user_code = generate_totp(code_secret, 6)
                    else:
                        return json_response(
                            {
                                "message": "Reached maximum attempts, please try again tomorrow.",
                                "attempt": 5,
                            },
                            400,
                        )

                if user_code.get("otp_code", False):
                    otp_code = user_code.get("otp_code")
                    code_hash = user_code.get("code_hash", False)
                    try:
                        generate_otp_mail(code=otp_code, user_data=user)
                    except CustomException as cex:
                        ExceptionLogger(cex)
                    if user_password is None:
                        db.session.add(password_data)
                    elif user_password:
                        code_attempt = get_passcode_data(user_password, key="code_attempt")
                        user_password.attempt = code_attempt
                        user_password.secret = code_hash.encode("utf-8")
                        if code_attempt == 1:
                            user_password.updated_at = func.now()
                        user_password.verify_attempt = 0

                    db.session.flush()
                    db.session.commit()
                    response = {"message": "Code generated successfully"}
                    headers = {
                        "userId": user.id,
                        "Access-Control-Expose-Headers": "userId",
                    }
                    return (json_util.dumps(response), 200, headers)
            else:
                return json_response({"message": "Invalid email address"}, 404)
        else:
            raise Exception("Require email address")
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while generating the code"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-api/user/validate-otp", methods=["POST"])
@swag_from("../documentation/users/validate_otp.yml")
def validate_otp():
    """Validate the OTP provided by the user and create a jwt token
    which will be valid for 5 mins allows user to authenticate themselves
    to change their password.

    Args:

    Returns:
        JSON: ({"message": "Successfully validated"}, 200,
        headers={"password_token": jwt token generated to change the password})
    """
    try:
        request_data = get_clean_postdata(request)
        user_id = request.headers.get("userId")
        user_secret = None
        if user_id and request_data.get("code", False):
            user = UserPasswordCode.query.filter_by(user_id=user_id).first()
            user_secret = user.secret
            if user_secret:
                is_otp_match = validate_totp(totp=request_data.get("code"), otp_hash=user_secret.decode("utf-8"))
                code_timestamp = user.updated_at if user.updated_at else user.created_at
                is_otp_valid = validate_timestamp(code_timestamp, duration=300, duration_in="seconds")
                if is_otp_match and is_otp_valid:
                    password_reset_token = get_password_token(user_id=user_id, user_email=user.user_email)
                    response = {"message": "Successfully validated"}
                    headers = {
                        "password_token": password_reset_token,
                        "Access-Control-Expose-Headers": "password_token",
                    }
                    return (json_util.dumps(response), 200, headers)
                else:
                    response_json = {"message": "Invalid code"}
                    if user.verify_attempt < 5:
                        user.verify_attempt = user.verify_attempt + 1
                        if user.verify_attempt == 5:
                            response_json = {
                                "message": "Too many failed attempts",
                                "attempt": 5,
                                "attemptsLeft": 5 - user.verify_attempt,
                            }
                        else:
                            response_json = {
                                "message": "Invalid code. Try Again",
                                "attemptsLeft": 5 - user.verify_attempt,
                            }
                        db.session.flush()
                        db.session.commit()
                    return json_response(response_json, 404)
        else:
            return json_response({"message": "Insufficient details to validate code"}, 400)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while validating the code"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-api/user/change-password", methods=["POST"])
@swag_from("../documentation/users/change_password.yml")
def change_password():
    """Change the password for provided email address

    Args:

    Returns:
        JSON: ({"message": "password updated successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        password_token = request.headers.get("password_token")
        email = get_user_data_from_token(password_token)
        if email == request_data.get("email"):
            user = User.query.filter_by(email_address=request_data.get("email")).first()
            if len(request_data["password"]) < 4 or len(request_data["confirm_password"]) < 4:
                return json_response({"message": "Password should have 4 or more characters"}, 400)
            elif user and request_data["password"] == request_data["confirm_password"]:
                user.password_hash = hashlib.pbkdf2_hmac(
                    "sha256",
                    request_data["password"].encode("utf-8"),
                    "codxauth".encode("utf-8"),
                    100000,
                    dklen=128,
                )
                db.session.flush()
                db.session.commit()
                return json_response({"message": "Password updated successfully"}, 200)
            else:
                response_msg = None
                if not user:
                    response_msg = "User does not exist"
                if request_data["password"] != request_data["confirm_password"]:
                    response_msg = "Password does not match"
                return json_response({"message": response_msg}, 404)
        else:
            return json_response({"message": "Insufficient details provided"}, 400)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while resetting the password"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-api/user/update-password", methods=["POST"])
@swag_from("./documentation/users/update_password.yml")
@login_required
def update_password():
    """Reset the password for the user

    Args:

    Returns:
        JSON: ({"message": "password updated successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        response_message = None
        if g.user.email_address:
            user = User.query.filter_by(email_address=g.user.email_address).first()
            if user:
                cur_password = authenticate(user, request_data["password"])
                password_compare = authenticate(user, request_data["new_password"])
                password_match = request_data["new_password"] == request_data["confirm_password"]
                if len(request_data["new_password"]) < 4 or len(request_data["confirm_password"]) < 4:
                    return json_response({"message": "Password should have 4 or more characters"}, 400)
                elif cur_password and not password_compare and password_match:
                    user.password_hash = hashlib.pbkdf2_hmac(
                        "sha256",
                        request_data["new_password"].encode("utf-8"),
                        "codxauth".encode("utf-8"),
                        100000,
                        dklen=128,
                    )
                    db.session.flush()
                    db.session.commit()
                    return json_response({"message": "Password updated successfully"}, 200)
                else:
                    if not cur_password:
                        response_message = "Current password does not match"
                    elif password_compare:
                        response_message = "Enter a password which has not been used previously"
                    elif not password_match:
                        response_message = "Password does not match"
                    return json_response({"message": response_message}, 500)
            else:
                return json_response({"message": "User does not exist"}, 404)
        else:
            return json_response({"message": "Insufficient details provided"}, 400)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while updating the password"}, 500)
    finally:
        db.session.close()


def get_password_token(user_id, user_email):
    payload = {
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=5),  # expiry time
        "iat": datetime.datetime.utcnow(),  # issued at
        "sub": "password_reset_token",  # subject
        "user_id": user_id,
        "user_email": user_email,
    }
    return encode_payload(payload)


def get_user_data_from_token(token):
    data = decode_token(token)
    user_id = data.get("user_id", False)
    user_email = data.get("user_email", False)
    sub = data.get("sub")

    # validating user details
    if sub == "password_reset_token":
        if user_id is not False and user_email is not False:
            if isinstance(user_id, str) and isinstance(user_email, str):
                return user_email
            else:
                raise TypeError("Type of user id or email is not correct")
        else:
            raise KeyError("User id or email is not present.")
    else:
        raise TypeError("Token subject mismatch.")


def generate_otp_mail(code, user_data):
    try:
        cover_photo_x1 = f"{app.config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/forgot_password_x1.png"
        # cover_photo_x15 = f"{app.config['AZURE_BLOB_ROOT_URL']}codex-data-static-assets/forgot_password_x1.5.png"

        html_path = Path(__file__).parent.parent / "email-templates/forgot-password.html"
        html_template = open(html_path)
        html = html_template.read().format(
            otp_code=code,
            cover_photo=cover_photo_x1,
            blob_url=app.config["AZURE_BLOB_ROOT_URL"],
        )
        html_template.close()
        plain_text_path = Path(__file__).parent.parent / "email-templates/forgot-password.txt"
        plain_text_template = open(plain_text_path)
        plain_text = plain_text_template.read().format(
            user_name=user_data.first_name + " " + user_data.last_name, otp_code=code
        )
        plain_text_template.close()
        mail_subject = "Reset Password"
        # mail_data = {
        #     "personalizations": [
        #         {"to": [{"email": user_data.email_address}], "subject": mail_subject}
        #     ],
        #     "from": {"email": "test@example.com"},
        #     "content": [
        #         {"type": "text/plain", "value": plain_text},
        #         {"type": "text/html", "value": html},
        #     ],
        # }
        try:
            send_email_smtp(
                email_type="forgot-password",
                To=[user_data.email_address],
                Subject=mail_subject,
                body={"plain": plain_text, "html": html},
            )
        except Exception as ex:
            ExceptionLogger(ex)
    except Exception as ex:
        ExceptionLogger(ex)
        raise CustomException("Could not share the otp")


def get_passcode_data(secret_data, key):
    try:
        cur_day = datetime.datetime.now().date()
        last_update = (
            datetime.datetime.fromtimestamp(secret_data.updated_at.timestamp()).date()
            if secret_data.updated_at
            else None
        )
        created_on = (
            datetime.datetime.fromtimestamp(secret_data.created_at.timestamp()).date()
            if secret_data.created_at
            else None
        )

        if key == "is_gen_code":
            if last_update is None and (cur_day > created_on or cur_day == created_on) and secret_data.attempt == 1:
                return True
            elif last_update and ((cur_day > last_update) or (cur_day == last_update and secret_data.attempt < 5)):
                return True
            else:
                return False
        elif key == "code_attempt":
            if secret_data and (
                (last_update is None and cur_day > created_on) or (last_update and cur_day > last_update)
            ):
                return 1
            elif secret_data and (
                (last_update is None and cur_day == created_on) or (last_update and cur_day == last_update)
            ):
                return secret_data.attempt + 1
    except Exception as ex:
        ExceptionLogger(ex)
        raise Exception(ex)
