#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import urllib

from api.constants.functions import ExceptionLogger, json_response, sanitize_content
from api.constants.variables import CustomException
from api.helpers import get_blob, get_clean_postdata
from api.middlewares import login_required, platform_user_info_required
from api.models import (
    App,
    AppScreen,
    AppUser,
    ContainerMapping,
    Dashboard,
    DashboardTemplates,
    Functions,
    Industry,
    db,
)
from flasgger.utils import swag_from
from flask import Blueprint, g, json, request
from sqlalchemy import and_, asc, or_
from sqlalchemy.sql import func

bp = Blueprint("Dashboard", __name__)
exception_message = "Error While fetching Information"


@bp.route("/codex-product-api/industry", methods=["GET"])
@swag_from("./documentation/dashboard/get_industries_list.yml")
@login_required
def get_industries_list():
    entities = (
        Industry.query.filter_by(deleted_at=None).order_by(asc(Industry.order), asc(Industry.industry_name)).all()
    )
    all_industries = {resp.id: resp.industry_name for resp in entities}
    response = [parse_industry(row) for row in entities]
    for resp in response:
        resp["parent_industry_name"] = (
            all_industries.get(resp.get("parent_industry_id")) if resp.get("parent_industry_id") else None
        )
    return json_response(response)


# TODO add try catch and other exceptions like 422


@bp.route("/codex-product-api/industry", methods=["POST"])
@swag_from("./documentation/dashboard/create_industry.yml")
@login_required
def create_industry():
    entities = [
        parse_industry(row)
        for row in Industry.query.filter_by(deleted_at=None)
        .order_by(asc(Industry.order), asc(Industry.industry_name))
        .all()
    ]
    orders = [row["order"] for row in entities]
    try:
        # getting the data from request json
        request_data = get_clean_postdata(request)
        is_existing_industry = Industry.query.filter_by(
            deleted_at=None, industry_name=request_data["industry_name"]
        ).first()
        if is_existing_industry:
            return json_response({"error": "Industry already exists"}, 400)
        else:
            # creting the industry
            if request_data["order"] == 0:
                request_data["order"] = max(orders) + 1
            parent_industry_id = (
                None if request_data.get("parent_industry_id") == "" else request_data.get("parent_industry_id")
            )
            level = request_data.get("level").lower() if request_data.get("level") is not None else None
            new_industry = Industry(
                request_data["industry_name"],
                request_data["logo_name"],
                request_data["horizon"],
                request_data["order"],
                request_data.get("description", None),
                parent_industry_id,
                request_data.get("color", None),
                level,
            )
            db.session.add(new_industry)
            db.session.flush()
            db.session.commit()
            industry_data = {
                "id": new_industry.id,
                "industry_name": new_industry.industry_name,
                "logo_name": new_industry.logo_name,
                "horizon": new_industry.horizon,
                "order": new_industry.order,
                "description": new_industry.description,
                "parent_industry_id": new_industry.parent_industry_id,
                "color": new_industry.color,
                "level": new_industry.level,
            }
            return json_response(
                {
                    "message": "Industry Created Successfully",
                    "industry_data": industry_data,
                },
                200,
            )

    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while creating Industry"}, 500)
    # TODO add exception 500
    finally:
        db.session.close()


@bp.route("/codex-product-api/industry/<int:industry_id>", methods=["PUT"])
@swag_from("./documentation/dashboard/update_industry.yml")
@login_required
def update_industry(industry_id):
    try:
        request_data = request.get_json()
        is_existing_industry = Industry.query.filter(
            and_(
                Industry.deleted_at.is_(None),
                Industry.industry_name == request_data["industry_name"],
                Industry.id != industry_id,
            )
        ).first()
        if is_existing_industry:
            return json_response({"error": "Industry already exists"}, 400)
        else:
            # fetching data from db
            industry = Industry.query.filter_by(id=industry_id, deleted_at=None).first()

            industry.description = request_data.get("description", None)
            industry.industry_name = request_data["industry_name"]
            industry.logo_name = request_data["logo_name"]
            industry.horizon = request_data["horizon"]
            industry.parent_industry_id = (
                request_data.get("parent_industry_id") if request_data.get("parent_industry_id") else None
            )
            industry.order = request_data["order"]
            industry.level = request_data["level"].lower() if request_data["level"] else None
            industry.color = request_data["color"]
            industry.updated_at = func.now()

            db.session.commit()
            industry_data = {
                "id": industry.id,
                "industry_name": industry.industry_name,
                "logo_name": industry.logo_name,
                "horizon": industry.horizon,
                "order": industry.order,
                "description": industry.description,
                "parent_industry_id": industry.parent_industry_id,
                "color": industry.color,
                "level": industry.level,
            }
            return json_response(
                {"message": " updated successfully", "industry_data": industry_data},
                200,
            )

    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while updating industry"}, 500)
    finally:
        db.session.close()


