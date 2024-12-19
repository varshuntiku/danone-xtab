import json
import logging
import sys
from time import time
from typing import Dict

from api.configs.settings import AppSettings, get_app_settings
from api.constants.apps.screen_actions_error_messages import ScreenActionsErrors
from api.constants.apps.screen_error_messages import ScreenErrors
from api.constants.apps.screen_success_messages import ScreenSuccess
from api.constants.error_messages import GeneralErrors
from api.daos.apps.screen_dao import ScreenDao
from api.daos.apps.widget_dao import WidgetDao
from api.middlewares.error_middleware import GeneralException
from api.schemas.apps.screen_actions_schema import (
    AppScreenActionHandlerRequestSchema,
    AppScreenActionsCodeStringRequestSchema,
    AppScreenActionsOutputResponseSchema,
    AppScreenActionsRequestSchema,
    AppScreenActionsResponseSchema,
    AppScreenDynamicActionsRequestSchema,
    AppScreenGetActionsResponseSchema,
    AppScreenResponseSchema,
    ExecuteDynamicActionsRequestSchema,
)
from api.services.base_service import BaseService
from api.utils.app.app import execute_code_string, sanitize_content
from api.utils.app.screen_actions import (
    execute_screen_action_handler,
    get_screen_action_settings,
)
from fastapi import Request, status

settings = get_app_settings()


