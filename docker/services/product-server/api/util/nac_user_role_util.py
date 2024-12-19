from api.constants.functions import ExceptionLogger
from api.helpers import get_clean_postdata
from api.models import App, AppDynamicVizExecutionEnvironment
from flask import g

app_info = None


def get_app_id(request):
    try:
        request_data = get_clean_postdata(request) if request.data else None
        app_id = None
        if request.endpoint != "DynamicVizExecutionEnvironments.start" and request.endpoint != "App.clone_app":
            if request.view_args.get("app_id"):
                app_id = request.view_args.get("app_id")
            elif request_data["app_id"]:
                app_id = request_data["app_id"]
        elif request.endpoint == "DynamicVizExecutionEnvironments.start":
            exec_env_id = request.view_args.get("execution_environment_id")
            app_data = AppDynamicVizExecutionEnvironment.query.filter_by(
                deleted_at=None, dynamic_env_id=exec_env_id
            ).first()
            app_id = app_data.app_id if app_data else None
        return app_id
    except Exception as ex:
        ExceptionLogger(ex)


def get_request_action(request):
    try:
        app_id = get_app_id(request)
        global app_info
        app_info = App.query.filter_by(id=app_id).first()
        # user_email = (
        #     g.platform_user.get("username")
        #     if g.get("platform_user", False)
        #     else g.logged_in_email
        # )
        user_id = g.platform_user.get("user_id") if g.get("platform_user", False) else None
        action = None

        endpoint_action = {
            "AppAdmin.add_app_variable_key_value": "create_variable",
            "AppAdmin.create_app": "create_preview_app",
            "AppAdmin.add_app_function_key_value": "create_variable",
            "DynamicVizExecutionEnvironments.create": "create_execution_environment",
            "App.replicate_app": "promote_app",
            "App.clone_app": "cloning_of_application",
            "App.download_app": "cloning_of_application",
            "App.reset_app": "reset_my_app" if app_info and app_info.app_creator_id == user_id else "reset_all_app",
            "DynamicVizExecutionEnvironments.update_app_env_id": "edit_production_app"
            if app_info and app_info.environment == "prod"
            else "create_preview_app",
            "DynamicVizExecutionEnvironments.start": "edit_production_app"
            if app_info and app_info.environment == "prod"
            else "create_preview_app",
            "Users.get_jwt_tokens": "fetch_User_PATS",
            "Users.generate_jwt_token": "get_User_PATS",
            "Users.delete_jwt_token": "get_User_PATS",
        }
        if (
            request.endpoint == "AppAdmin.add_app_variable_key_value"
            or request.endpoint == "AppAdmin.add_app_function_key_value"
        ):
            action = endpoint_action[request.endpoint]
        elif (
            "app-admin" in request.path
            and app_info
            and app_info.environment == "prod"
            and request.method == "POST"
            or request.method == "PATCH"
            or request.method == "PUT"
        ):
            action = "edit_production_app"
        elif endpoint_action.get(request.endpoint, False):
            action = endpoint_action[request.endpoint]
        elif (
            action is None
            and "app-admin" in request.path
            and app_info
            and app_info.environment == "preview"
            and request.method == "POST"
            or request.method == "PATCH"
            or request.method == "PUT"
        ):
            # TODO: check if this last elif condition is right
            return "edit_preview_app"

        return action
    except Exception as ex:
        ExceptionLogger(ex)


def get_all_user_permissions(roles):
    try:
        permissions = {
            "create_variable": False,
            "create_preview_app": False,
            "create_execution_environment": False,
            "reset_all_app": False,
            "reset_my_app": False,
            "promote_app": False,
            "edit_production_app": False,
            "cloning_of_application": False,
        }

        permissions_list = permissions.keys()

        for role in roles:
            for action in permissions_list:
                if any(item.get("name").lower() == action for item in role.get("permissions")):
                    permissions[action] = True

        return permissions
    except Exception as ex:
        ExceptionLogger(ex)


def verify_action_permission(action, permissions):
    try:
        action_permission = False
        if action == "create_variable" and app_info and app_info.environment == "preview":
            action_permission = (
                True
                if permissions.get("create_variable", False) and permissions.get("create_preview_app", False)
                else False
            )
        elif action == "create_variable" and app_info and app_info.environment == "prod":
            action_permission = (
                True
                if permissions.get("create_variable", False) and permissions.get("edit_production_app", False)
                else False
            )
        elif action == "reset_my_app" or action == "reset_all_app":
            action_permission = (
                permissions.get(action, False) if app_info and app_info.environment == "preview" else False
            )
        elif action == "edit_preview_app":
            action_permission = permissions.get("create_preview_app", False)
        elif action in ("fetch_User_PATS", "delete_User_PATS", "get_User_PATS") and (
            permissions.get("create_preview_app") or permissions.get("edit_production_app")
        ):
            action_permission = True
        else:
            action_permission = permissions.get(action, False)

        return action_permission
    except Exception as ex:
        ExceptionLogger(ex)