# TODO item not found 404 exception


@bp.route("/codex-product-api/industry/<int:industry_id>", methods=["DELETE"])
@swag_from("./documentation/dashboard/delete_industry.yml")
@login_required
def delete_industry(industry_id):
    try:
        # fetching data from db
        industry = Industry.query.filter_by(id=industry_id).first()
        industry.deleted_at = func.now()
        db.session.commit()

        return json_response({"message": " deleted successfully"}, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while deleting industry"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/function", methods=["GET"], defaults={"industry_id": None})
@bp.route("/codex-product-api/industry/<int:industry_id>/function", methods=["GET"])
@swag_from("./documentation/dashboard/get_functions_list.yml")
@login_required
def get_functions_list(industry_id):
    """Returns list of all functions or industry specific functions

    Args:
        industry_id (int): id of Industry
    Returns:
        json: {list of functions and its details}
    """

    filter_keys = [Functions.deleted_at.is_(None)]
    if industry_id:
        filter_keys.append(Functions.industry_id == industry_id)
    functions = (
        Functions.query.filter(and_(*filter_keys)).order_by(asc(Functions.order), asc(Functions.function_name)).all()
    )
    all_functions = {resp.id: resp.function_name for resp in functions}
    industries_id = [row[0] for row in Industry.query.filter_by(deleted_at=None).with_entities(Industry.id).all()]
    functions_list = [parse_function(row) for row in functions]
    for function in functions_list:
        function["parent_function_name"] = (
            all_functions.get(function.get("parent_function_id")) if function.get("parent_function_id") else None
        )
        if function["industry_id"] not in industries_id:
            function["industry_name"] = ""
            function["industry_id"] = ""
    return json_response(sanitize_content(functions_list))


@bp.route("/codex-product-api/function", methods=["POST"])
@swag_from("./documentation/dashboard/create_function.yml")
@login_required
def create_function():
    entities = [
        parse_function(row)
        for row in Functions.query.filter_by(deleted_at=None)
        .order_by(asc(Functions.order), asc(Functions.function_name))
        .all()
    ]
    orders = [row["order"] for row in entities]
    try:
        # getting the data from request json
        request_data = get_clean_postdata(request)
        if request_data["order"] == 0:
            request_data["order"] = max(orders) + 1
        parent_function_id = (
            None if request_data.get("parent_function_id") == "" else request_data.get("parent_function_id")
        )
        level = request_data.get("level").lower() if request_data.get("level") is not None else None
        # creating the industry
        new_function = Functions(
            request_data["industry_id"],
            request_data["function_name"],
            request_data["description"],
            request_data["logo_name"],
            request_data["order"],
            parent_function_id,
            request_data.get("color", None),
            level,
        )
        db.session.add(new_function)
        db.session.flush()
        db.session.commit()
        function_data = {
            "id": new_function.id,
            "industry_id": new_function.industry_id,
            "function_name": new_function.function_name,
            "description": new_function.description,
            "logo_name": new_function.logo_name,
            "order": new_function.order,
            "parent_function_id": new_function.parent_function_id,
            "color": new_function.color,
            "level": new_function.level,
        }
        return json_response(
            {
                "message": "Function Created Successfully",
                "function_data": function_data,
            },
            200,
        )

    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while creating new function"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/function/<int:function_id>", methods=["PUT"])
