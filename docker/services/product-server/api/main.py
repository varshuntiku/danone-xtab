#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


import json
import os
from datetime import datetime as dt
from datetime import timedelta
from time import time

import psycopg2
import sentry_sdk
from api.connectors.postgres import PostgresDatabase
from api.constants.functions import ExceptionLogger, json_response
from api.helpers import delete_blob, get_clean_postdata, upload_blob
from bson import json_util
from cryptography.fernet import Fernet
from flasgger import Swagger
from flasgger.utils import swag_from
from flask import Flask, g, request
from flask_cors import CORS
from flask_jwt_extended import (  # jwt_required,; , get_current_user, jwt_refresh_token_required
    JWTManager,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_jwt_identity,
    jwt_required,
)
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_talisman import Talisman
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.ext.flask.flask_middleware import FlaskMiddleware
from opencensus.trace.samplers import ProbabilitySampler

# from flask_script import Manager
from sentry_sdk.integrations.flask import FlaskIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sqlalchemy.sql import func

swagger_template = {
    "components": {
        "securitySchemes": {"Authorization": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}},
        "security": {"Authorization": []},
    }
}

app = Flask(__name__)
app.config["SWAGGER"] = {
    "title": "Co.dx Product API Library 🚀",
    "uiversion": 3,
    "description": "Co.dx Platform API documentation",
}
app.config["SWAGGER"]["openapi"] = "3.0.3"
swagger = Swagger(app, template=swagger_template)

app.config["JWT_ALGORITHM"] = "RS256"
app.config["JWT_PRIVATE_KEY"] = open(app.root_path + "/encode_key.pem").read()
app.config["JWT_PUBLIC_KEY"] = open(app.root_path + "/decode_key.pub").read()
app.config["JWT_ENCODE_ISSUER"] = "codex-backend"

app.config.from_pyfile("config.py", silent=True)

app.config["JSON_SORT_KEYS"] = False

if os.environ.get("FLASK_ENV") and os.environ.get("FLASK_ENV") != "development":
    if app.config.get("NUCLIOS_PRODUCT_ENABLE_SENTRY"):
        sentry_sdk.init(
            dsn="https://3cea269063d3ddaf8afae9e9178f0e1f@o281602.ingest.sentry.io/5342199",
            integrations=[FlaskIntegration(), SqlalchemyIntegration()],
            environment=os.environ.get("FLASK_ENV"),
        )
    if app.config.get("NUCLIOS_PRODUCT_ENABLE_APP_INSIGHTS"):
        # Initialize and setup opencensus with app insights
        loggerMiddleware = FlaskMiddleware(
            app,
            exporter=AzureExporter(
                connection_string=f"InstrumentationKey={os.environ.get('APPINSIGHTS_INSTRUMENTATIONKEY')}"
            ),
            sampler=ProbabilitySampler(rate=1.0),
        )

socketio = SocketIO(app, cors_allowed_origins="*", logger=False, engineio_logger=False)
app.pg_db = PostgresDatabase(app)
db = app.pg_db.db

migrate = Migrate(app, db)

