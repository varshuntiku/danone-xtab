import re
import secrets
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from api.constants.functions import ExceptionLogger, json_response, sanitize_content
from api.db_models.user_management.users import NacRoles, User, UserGroup
from api.middlewares import login_required
from api.models import db
from flasgger.utils import swag_from

# from flask import current_app as app
from flask import Blueprint, json, request
from sqlalchemy import and_, asc, desc, or_

# from datetime import datetime as dt


bp = Blueprint("BulkUser", __name__)


@bp.route("/codex-product-api/bulk/lists/users", methods=["GET"])
@swag_from("./documentation/bulk_users/users.yml")
@login_required
def fetch_all_users():
    """Returns list of users in paginated format

    Returns:
        json: {list of users, current page, total number of pages, total user count, page size}
    """
    try:
        request_data = request.args
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing request data"}, 422)

    try:
        users_list = User.query.filter_by(deleted_at=None)
        data_per_page = get_data_per_page(int(request_data.get("pageSize", False)))

        user_type = request.args.get("user_type")
        if user_type == "inactive":
            six_months_ago = datetime.now() - timedelta(days=6 * 30)
            inactive_users_list = (
                users_list.filter(or_(User.last_login < six_months_ago, User.last_login.is_(None)))
                .order_by(User.id)
                .all()
            )
            return json_response(
                {
                    "data": [
                        {
                            "first_name": row.first_name,
                            "last_name": row.last_name,
                            "email_address": row.email_address,
                            "last_login": row.last_login,
                            "last_logout": row.last_logout,
                            "id": row.id,
                            "created_at": row.created_at,
                        }
                        for row in inactive_users_list
                    ]
                }
            )
        else:
            if request_data.get("filtered", False):
                filter_request = json.loads(request_data["filtered"])
                filter_data = []
                for filter_item in filter_request:
                    if filter_item["value"]:
                        filter_data.append(
                            User.__getattribute__(User, filter_item["id"]).ilike("%" + filter_item["value"] + "%")
                        )
                if len(filter_data):
                    filter_query = tuple(filter_data)
                    users_list = users_list.filter(and_(*filter_query))

            if request_data.get("sorted", False):
                sorting_data = json.loads(request_data["sorted"])
                for sort_item in sorting_data:
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
                "page": int(request_data["page"]) + 1 if request_data.get("page") else None,
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
                            "created_at": row.created_at.strftime("%d %B, %Y %H:%M") if row.created_at else "--",
                            "user_group": [group_row.name.upper() for group_row in row.user_groups],
                            "nac_user_roles": [group_row.name.upper() for group_row in row.nac_user_roles],
                            "restricted_user": "Yes" if row.restricted_user else "No",
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