@swag_from("./documentation/dashboard/update_function.yml")
@login_required
def update_function(function_id):
    try:
        request_data = request.get_json()

        # fetching data from db
        _function = Functions.query.filter_by(id=function_id, deleted_at=None).first()

        _function.industry_id = request_data["industry_id"]
        _function.function_name = request_data["function_name"]
        _function.description = request_data["description"]
        _function.logo_name = request_data["logo_name"]
        _function.order = request_data["order"]
        _function.level = request_data["level"].lower() if request_data["level"] else None
        _function.color = request_data["color"]
        _function.parent_function_id = (
            request_data.get("parent_function_id") if request_data.get("parent_function_id") else None
        )
        _function.updated_at = func.now()

        db.session.commit()
        function_data = {
            "id": _function.id,
            "industry_id": _function.industry_id,
            "function_name": _function.function_name,
            "description": _function.description,
            "logo_name": _function.logo_name,
            "order": _function.order,
            "parent_function_id": _function.parent_function_id,
            "color": _function.color,
            "level": _function.level,
        }
        return json_response({"message": " updated successfully", "function_data": function_data}, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while updating function"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/function/<int:function_id>", methods=["DELETE"])
@swag_from("./documentation/dashboard/delete_function.yml")
@login_required
def delete_function(function_id):
    try:
        # fetching data from db
        _function = Functions.query.filter_by(id=function_id).first()
        _function.deleted_at = func.now()
        db.session.commit()

        return json_response({"message": " deleted successfully"}, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while deleting function"}, 500)
    finally:
        db.session.close()


# TODO can string:industry_name be replaced by integer:industry_id?
@bp.route("/codex-product-api/industry/<string:industry>/apps", methods=["GET"])
@swag_from("./documentation/dashboard/get_apps.yml")
@login_required
@platform_user_info_required
def get_apps(industry):
    try:
        industry = urllib.parse.unquote(industry)
        industry = "" if industry == "false" else industry

        # read industry_id directly from input once we replace industry name with industry id
        industry_details = Industry.query.filter_by(industry_name=industry).first()

        container_ids = [
            container_mapping.container_id
            for container_mapping in ContainerMapping.query.filter_by(industry_id=industry_details.id).all()
        ]
        apps = App.query.filter(App.container_id.in_(container_ids)).order_by(asc(App.orderby), asc(App.name)).all()

        user_app_ids = [app.app_id for app in AppUser.query.filter(AppUser.user_email == g.logged_in_email).all()]

        response = []
        for app in apps:
            app.industry = app.industry_names()
            app.function = app.function_names()

            app_access = False
            if g.platform_user.get("is_restricted_user", False):
                app_access = (
                    (app.id in user_app_ids) if json.loads(app.modules or "{}").get("user_mgmt", False) else True
                )
            else:
                app_access = True

            if app_access:
                response.append(parse_app(app))

        return json_response(sanitize_content(response))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": error_msg}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/applications", methods=["GET"])
@swag_from("./documentation/dashboard/get_all_apps.yml")
@login_required
def get_all_apps():
    try:
        request_data = None
        if request.args:
            request_data = request.args
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing request data"}, 422)

    try:
        app_list = App.query.filter_by(deleted_at=None).order_by(asc(App.name))
        if request_data:
            data_per_page = get_data_per_page(int(request_data.get("pageSize", False)))
            if request_data.get("filtered", False):
                filter_request = json.loads(request_data["filtered"])
                filter_data = []
                if len(filter_request):
                    if filter_request["value"] and filter_request["id"]:
                        filter_data.append(
                            App.__getattribute__(App, filter_request["id"]).ilike("%" + filter_request["value"] + "%")
                        )
                if len(filter_data):
                    filter_query = tuple(filter_data)
                    app_list = app_list.filter(and_(*filter_query))

            paginate_query = {
                "page": int(request_data["page"]) + 1 if request_data.get("page", False) else None,
                "per_page": data_per_page,
            }
            app_list = app_list.paginate(
                error_out=False,
                page=paginate_query["page"],
                per_page=paginate_query["per_page"],
            )
        else:
            app_list = app_list.all()
        apps_data = []
        app_items = app_list.items if request_data else app_list
        for row in app_items:
            container_mapping_details = row.container_mapping_details()
            industry = row.industry_names()
            function_str = row.function_names()
            apps_data.append(
                {
                    "id": row.id,
                    "name": row.name,
                    "description": row.description if row.description else False,
                    "industry": industry,
                    "function": function_str if industry else False,
                    "config_link": row.config_link if row.config_link else False,
                    "blueprint_link": row.blueprint_link if row.blueprint_link else False,
                    "orderby": row.orderby if (row.orderby or row.orderby == 0) and isinstance(row.orderby, int) else 0,
                    "logo_url": row.logo_blob_name if row.logo_blob_name else False,
                    "small_logo_url": row.small_logo_blob_name if row.small_logo_blob_name else False,
                    "environment": row.environment,
                    # Note: Sharing single industry/function ids assuming user can have single mapping per app as part of this version
                    "industry_id": container_mapping_details[0].industry_id if len(container_mapping_details) else None,
                    "function_id": container_mapping_details[0].function_id if len(container_mapping_details) else None,
                    "nac_collaboration": json.loads(row.modules).get("nac_collaboration", False)
                    if row.modules
                    else False,
                    "is_connected_systems_app": row.is_connected_systems_app if row.is_connected_systems_app else False,
                }
            )
        response = {"data": apps_data}
        if request_data:
            response["page"] = app_list.page - 1
            response["pages"] = app_list.pages
            response["count"] = app_list.total
            response["pageSize"] = len(app_list.items)
            response["hasNext"] = app_list.has_next
        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": exception_message}, 500)