from api.admin import bp as admin_bp
from api.auth import authenticate
from api.blueprints.ai_response import bp as airesponse_bp
from api.blueprints.alerts.alerts_crud import bp as alerts_bp
from api.blueprints.alerts.notifications import bp as notifications_bp
from api.blueprints.app import bp as app_bp
from api.blueprints.app_admin import bp as app_admin_bp
from api.blueprints.app_admin_screens import bp as app_admin_screens_bp
from api.blueprints.app_admin_users import bp as app_admin_users_bp
from api.blueprints.app_theme import bp as app_theme
from api.blueprints.dashboard import bp as dashboard_bp
from api.blueprints.dynamic_execution_environments import bp as dynamic_exec_env_bp
from api.blueprints.experimental.app_widget_updates import bp as app_widgets_bp
from api.blueprints.navigator import bp as navigator_bp
from api.blueprints.planogram import bp as planogram_bp
from api.blueprints.problem_definition import bp as problem_definition_version_bp
from api.blueprints.projects import bp as projects_bp
from api.blueprints.reports.report_crud import bp as stories_bp
from api.blueprints.scenarios.scenarios import bp as scenario_bp
from api.bulk_user import bp as bulk_user_bp
from api.db_models.user_management.users import User
from api.middlewares import login_required
from api.models import App
from api.nac_user_roles import bp as nac_user_roles_bp
from api.user_groups import bp as user_groups_bp
from api.users import bp as users_bp
from api.views.connected_systems.business_process_view import (
    bp as connected_systems_business_process_bp,
)
from api.views.connected_systems.dashboard_tab_view import (
    bp as connected_systems_dashboard_tab_bp,
)
from api.views.connected_systems.dashboard_view import (
    bp as connected_systems_dashboard_bp,
)
from api.views.connected_systems.driver_view import bp as connected_systems_driver_bp
from api.views.connected_systems.goal_view import bp as connected_systems_goal_bp
from api.views.connected_systems.initiative_view import (
    bp as connected_systems_initiative_bp,
)
from api.views.dsw_execution_environment.dsw_execution_environment_project_mapping_view import (
    bp as dsw_execution_environment_project_mapping_bp,
)
from api.views.dsw_execution_environment.dsw_execution_environment_view import (
    bp as dsw_execution_environment_bp,
)
from api.views.solution_workbench.screen_view import bp as solution_workbench_screen_bp

# JWT setup
jwt_app = JWTManager(app)


@app.route("/codex-product-api/")
def welcome():
    socketio.emit(
        "notification",
        {"message": "Hey product client I am your server"},
        namespace="/codx_product_notification",
    )
    return "Welcome to the CODEX PRODUCT !" + "\n"


@app.route("/codex-product-api/info")
def info():
    """Returns the database log details

    Returns:
        JSON : {PostGreSQL: logs }
    """
    response = "PostGreSQL: \n" + app.pg_db.getLogs() + "\n"
    # headers = {"content-type": "application/json"}
    return response


@app.route("/codex-product-api/file/upload", methods=["POST"])
@swag_from("./documentation/main/upload_file.yml")
def upload_file():
    try:
        file = request.files["file"]
        file_name = file.filename
        upload_with_content_type = (
            json.loads((request.form["uploadWithContentType"])) if request.form.get("uploadWithContentType") else False
        )
        dynamic_file_path = json.loads((request.form["file_path"])) if request.form.get("file_path") else False
        dynamic_blob_properties = False
        if request.form.get("dynamic_storage", False) and request.form.get("app_id", False):
            app_id = request.form.get("app_id")
            dynamic_storage = json.loads(request.form.get("dynamic_storage"))
            encoded_var_name = dynamic_storage["CONNECTION_STRING"]
            app_info = db.session.query(App).filter_by(id=app_id).first()
            fernet = Fernet(app.config["CRYPTO_ENCRYPTION_KEY"])
            app_variables = (
                json.loads(fernet.decrypt(app_info.variables.encode()).decode())
                if app_info.variables is not None
                else {}
            )
            encoded_credentials = app_variables[encoded_var_name]
            dynamic_blob_properties = {
                **dynamic_storage,
                "CONNECTION_STRING": encoded_credentials,
            }
        if request.form.get("blobIncludeTimeStamp", False):
            t = round(time() * 1000)
            file_name = file_name.split(".")[0] + "_" + str(t) + "." + ".".join(file_name.split(".")[1:])

        url = upload_blob(
            file.read(),
            file_name,
            upload_with_content_type,
            dynamic_file_path,
            dynamic_blob_properties,
        )
        response = {"path": url, "filename": file.filename}
        return json_response(response)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while uploading the file"}, 500)


# TODO check  delete? post?
@app.route("/codex-product-api/file/delete", methods=["POST"])
def delete_file():
    data = get_clean_postdata(request)
    delete_blob(data["file"])
    response = {"message": "Deleted the file from Blob", "filename": data["file"]}
    return json_response(response)


