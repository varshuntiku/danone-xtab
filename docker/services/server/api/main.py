#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


import os
from datetime import datetime as dt
from datetime import timedelta

import sentry_sdk
from api.connectors.postgres import PostgresDatabase
from api.constants.functions import ExceptionLogger, json_response
from api.helpers import get_clean_postdata
from api.hierarchy import hierarchy
from bson import json_util
from flasgger import Swagger
from flasgger.utils import swag_from
from flask import Flask, g, json, request
from flask_cors import CORS

# from flask_script import Manager
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

# Configure private and public keys for signing and verifying JWT keys
app.config["JWT_ALGORITHM"] = "RS256"
app.config["JWT_PRIVATE_KEY"] = open(app.root_path + "/encode_key.pem").read()
app.config["JWT_PUBLIC_KEY"] = open(app.root_path + "/decode_key.pub").read()
app.config["JWT_ENCODE_ISSUER"] = "codex-backend"

app.config["SWAGGER"] = {
    "title": "Co.dx Platform API Library 🦾",
    "description": "Co.dx Platform API documentation",
}

if os.environ.get("FLASK_ENV") and os.environ.get("FLASK_ENV") != "development":
    if app.config.get("PLATFORM_ENABLE_SENTRY"):
        sentry_sdk.init(
            dsn="https://3cea269063d3ddaf8afae9e9178f0e1f@o281602.ingest.sentry.io/5342199",
            integrations=[FlaskIntegration(), SqlalchemyIntegration()],
            environment=os.environ.get("FLASK_ENV"),
        )

    if app.config.get("PLATFORM_ENABLE_APP_INSIGHTS"):
        # Initialize and setup opencensus with app insights
        print(f"App Ins Key: {os.environ.get('APPINSIGHTS_INSTRUMENTATIONKEY')}")
        loggerMiddleware = FlaskMiddleware(
            app,
            exporter=AzureExporter(
                connection_string=f"InstrumentationKey={os.environ.get('APPINSIGHTS_INSTRUMENTATIONKEY')}"
            ),
            sampler=ProbabilitySampler(rate=1.0),
        )

app.config["SWAGGER"]["openapi"] = "3.0.3"
# TODO check if we need swagger validation on the Apis
swagger = Swagger(app, template=swagger_template)

app.config.from_pyfile("config.py", silent=True)
socketio = SocketIO(app, cors_allowed_origins=app.config.get("ALLOWED_ORIGINS"), logger=False, engineio_logger=False)

app.config["JSON_SORT_KEYS"] = False

app.pg_db = PostgresDatabase(app)
db = app.pg_db.db

migrate = Migrate(app, db)

from api.auth import authenticate
from api.blueprints.alerts.notifications import bp as notifications_bp
from api.blueprints.app_configs import bp as app_configs_bp
from api.blueprints.bulk_user import bp as bulk_user_bp
from api.blueprints.casestudies import bp as casestudies_bp
from api.blueprints.environments import bp as environments_bp
from api.blueprints.execution_environments import bp as execution_environments_bp
from api.blueprints.iterations import bp as iterations_bp
from api.blueprints.nac_user_roles import bp as nac_user_roles_bp
from api.blueprints.problem_definition import bp as problem_definition_bp
from api.blueprints.project_notebooks import bp as projectnotebooks_bp
from api.blueprints.projects import bp as projects_bp
from api.blueprints.user_groups import bp as user_groups_bp
from api.blueprints.users import bp as users_bp
from api.blueprints.widget_groups import bp as widget_groups_bp
from api.blueprints.widgets import bp as widgets_bp
from api.middlewares import login_required
from api.models import User

# JWT setup
jwt_app = JWTManager(app)
# jwt_app.user_lookup_loader(identity)

# from api.blueprints.queue_api import bp as queue_api_bp
# from api.blueprints.bg_jobs import bp as bg_jobs_bp


@app.route("/codex-api/")
def welcome():
    # socketio.emit('notification', {
    #   'message': "Hey client I am your platform server"}, namespace='/codx_platform_notification')
    return "Welcome to the CODEX !" + "\n"


@app.route("/codex-api/info")
def info():
    """Returns the database log details

    Returns:
        JSON : {(PostGreSQL: logs), 200, "content-type": "application/json" }
    """
    response = "PostGreSQL: \n" + app.pg_db.getLogs() + "\n"
    headers = {"content-type": "application/json"}
    return (json_util.dumps(response), 200, headers)


FAILED_LOGIN_THRESHOLD = 5
ACCOUNT_LOCKOUT_DURATION = 30  # min


@app.route("/codex-api/login", methods=["POST"])
@swag_from("./documentation/main/login.yml")
def login():
    headers = {"content-type": "application/json"}
    try:
        username = get_clean_postdata(request).get("username", None)
        password = get_clean_postdata(request).get("password", None)

        user = User.query.filter_by(email_address=username.lower()).first()
        if user:
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


# @app.route("/codex-api/get-refresh-token")
# @jwt_refresh_token_required
# def refresh():
#     user = get_current_user()
#     return json.dumps({
#         'access_token': create_access_token(identity=user.id)
#     }), 200


@app.route("/codex-api/refresh", methods=["GET"])
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


@app.route("/codex-api/logout", methods=["PUT"])
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


@app.route("/codex-api/validate-user", methods=["GET"])
@login_required
def validate_user():
    try:
        return json_response(
            {
                "status": "success",
                "user_info": {
                    "email_address": g.user.email_address,
                    "restricted_user": g.user.restricted_user,
                    "first_name": g.user.first_name,
                    "last_name": g.user.last_name,
                },
            },
            200,
        )
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"status": "error", "description": "Error fetching user info"}, 500)


@app.route("/codex-api/hierarchy/get-info")
@login_required
def hierarchy_info():
    """returns hierarchy detail

    Returns:
        JSON: {(hierarchy), 200, "content-type": "application/json"}
    """
    headers = {"content-type": "application/json"}
    return (json_util.dumps(hierarchy), 200, headers)


# TODO change the get-info route to info


@app.route("/codex-api/user/get-info", methods=["GET"])
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


app.register_blueprint(projects_bp)
app.register_blueprint(casestudies_bp)
app.register_blueprint(projectnotebooks_bp)
app.register_blueprint(iterations_bp)
app.register_blueprint(widget_groups_bp)
app.register_blueprint(widgets_bp)
app.register_blueprint(environments_bp)
app.register_blueprint(execution_environments_bp)
app.register_blueprint(app_configs_bp)
app.register_blueprint(users_bp)
app.register_blueprint(user_groups_bp)
app.register_blueprint(bulk_user_bp)
# app.register_blueprint(bg_jobs_bp)
app.register_blueprint(notifications_bp, url_prefix="/notifications")
app.register_blueprint(nac_user_roles_bp)
app.register_blueprint(problem_definition_bp)

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