@bp.route("/codex-product-api/user-apps-hierarchy", methods=["GET"])
@swag_from("./documentation/dashboard/get_user_apps_hierarchy.yml")
@login_required
def get_user_apps_hierarchy():
    try:
        app_list = (
            db.session.query(AppUser, App)
            .filter(
                and_(
                    AppUser.user_email == g.logged_in_email,
                    AppUser.app_id == App.id,
                    AppUser.deleted_at.is_(None),
                )
            )
            .all()
        )

        for row in app_list:
            row.App.industry = row.App.industry_names()
            row.App.function = row.App.function_names()

        apps = [parse_app(row.App) for row in app_list]
        container_ids = [app["container_id"] for app in apps]
        container_mappings = ContainerMapping.query.filter(ContainerMapping.container_id.in_(container_ids)).all()

        industry_ids = list(set([container_mapping.industry_id for container_mapping in container_mappings]))
        function_ids = list(set([container_mapping.function_id for container_mapping in container_mappings]))

        industries = [parse_industry(row) for row in Industry.query.filter(Industry.id.in_(industry_ids)).all()]
        functions = [parse_function(row) for row in Functions.query.filter(Functions.id.in_(function_ids)).all()]

        industry_fun = [
            (container_mapping.industry_id, container_mapping.function_id) for container_mapping in container_mappings
        ]

        functions = [row for row in functions if (row["industry_id"], row["function_id"]) in industry_fun]

        response = {"apps": apps, "industries": industries, "functions": functions}

        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": exception_message}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/dashboard/<int:dashboard_id>", methods=["GET"])
@swag_from("./documentation/dashboard/get_dashboard_hierarchy.yml")
@login_required
def get_dashboard_hierarchy(dashboard_id):
    try:
        dashboard = Dashboard.query.filter_by(id=dashboard_id).first()
        root_id = 0
        if dashboard:
            root_id = dashboard.root_industry_id
        else:
            raise CustomException("Dashboard Not Found", 404)
        # root = Industry.query.filter_by(id=root_id).all()
        node_counter = 1

        def get_formatted_nodes(data, type, nodes):
            def formatter(dict):
                nonlocal node_counter
                formatted_dict = {
                    "id": dict.id,
                    "node_id": node_counter,
                    "type": type,
                    "color": dict.color,
                    "description": dict.description,
                }
                node_counter += 1
                if type == "industry":
                    formatted_dict["label"] = dict.industry_name
                    formatted_dict["parent_industry_id"] = dict.parent_industry_id
                    formatted_dict["logo_name"] = dict.logo_name
                else:
                    formatted_dict["label"] = dict.function_name
                    formatted_dict["parent_industry_id"] = dict.industry_id
                    formatted_dict["parent_function_id"] = dict.parent_function_id
                    formatted_dict["logo_name"] = dict.logo_name

                if type != "application":
                    formatted_dict["level"] = dict.level
                return formatted_dict

            data_nodes = [formatter(obj) for obj in data]
            nodes.extend(data_nodes)
            return

        nodes = []
        industries = get_all_industries(root_id)
        functions = get_all_functions(industries)
        # for formatting nodes
        get_formatted_nodes(industries, "industry", nodes)
        get_formatted_nodes(functions, "function", nodes)
        # for formatting and also querying applications
        get_all_applications(industries, functions, nodes, node_counter, app_environments=["prod"])
        response = {"result": nodes}
        return json_response(response)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Dashboard Not found"}, 404)