@bp.route("/codex-product-api/bulk/users", methods=["POST"])
@swag_from("./documentation/bulk_users/bulk_users.yml")
@login_required
def upload_users_list():
    try:
        # revision reading csv file
        file = request.files["file"]
        file_name = file.filename
        file_extenstion = file_name.rsplit(".", 1)[1].lower()
        if file_extenstion == "xls":
            ingested_df = pd.read_excel(file)
            if ingested_df["nac_access"].isnull().values.any():
                ingested_df["nac_access"].fillna("", inplace=True)
        else:
            return json_response(
                {
                    "status": "error",
                    "message": sanitize_content(
                        ".{file_extenstion} file format is not accepted.Please upload .XLS file".format(
                            file_extenstion=file_extenstion
                        )
                    ),
                },
                400,
            )
        if ingested_df.isnull().values.any():
            return json_response(
                {"status": "error", "message": "Please remove empty values from file"},
                400,
            )
        boolean = ingested_df["email"].duplicated().any()
        if boolean:
            return json_response({"status": "error", "message": "Please remove duplicates in email"}, 400)

        deleted_users = db.session.execute(
            'select deleted_at ,first_name, last_name , email_address from "user" where deleted_at is not null'
        )
        deleted_users_list = [emails.email_address for emails in deleted_users]

        existing_users_email = User.query.with_entities(User.email_address).filter_by(deleted_at=None)
        existing_users_email_list = [emails.email_address for emails in existing_users_email]

        # get user groups
        user_groups_in_database = db.session.execute("select id, name from public.user_group where deleted_at is null")
        user_groups_in_database = [groups.name for groups in user_groups_in_database]

        existing_nac_roles = db.session.execute("select id, name from public.nac_roles where deleted_at is null")
        existing_nac_roles = [groups.name for groups in existing_nac_roles]

        # add new users and skip existing users

        users_added = []
        users_ignored = []
        user_access_reinstated = []
        for index, row in ingested_df.iterrows():
            user_first_name = row["first_name"]
            user_last_name = row["last_name"]
            user_email = row["email"].lower()
            restricted_user = row["restricted_user"]
            access_group_names = row["access"]
            nac_role_names = row["nac_access"]
            res = isinstance(restricted_user, str)
            restricted_access = row["14_days_default_window"]
            res_access = isinstance(restricted_access, str)
            if not res:
                return json_response(
                    {
                        "status": "error",
                        "message": "Restricted User column can only accept Yes/No",
                    },
                    400,
                )
            else:
                restricted_user = restricted_user.lower()

            if not res_access:
                return json_response(
                    {
                        "status": "error",
                        "message": "Restricted access column can only accept Yes/No",
                    },
                    400,
                )
            else:
                restricted_access = "true" if restricted_access.lower() == "yes" else "false"

            if not checkemail(user_email):
                return json_response(
                    {
                        "status": "error",
                        "message": "Enter Valid email : {e}".format(e=user_email),
                    },
                    400,
                )
                # TODO capture custom error

            user_group_app_publish = UserGroup.query.filter_by(deleted_at=None, app_publish=True).all()

            app_publish_group = [item.name.lower() for item in user_group_app_publish]

            request_user_groups = access_group_names.lower().split(",") if access_group_names else []
            is_nac_user = set(app_publish_group).intersection(request_user_groups)

            if user_email in deleted_users_list:
                # Access granted

                db.session.execute(f"update public.user set deleted_at = null where email_address = '{user_email}'")
                user_access_reinstated = user_access_reinstated.append(user_email)
                db.session.commit()

            elif user_email not in existing_users_email_list:
                domain = user_email.split("@")[1]
                if domain == "mathco.com":
                    restricted_useraccess = "true" if restricted_user == "yes" else "false"
                    db.session.execute(
                        f"INSERT INTO public.user (created_at, first_name, last_name, email_address, access_key, restricted_user,restricted_access) VALUES (NOW(), '{user_first_name}', '{user_last_name}', '{user_email}', '{genAccessKey()}', {restricted_useraccess},{restricted_access} )"
                    )

                    last_id_inserted = db.session.execute("SELECT LASTVAL()")
                    last_id_inserted = last_id_inserted.fetchone()[0]
                    db.session.commit()
                    get_access_ids(
                        access_group_names,
                        user_groups_in_database,
                        last_id_inserted,
                        type="platform",
                    )
                    if is_nac_user:
                        get_access_ids(
                            nac_role_names,
                            existing_nac_roles,
                            last_id_inserted,
                            type="nac",
                        )
                    users_added.append(user_email)

                else:
                    # add the users with restricted access.
                    db.session.execute(
                        f"INSERT INTO public.user (created_at, first_name, last_name, email_address, access_key, restricted_user,restricted_access) VALUES (NOW(), '{user_first_name}', '{user_last_name}', '{user_email}', '{genAccessKey()}', 'true',{restricted_access} )"
                    )
                    last_id_inserted = db.session.execute("SELECT LASTVAL()")
                    last_id_inserted = last_id_inserted.fetchone()[0]
                    db.session.commit()
                    get_access_ids(
                        access_group_names,
                        user_groups_in_database,
                        last_id_inserted,
                        type="platform",
                    )
                    if is_nac_user:
                        get_access_ids(
                            nac_role_names,
                            existing_nac_roles,
                            last_id_inserted,
                            type="nac",
                        )
                    users_added.append(user_email)
            else:
                users_ignored.append(user_email)
                # ignored user
        response = {
            "filename": file.filename,
            "users_added": len(np.unique(users_added)),
            "users_ignored": len(np.unique(users_ignored)),
            "user_access_reinstated": len(np.unique(user_access_reinstated)),
        }
        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in operation", "error_details": error_msg}, 400)


def get_access_ids(access, existing_groups, last_id_inserted, type=None):
    id_list = []
    access_list = access.lower().split(",")
    model_name = "nac_user_role_identifier" if type == "nac" else "user_group_identifier"
    model_column = "(nac_role_id, user_id)" if type == "nac" else "(user_group_id, user_id)"
    try:
        if type == "nac":
            for value in existing_groups:
                if value.lower() in access_list:
                    key = NacRoles.query.filter_by(name=value).first()
                    id_list.append(key.id)
        elif type == "platform":
            for value in existing_groups:
                if value.lower() in access_list:
                    key = UserGroup.query.filter_by(name=value).first()
                    id_list.append(key.id)
        else:
            raise Exception("type not defined")

        if len(id_list) == 0:
            id_to_insert = 4 if type == "nac" else 1
            db.session.execute(
                f"INSERT INTO {model_name} {model_column} VALUES ('{id_to_insert}', '{last_id_inserted}')"
            )
            # deafult-user : [1] user access is provided if the only input in access from sheet comes as a random string like "apple"
            # app-default-user : [4] nac role is provided if the only input in access from sheet comes as a random string like "apple"
            db.session.commit()

        else:
            for acc_id in id_list:
                db.session.execute(f"INSERT INTO {model_name} {model_column} VALUES ('{acc_id}', '{last_id_inserted}')")
                db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in operation"}, 400)


# bulk user creation functions and variables


def genAccessKey():
    return secrets.token_urlsafe(16)


def checkemail(email):
    regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
    if re.fullmatch(regex, email):
        return True

    else:
        return False