# @app.route("/codex-product-api/user/get-info", methods=["GET"])
# @swag_from("./documentation/main/user_info.yml")
# @login_required
# def user_info():
#     feature_access = {"rbac": False, "admin": False}
#     for group_row in g.user.user_groups:
#         if group_row.rbac:
#             feature_access["rbac"] = True
#             feature_access["admin"] = True
#     response = {
#         "user_id": g.user.id,
#         "username": g.user.email_address,
#         "first_name": g.user.first_name,
#         "last_name": g.user.last_name,
#         "last_login": g.user.last_login.strftime("%d %B, %Y %H:%M"),
#         "access_key": g.user.access_key,
#         "feature_access": feature_access,
#     }
#     return json_response(response)


@app.route("/codex-product-api/announcement/banner", methods=["GET"])
@login_required
def release_info():
    release_documentation_link = (
        "https://themathcompany.sharepoint.com/:f:/g/product/Eu_kYjsJfVpHkLD3F_-5qVcBNtif3HznmoLg2XbSSFNeYA?e=DpPegd"
    )
    banner_content_HTML = (
        "<div><b>Solution Workbench</b> is now available. Please <a target='__blank' href='"
        + release_documentation_link
        + "'><b>Click here</b></a> to explore more.</div>"
    )
    response = {
        "banner_content": banner_content_HTML,
    }
    return json_response(response)


def extract_db_info(uri):
    return {
        "user": uri.split("/")[2].split(":")[0],
        "password": uri.split("/")[2].split(":")[1].split("@")[0].replace("%40", "@"),
        "host": uri.split("/")[2].split(":")[1].split("@")[1],
        "port": uri.split("/")[2].split(":")[2],
    }


def get_users():
    uri = app.config.get("POSTGRES_URI")
    db_info = extract_db_info(uri)
    conn = psycopg2.connect(
        database="codex",
        user=db_info["user"],
        password=db_info["password"],
        host=db_info["host"],
        port=db_info["port"],
    )
    cursor_obj = conn.cursor()
    cursor_obj.execute("select id, email_address from public.user")
    users = cursor_obj.fetchall()
    conn.close()
    return users


FAILED_LOGIN_THRESHOLD = 5
ACCOUNT_LOCKOUT_DURATION = 30  # min


@app.route("/codex-product-api/login", methods=["POST"])
@swag_from("./documentation/main/login.yml")
def login():
    headers = {"content-type": "application/json"}
    try:
        username = get_clean_postdata(request).get("username", None)
        password = get_clean_postdata(request).get("password", None)

        user = User.query.filter_by(email_address=username.lower()).first()
        if user:
            restricted_access = user.restricted_access
            if restricted_access:
                diff = (
                    (dt.now(user.created_at.tzinfo) - (user.created_at))
                    if user.updated_at is None
                    else (dt.now(user.updated_at.tzinfo) - (user.updated_at))
                )
                if diff.days > 14:
                    return (
                        json_util.dumps({"error": "Your account access has expired"}),
                        401,
                        headers,
                    )
            failed_login_count = user.failed_login_count if user.failed_login_count else 0
            if (
                failed_login_count >= FAILED_LOGIN_THRESHOLD
                and user.failed_login_at
                and (dt.now().timestamp() - user.failed_login_at.timestamp()) < ACCOUNT_LOCKOUT_DURATION * 60
            ):
                return (
                    json_util.dumps({"error": "Account is locked for " + str(ACCOUNT_LOCKOUT_DURATION) + " minutes."}),
                    418,
                    headers,
                )
            else:
                pass
        else:
            raise Exception("Login error456")

        valid = authenticate(user, password)
        if valid:
            # config_response = {}
            # for config_key in app.config:
            #     if config_key.startswith('APP_'):
            #         if config_key.startswith('APP_FEATURE_'):
            #             config_response[config_key.replace('APP_FEATURE_', '')] = app.config[config_key]
            user.failed_login_count = 0
            user.failed_login_at = None
            db.session.commit()
            access_token = create_access_token(identity=user.email_address, expires_delta=timedelta(minutes=65))
            refresh_toke = create_refresh_token(identity=user.email_address, expires_delta=timedelta(days=14))
            return (
                json_util.dumps(
                    {
                        "access_token": access_token,
                        "refresh_token": refresh_toke,
                        "exp": decode_token(access_token)["exp"],
                        "is_restricted_user": user.restricted_user,
                    }
                ),
                200,
                headers,
            )

        else:
            user.failed_login_count = (failed_login_count % FAILED_LOGIN_THRESHOLD) + 1
            user.failed_login_at = func.now()
            db.session.commit()
            raise Exception("Login error456")
    except Exception as ex:
        ExceptionLogger(ex)
        return (json_util.dumps({"error": "Wrong username or password"}), 401, headers)
    finally:
        if db:
            db.session.close()