class ScreenActionsService(BaseService):
    def __init__(self):
        super().__init__()
        self.screen_dao = ScreenDao(self.db_session)
        self.widget_dao = WidgetDao(self.db_session)
        self.app_settings = AppSettings()

    def save_actions(
        self, user_id: int, screen_id: int, request_data: AppScreenActionsRequestSchema
    ) -> AppScreenResponseSchema:
        input_action_settings = getattr(request_data, "action_settings", {})
        action_handler = input_action_settings.get("action_handler", "")
        action_generator = input_action_settings.get("action_generator", "")

        if action_handler == "" and action_generator == "":
            action_settings = None
        else:
            action_settings = json.dumps(input_action_settings)

        self.screen_dao.update_app_screen_actions(screen_id=screen_id, user_id=user_id, action_settings=action_settings)

        return {"status": ScreenSuccess.SCREEN_SUCCESS.value}

    def test_actions(
        self, app_id: int, request: Request, request_data: AppScreenActionsCodeStringRequestSchema
    ) -> AppScreenActionsResponseSchema:
        access_token = request.headers.get("authorization", None)
        screen_actions = {
            "action_generator": getattr(request_data, "code_string", ""),
            "action_handler": "",
            "default": None,
        }
        start_time = time()
        response_actions, response_logs, error_lineno = get_screen_action_settings(
            app_id, None, access_token, json.dumps(screen_actions), request=request
        )
        end_time = time()
        sanitized_response_actions = sanitize_content(response_actions)

        return {
            "status": "success",
            "timetaken": str(round((end_time - start_time), 2)),
            "size": str(sys.getsizeof(json.dumps(sanitized_response_actions))),
            "output": sanitized_response_actions,
            "logs": response_logs,
            "lineno": error_lineno,
        }

    def get_actions(self, app_id: int, screen_id: int) -> AppScreenGetActionsResponseSchema:
        app_screen = self.screen_dao.get_app_screen(app_id, screen_id)

        if not app_screen:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND_ERROR.value},
            )

        response = {}
        if app_screen.action_settings:
            response = json.loads(app_screen.action_settings)

        return response

    def preview_actions(
        self, app_id: int, request: Request, request_data: AppScreenActionsRequestSchema
    ) -> AppScreenActionsOutputResponseSchema | Dict | bool:
        try:
            access_token = request.headers.get("authorization", None)
            action_settings = getattr(request_data, "action_settings")
            screen_actions = {
                "action_generator": action_settings.get("action_generator", ""),
                "action_handler": action_settings.get("action_handler", ""),
                "default": None,
            }

            response_actions, _, _ = get_screen_action_settings(
                app_id, None, access_token, json.dumps(screen_actions), request=request
            )

            return sanitize_content(response_actions)
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": ScreenActionsErrors.APP_SCREEN_PREVIEW_ACTIONS_ERROR.value},
            )

    def get_dynamic_actions(
        self, app_id: int, screen_id: int, request: Request, request_data: AppScreenDynamicActionsRequestSchema
    ) -> AppScreenActionsOutputResponseSchema | Dict | bool:
        try:
            # GET the code for the screen
            access_token = request.headers.get("authorization", None)
            app_screen = self.screen_dao.get_app_screen(app_id, screen_id)

            if not app_screen:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND_ERROR.value},
                )

            action_settings = app_screen.action_settings

            new_actions, _, _ = (
                get_screen_action_settings(
                    app_id, screen_id, access_token, action_settings, dict(request_data), request
                )
                if action_settings
                else False
            )
            return sanitize_content(new_actions)
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": ScreenActionsErrors.APP_SCREEN_DYNAMIC_ACTIONS_ERROR.value},
            )

    def preview_actions_handler(
        self, app_id: int, request: Request, request_data: AppScreenActionsCodeStringRequestSchema
    ) -> AppScreenActionsResponseSchema:
        access_token = request.headers.get("authorization", None)
        screen_actions = {
            "action_generator": "",
            "action_handler": getattr(request_data, "code_string", ""),
            "default": None,
        }
        start_time = time()
        response_actions, response_logs, error_lineno = execute_screen_action_handler(
            app_id, None, access_token, screen_actions, request=request
        )
        end_time = time()
        sanitized_response_actions = sanitize_content(response_actions)

        return {
            "status": "success",
            "timetaken": str(round((end_time - start_time), 2)),
            "size": str(sys.getsizeof(json.dumps(sanitized_response_actions))),
            "output": sanitized_response_actions,
            "logs": response_logs,
            "lineno": error_lineno,
        }

    def action_handler(
        self,
        app_id: int,
        screen_id: int,
        request_data: AppScreenActionHandlerRequestSchema,
        request: Request,
    ) -> AppScreenActionsResponseSchema:
        app_screen = self.screen_dao.get_app_screen(app_id, screen_id)

        if not app_screen:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND_ERROR.value},
            )

        access_token = request.headers.get("authorization", None)
        filter_state = getattr(request_data, "filter_state", None)
        action_param = getattr(request_data, "action_params", None)
        action_type = getattr(request_data, "action_type", None)

        (
            action_handler_response,
            _,
            _,
        ) = execute_screen_action_handler(
            app_id,
            screen_id,
            access_token,
            json.loads(app_screen.action_settings),
            {
                "current_filter_params": filter_state,
                "action_param": action_param,
                "action_type": action_type,
            },
            base_url=settings.BACKEND_APP_URI,
            request=request,
        )
        return sanitize_content(action_handler_response)

    def get_dynamic_action_response(
        self,
        user_info: Dict,
        logged_in_email: str,
        app_id: int,
        screen_id: int,
        request_data: ExecuteDynamicActionsRequestSchema,
        access_token: str,
    ) -> Dict:
        widget_data = self.widget_dao.get_widget_value_by_id_app_and_screen(
            app_id, screen_id, request_data.widget_value_id
        )
        code = json.loads(widget_data.widget_value)
        code = code.get("code", None)
        if not code:
            raise GeneralException(
                message={"error": GeneralErrors.CODE_NOT_EXISTS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        code = (
            code
            + """
code_outputs = dynamic_outputs
"""
        )
        file_prefix = f"widget_action_{app_id}_{widget_data.widget_id}_{logged_in_email}_"
        try:
            code_string_response = execute_code_string(
                app_id=app_id,
                code_string=code,
                injected_vars={
                    "action_type": request_data.action_type,
                    "screen_data": request_data.data,
                    "filter_data": request_data.filters,
                    "selected_filters": request_data.filters,
                    "form_data": request_data.formData,
                    "user_info": user_info,
                    "__baseurl__": self.app_settings.BACKEND_APP_URI,
                    "source_app_id": app_id,
                },
                access_token=access_token,
                file_prefix=file_prefix,
            )

            return sanitize_content(json.loads(code_string_response["code_string_output"]["code_outputs"]))
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenActionsErrors.APP_SCREEN_ACTION_CODE_EXECUTION_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