def get_all_industries(root_id):
    topq = Industry.query.filter_by(id=root_id)
    topq = topq.cte("cte", recursive=True)
    bottomq = Industry.query.join(topq, Industry.parent_industry_id == topq.c.id)
    recursive_q = topq.union(bottomq)
    industries = db.session.query(recursive_q).all()
    return industries


def get_all_functions(industries):
    industry_ids = []
    for ind in industries:
        industry_ids.append(ind.id)
    topq = Functions.query.filter(Functions.industry_id.in_(industry_ids), Functions.parent_function_id.is_(None))
    topq = topq.cte("cte", recursive=True)
    bottomq = Functions.query.join(topq, Functions.parent_function_id == topq.c.id)
    recursive_q = topq.union(bottomq)
    functions = db.session.query(recursive_q).all()
    return functions


def get_all_applications(industries, functions, nodes, node_counter, app_environments=[]):
    industry_ids = []
    for ind in industries:
        industry_ids.append(ind.id)
    function_ids = []
    for fun in functions:
        function_ids.append(fun.id)

    query_result = (
        ContainerMapping.query.filter(
            or_(
                ContainerMapping.function_id.in_(function_ids),
                ContainerMapping.industry_id.in_(industry_ids),
            )
        )
        .join(
            App,
            and_(
                App.container_id == ContainerMapping.container_id,
                App.environment.in_(app_environments) if len(app_environments) else True,
            ),
        )
        .add_columns(
            App.id,
            App.name,
            ContainerMapping.industry_id,
            ContainerMapping.function_id,
            App.color,
            App.description,
        )
        .filter_by(deleted_at=None)
        .all()
    )
    applications = []
    for app in query_result:
        applications.append(
            {
                "id": app[1],
                "node_id": node_counter,
                "type": "application",
                "label": app[2],
                "parent_industry_id": app[3],
                "parent_function_id": app[4],
                "color": app[5],
                "description": app[6],
                "level": "application",
            }
        )
        node_counter += 1
    nodes.extend(applications)


def parse_industry(industry):
    return {
        "id": industry.id,
        "industry_name": industry.industry_name,
        "parent_industry_id": industry.parent_industry_id,
        "logo_name": industry.logo_name,
        "horizon": industry.horizon,
        "order": industry.order,
        "level": industry.level,
        "color": industry.color,
        "description": industry.description,
    }


def parse_function(function):
    return {
        "industry_name": function.industry.industry_name,
        "industry_id": function.industry_id,
        "function_id": function.id,
        "parent_function_id": function.parent_function_id,
        "function_name": function.function_name,
        "description": function.description,
        "logo_name": function.logo_name,
        "order": function.order,
        "level": function.level,
        "color": function.color,
    }


def parse_app(app):
    return {
        "id": app.id,
        "name": app.name,
        "environment": app.environment,
        "source_app_id": app.source_app_id,
        "contact_email": app.contact_email,
        "industry": app.industry if (app.industry and app.industry != "false") else False,
        "function": app.function if (app.function and app.function != "false") else False,
        "problem_area": app.problem_area if app.problem_area else False,
        "problem": app.problem if app.problem else False,
        "config_link": app.config_link if app.config_link else False,
        "blueprint_link": app.blueprint_link if app.blueprint_link else False,
        "description": app.description if app.description else False,
        "orderby": app.orderby if app.orderby else False,
        "app_link": True if app.modules else False,
        "approach_url": get_blob(app.approach_blob_name) if app.approach_blob_name else False,
        "data_story_enabled": json.loads(app.modules).get("data_story", False) if app.modules else False,
        "container_id": app.container_id,
    }