@app.route("/codex-product-api/logout", methods=["PUT"])
@login_required
def logout():
    try:
        user = User.query.filter_by(email_address=g.user.email_address).first()
        user.last_logout = func.now()
        db.session.commit()
        return json_response({"status": "success", "description": "User logged out"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"status": "error", "description": "Error logging out user"}, 500)


@app.route("/codex-product-api/user/get-info", methods=["GET"])
@swag_from("./documentation/main/info.yml")
@login_required
def user_info():
    headers = {"content-type": "application/json"}
    feature_access = {
        "app": False,
        "case_studies": False,
        "my_projects": False,
        "my_projects_only": False,
        "all_projects": False,
        "widget_factory": False,
        "environments": False,
        "rbac": False,
        "admin": False,
        "super_user": False,
    }
    nac_roles = []
    try:
        for group_row in g.user.user_groups:
            if group_row.app:
                feature_access["app"] = True
            if group_row.my_projects:
                feature_access["my_projects"] = True
                feature_access["admin"] = True
            if group_row.my_projects_only:
                feature_access["my_projects_only"] = True
                feature_access["admin"] = True
            if group_row.case_studies:
                feature_access["case_studies"] = True
                feature_access["admin"] = True
            if group_row.all_projects:
                feature_access["all_projects"] = True
                feature_access["admin"] = True
            if group_row.widget_factory:
                feature_access["widget_factory"] = True
                feature_access["admin"] = True
            if group_row.environments:
                feature_access["environments"] = True
                feature_access["admin"] = True
            if group_row.app_publish:
                feature_access["app_publish"] = True
                feature_access["admin"] = True
            if group_row.prod_app_publish:
                feature_access["prod_app_publish"] = True
                feature_access["admin"] = True
            if group_row.rbac:
                feature_access["rbac"] = True
                feature_access["admin"] = True
            if group_row.name == "super-user":
                feature_access["super_user"] = True
        for group_row in g.user.nac_user_roles:
            role_data = {
                "name": group_row.name,
                "id": group_row.id,
                "permissions": [{"name": item.name.upper(), "id": item.id} for item in group_row.role_permissions],
            }
            nac_roles.append(role_data)

        response = {
            "status": "success",
            "user_id": g.user.id,
            "username": g.user.email_address,
            "is_restricted_user": g.user.restricted_user,
            "first_name": g.user.first_name,
            "last_name": g.user.last_name,
            "last_login": g.user.last_login.strftime("%d %B, %Y %H:%M"),
            "access_key": g.user.access_key,
            "feature_access": feature_access,
        }
        if feature_access.get("app_publish", False):
            response["nac_roles"] = nac_roles
            token_payload = {
                "user_email": g.user.email_address,
                "user_id": g.user.id,
                "nac_roles": nac_roles,
            }
            nac_access_token = generate_nac_access_token(token_payload)
            response["nac_access_token"] = nac_access_token

        # g.platform_user = response
        return (json_util.dumps(response), 200, headers)
    except Exception as ex:
        ExceptionLogger(ex)
        return (
            json_util.dumps({"status": "error", "error": "Error fetching user info"}),
            500,
            headers,
        )


def generate_nac_access_token(payload):
    try:
        identity = g.user.email_address
        token = create_access_token(
            identity=identity,
            additional_claims=payload,
            fresh=False,
            expires_delta=timedelta(minutes=65),
        )
        return token
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error in generating nac_token"}, 400)