@bp.route("/codex-product-api/dashboard", methods=["POST"])
@swag_from("./documentation/dashboard/create_dashboard.yml")
@login_required
def create_dashboard():
    try:
        request_data = get_clean_postdata(request)
        new_dashboard = Dashboard(
            dashboard_name=request_data.get("name", None),
            dashboard_icon=request_data.get("icon", None),
            dashboard_order=request_data.get("order", None),
            root_industry_id=request_data.get("root", None),
            dashboard_url=request_data.get("url", None),
            dashboard_template_id=request_data.get("template", None),
        )
        db.session.add(new_dashboard)
        db.session.commit()
        dashboard = {
            "dashboard_id": new_dashboard.id,
            "dashboard_name": new_dashboard.dashboard_name,
            "dashboard_icon": new_dashboard.dashboard_icon,
            "dashboard_order": new_dashboard.dashboard_order,
            "root_industry_id": new_dashboard.root_industry_id,
            "dashboard_url": new_dashboard.dashboard_url,
            "dashboard_template_id": new_dashboard.dashboard_template_id,
        }
        return json_response({"status": "success", "dashboard_data": dashboard})
    except Exception as error_msg:
        db.session.rollback()
        ExceptionLogger(error_msg)
        return json_response({"error": "error while creating dashboard"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/dashboard/<int:dashboard_id>", methods=["PUT"])
@login_required
def update_dashboard(dashboard_id):
    try:
        request_data = get_clean_postdata(request)

        dashboard = Dashboard.query.filter_by(id=dashboard_id, deleted_at=None).first()

        dashboard.dashboard_name = request_data.get("name", None)
        dashboard.dashboard_icon = request_data.get("icon", None)
        dashboard.dashboard_order = request_data.get("order", None)
        dashboard.root_industry_id = request_data.get("root", None)
        dashboard.dashboard_url = (request_data.get("url", None),)
        dashboard.dashboard_template_id = request_data.get("template", None)

        db.session.commit()
        return json_response({"message": "dashboard updated successfully"}, 200)
    except Exception as error_msg:
        db.session.rollback()
        ExceptionLogger(error_msg)
        return json_response({"error": "error while updating dashboard"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/dashboard/<int:dashboard_id>", methods=["DELETE"])
@login_required
def delete_dashboard(dashboard_id):
    try:
        dashboard = Dashboard.query.filter_by(id=dashboard_id).first()
        dashboard.deleted_at = func.now()
        db.session.commit()

        return json_response({"message": "dashboard deleted successfully"}, 200)
    except Exception as err_msg:
        db.session.rollback()
        ExceptionLogger(err_msg)
        return json_response({"error": "error while deleting dashboard"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/dashboards", methods=["GET"])
@login_required
def get_dashboards_list():
    try:
        dashboards = (
            Dashboard.query.filter_by(deleted_at=None)
            .order_by(asc(Dashboard.dashboard_order), asc(Dashboard.dashboard_name))
            .all()
        )
        dashboards_list = [parse_dashboard(row) for row in dashboards]

        return json_response(dashboards_list)
    except Exception as err_msg:
        ExceptionLogger(err_msg)
        return json_response({"error": "error while fetching list of dashboards"}, 500)
    finally:
        db.session.close()


def parse_dashboard(dashboard, dashboard_template=None):
    dashboard_details = {
        "id": dashboard.id,
        "name": dashboard.dashboard_name,
        "icon": dashboard.dashboard_icon,
        "order": dashboard.dashboard_order,
        "root": dashboard.root_industry_id,
        "url": dashboard.dashboard_url,
        "template": dashboard.dashboard_template_id,
        "code": dashboard.dashboard_code,
        "conn_system_dashboard_id": dashboard.conn_system_dashboard_id,
    }
    if dashboard_template:
        dashboard_details["template"] = {
            "id": dashboard_template.id,
            "name": dashboard_template.name,
        }
    return dashboard_details


@bp.route("/codex-product-api/dashboard-templates", methods=["GET"])
@login_required
def get_dashboard_templates_list():
    try:
        dashboard_templates = (
            DashboardTemplates.query.filter_by(deleted_at=None).order_by(asc(DashboardTemplates.name)).all()
        )
        dashboard_templates_list = [parse_dashboard_template(row) for row in dashboard_templates]

        return json_response(dashboard_templates_list)
    except Exception as err_msg:
        db.session.rollback()
        ExceptionLogger(err_msg)
        return json_response({"error": "error while fetching list of dashboard templates"}, 500)
    finally:
        db.session.close()


def parse_dashboard_template(dashboard_template):
    return {
        "id": dashboard_template.id,
        "name": dashboard_template.name,
        "description": dashboard_template.description,
    }


@bp.route("/codex-product-api/industry/<int:industry_id>/dashboard", methods=["GET"])
@login_required
def get_dashboard_by_industry_id(industry_id):
    try:
        dashboard = Dashboard.query.filter_by(root_industry_id=industry_id, deleted_at=None).first()
        if dashboard:
            return json_response(parse_dashboard(dashboard))
        return json_response({"message": "Dashboard doesn't exist for the given industry id"}, 200)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "error while fetching dashboard for the given industry id"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/get-dashboard-details", methods=["GET"])
@login_required
def get_dashboard_details():
    try:
        dashboard_id = request.args.get("dashboard_id", None)
        dashboard_url = request.args.get("dashboard_url", None)
        if dashboard_id:
            dashboard_with_templates = (
                db.session.query(Dashboard, DashboardTemplates)
                .filter(
                    and_(
                        Dashboard.dashboard_template_id == DashboardTemplates.id,
                        Dashboard.id == dashboard_id,
                        Dashboard.deleted_at.is_(None),
                    )
                )
                .first()
            )
        elif dashboard_url:
            dashboard_with_templates = (
                db.session.query(Dashboard, DashboardTemplates)
                .filter(
                    and_(
                        Dashboard.dashboard_template_id == DashboardTemplates.id,
                        Dashboard.dashboard_url == dashboard_url,
                        Dashboard.deleted_at.is_(None),
                    )
                )
                .first()
            )
        if dashboard_with_templates:
            return json_response(parse_dashboard(dashboard_with_templates[0], dashboard_with_templates[1]))
        return json_response({"message": "Dashboard doesn't exist"}, 200)
    except Exception as err_msg:
        ExceptionLogger(err_msg)
        return json_response({"error": "error while fetching the dashboard"}, 500)
    finally:
        db.session.close()


def get_data_per_page(data):
    if data:
        return data if data <= 100 else 100
    else:
        return 10


@bp.route("/codex-product-api/get-applications-screens/<int:function_Id>", methods=["GET"])
@login_required
def get_application_screens(function_Id):
    try:
        query = (
            ContainerMapping.query.filter_by(function_id=function_Id)
            .join(
                App,
                and_(
                    App.container_id == ContainerMapping.container_id,
                    App.environment == "prod",
                ),
            )
            .add_columns(
                App.id,
                App.name,
                ContainerMapping.industry_id,
                ContainerMapping.function_id,
                App.color,
                App.description,
            )
            .filter_by(deleted_at=None)
            .all()
        )
        apps = []
        for app in query:
            apps.append(
                {
                    "id": app[1],
                    "type": "application",
                    "label": app[2],
                    "parent_industry_id": app[3],
                    "parent_function_id": app[4],
                    "color": app[5],
                    "description": app[6],
                }
            )
        app_ids = []
        for app in apps:
            app_ids.append(app.get("id"))
        screen_list = (
            db.session.query(AppScreen)
            .filter(AppScreen.app_id.in_(app_ids), AppScreen.marked.is_(True))
            .add_columns(
                AppScreen.id,
                AppScreen.screen_index,
                AppScreen.screen_name,
                AppScreen.app_id,
                AppScreen.marked,
            )
            .filter_by(deleted_at=None)
            .all()
        )
        screens = []
        for screen in screen_list:
            screens.append(
                {
                    "id": screen[1],
                    "type": "screens",
                    "screen_index": screen[2],
                    "label": screen[3],
                    "app_id": screen[4],
                    "marked": screen[5],
                }
            )
        return json_response({"applications": apps, "screens": screens}, 200)
    except Exception as err_msg:
        ExceptionLogger(err_msg)
        return json_response({"error": "error while fetching the details"}, 500)