@app.route("/codex-product-api/refresh", methods=["GET"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity, fresh=False, expires_delta=timedelta(minutes=65))
    refresh_token = create_refresh_token(identity=identity, expires_delta=timedelta(days=14))
    return (
        json.dumps(
            {
                "access_token": access_token,
                "exp": decode_token(access_token)["exp"],
                "refresh_token": refresh_token,
            }
        ),
        200,
    )


@app.route("/codex-product-api/migrations/map-userid-app", methods=["POST"])
@login_required
def migrate_user_id():
    # Getting User data
    users = get_users()
    res = db.engine.execute("select id, contact_email from app")
    apps = res.fetchall()
    # conn.close()
    apps_affected = 0
    app_creator_not_found = 0
    try:
        for app in apps:
            user_id = 0
            user_found = False
            for user in users:
                if user[1].lower() == app[1].lower():
                    user_id = user[0]
                    user_found = True
                    break
            if not user_found:
                app_creator_not_found += 1
            add_app_creator_id = f"""UPDATE app SET app_creator_id = {user_id} WHERE id = {app[0]};"""
            db.engine.execute(add_app_creator_id)
            apps_affected += 1
    except Exception:
        return json_response(
            {
                "status": "Failed updating apps",
                "total_apps": len(apps),
                "apps_affected": apps_affected,
                "creator_not_found": app_creator_not_found,
            }
        )

    return json_response(
        {
            "status": "Success",
            "total_apps": len(apps),
            "apps_affected": apps_affected,
            "creator_not_found": app_creator_not_found,
        }
    )


app.register_blueprint(admin_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(app_bp)
app.register_blueprint(app_admin_bp)
app.register_blueprint(app_admin_users_bp)
app.register_blueprint(app_admin_screens_bp)
app.register_blueprint(users_bp)
app.register_blueprint(nac_user_roles_bp)
app.register_blueprint(bulk_user_bp)
app.register_blueprint(user_groups_bp)
app.register_blueprint(stories_bp)
app.register_blueprint(alerts_bp)
app.register_blueprint(navigator_bp)
app.register_blueprint(planogram_bp)
app.register_blueprint(scenario_bp)
app.register_blueprint(dynamic_exec_env_bp)
app.register_blueprint(notifications_bp, url_prefix="/notifications")
app.register_blueprint(app_widgets_bp)
app.register_blueprint(airesponse_bp)
app.register_blueprint(app_theme)
app.register_blueprint(solution_workbench_screen_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(problem_definition_version_bp)
app.register_blueprint(connected_systems_dashboard_bp)
app.register_blueprint(connected_systems_dashboard_tab_bp)
app.register_blueprint(connected_systems_goal_bp)
app.register_blueprint(connected_systems_initiative_bp)
app.register_blueprint(connected_systems_driver_bp)
app.register_blueprint(connected_systems_business_process_bp)
app.register_blueprint(dsw_execution_environment_bp)
app.register_blueprint(dsw_execution_environment_project_mapping_bp)


if __name__ == "__notifications__":
    socketio.run(app)


# No cacheing at all for API endpoints.
@app.after_request
def add_header(response):
    # response.cache_control.no_store = True
    if "Cache-Control" not in response.headers:
        response.headers["Cache-Control"] = "no-cache, no-store"
        response.headers["Pragma"] = "no-cache"
    return response


# enable strict TLS, CSP
csp = {
    "default-src": ["'self'", "'unsafe-inline'"],
    "script-src": ["'self'", "'unsafe-inline'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "style-src-elem": ["'self'", "https:", "'unsafe-inline'"],
    "img-src": ["'self'", "data:"],
    "font-src": "https://fonts.gstatic.com/  ",
}
Talisman(
    app,
    force_https=app.config.get("HTTPS_FORCE", False),
    frame_options="SAMEORIGIN",
    content_security_policy=csp,
)


# enable CORS for only certain origins
CORS(app, resources={r"/*": {"origins": app.config.get("ALLOWED_ORIGINS")}})
