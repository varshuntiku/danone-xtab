# from api.dtos.apps.widget_dto import WidgetDTO
import json
from datetime import datetime

from api.configs.settings import get_app_settings
from api.constants.code_executor import (
    CodeExecutionErrors,
    CodeExecutionStatus,
    ResourceTypes,
)
from api.daos.apps.app_dao import AppDao
from api.daos.apps.screen_dao import ScreenDao
from api.daos.apps.widget_dao import WidgetDao
from api.daos.code_executor.executor_dao import ExecJobDao
from api.middlewares.error_middleware import GeneralException
from api.utils.executor_app.app import (
    execute_code_string_exec_env,
    get_data_from_api_response,
    get_logs_errors_time_from_api_response,
)
from api.utils.executor_app.app_functions import get_app_function_settings
from api.utils.executor_app.code_execution_logs import create_exec_log_in_background
from api.utils.executor_app.screen_actions import get_screen_action_settings
from api.utils.executor_app.screen_filters import get_screen_filter_settings
from api.utils.executor_app.widget import get_dynamic_widget_code

# from api.utils.code_executor_util import get_request_body_code_executor
from fastapi import status


class ExecutorJobService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.executor_job_dao = ExecJobDao()
        self.widget_dao = WidgetDao()
        self.app_dao = AppDao()
        self.screen_dao = ScreenDao()
        self.settings = get_app_settings()

    def create_response_from_static_output(self, response, extra_data={}):
        return {
            "results": [
                {
                    "total_time_taken": 0,
                    "value": response,
                    "simulated_value": extra_data.get("widget_simulated_value", None),
                    "stdout_output": "",
                    "stderr_output": "",
                    "line_number": 0,
                    "time_taken": 0,
                }
            ],
            "time_taken": 0,
            "widget_value_id": extra_data.get("widget_value_id", 0),
        }

    def create_exec_log(
        self,
        background_tasks,
        user,
        executor_endpoint_id,
        execution_type="uiac",
        start_time=None,
        end_time=None,
        context="",
        response={},
        status="",
    ):
        create_exec_log_in_background(
            background_tasks,
            {
                "exec_env_id": executor_endpoint_id,
                "execution_time": response.get("time_taken", 0),
                "execution_context": context,
                "errors": response.get("errors", ""),
                "logs": response.get("logs", ""),
                "execution_type": execution_type,
                "invoked_by": user["id"] if user else None,
                "execution_start_time": start_time,
                "execution_end_time": end_time,
                "execution_status": status,
            },
        )
        return {
            "status": "Ok",
            "message": "Running",
        }

    def get_widget_id(self, request_data):
        try:
            widget_id = request_data.get("widget_id")
            if not widget_id:
                widget_id = request_data.widget.id
            return widget_id
        except Exception:
            return None

    def code_renderer(self, request, user, request_data={}, serialize_data=False, background_tasks=None):
        execution_start_time = datetime.now()
        try:
            endpoint = request_data.get("executor_endpoint")
            code_string = request_data.get("code_string")
            no_error, response = execute_code_string_exec_env(endpoint, code_string)
            if not no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            no_error, transformed_response = get_data_from_api_response(response)
            if no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + transformed_response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            transformed_response["injected_lines_count"] = 0
            self.create_exec_log(
                background_tasks,
                user,
                0,
                ResourceTypes.code.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.success.value,
                response=get_logs_errors_time_from_api_response(transformed_response),
                context=json.dumps({}),
            )
            return transformed_response
        except Exception as e:
            self.create_exec_log(
                background_tasks,
                user,
                0,
                ResourceTypes.code.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.failed.value,
                response={"logs": "", "errors": str(e)},
                context=json.dumps({}),
            )
            raise GeneralException(
                message="The Code execution failed. \n" + str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def uiac_renderer(self, request, user, request_data={}, serialize_data=False, background_tasks=None):
        execution_start_time = datetime.now()
        executor_endpoint_id = 0
        try:
            injected_lines_count = None
            widget_value_id = None
            endpoint = request_data.get("executor_endpoint")
            code_string = request_data.get("code_string") or request_data.get("code")
            app_id = request_data.get("app_id")
            widget_id = self.get_widget_id(request_data)

            if not ((endpoint and code_string) or (app_id and (code_string or widget_id))):
                raise GeneralException(
                    message="Either endpoint URL and code_string or App Id and Widget Id or code_string should be provided",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            if app_id and (code_string or widget_id):
                app_info = self.app_dao.get_app_by_id(app_id)
                if widget_id:
                    widget_value = self.widget_dao.get_multiwidgets_by_id(app_id, widget_id, request_data)
                    if not widget_value:
                        raise GeneralException(
                            message=CodeExecutionErrors.widget_value_id_not_found.value,
                            status_code=status.HTTP_400_BAD_REQUEST,
                        )
                    widget_value_id = widget_value.id
                else:
                    widget_value = None
                (
                    no_widget_value,
                    (code_string, injected_lines_count),
                    widget_simulated_value,
                    executor_endpoint,
                    executor_endpoint_id,
                ) = get_dynamic_widget_code(
                    app_info,
                    widget_value,
                    app_id,
                    widget_id,
                    request_data,
                    request,
                    code_string=code_string,
                    widget_filter=False,
                )
                if no_widget_value:
                    return self.create_response_from_static_output(
                        code_string,
                        {
                            "widget_value_id": widget_value_id,
                            "injected_lines_count": injected_lines_count,
                            "widget_simulated_value": widget_simulated_value,
                        },
                    )
                # TODO: Experimental
                if executor_endpoint and not endpoint:
                    endpoint = executor_endpoint
            if not code_string:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message="Code not found",
                )
            if not endpoint:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message="Endpoint not found",
                )
            # # transformed_response = ExecJobDTO(response, widget_id)
            # # if serialize_data:
            # #     return dict(executor_serializer.ExecutorJobSerializer(**transformed_response.__dict__))
            code_strings = []
            if widget_value and widget_value.widget_filter_value:
                (
                    no_widget_value,
                    (filter_code_string, injected_lines_count),
                    widget_simulated_value,
                    executor_endpoint,
                    executor_endpoint_id,
                ) = get_dynamic_widget_code(
                    app_info,
                    widget_value,
                    app_id,
                    widget_id,
                    request_data,
                    request,
                    code_string=None,
                    widget_filter=True,
                )
                if not no_widget_value:
                    code_strings.append(filter_code_string)
            no_error, response = execute_code_string_exec_env(endpoint, code_string, code_strings=code_strings)
            if not no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            no_error, transformed_response = get_data_from_api_response(response)
            if no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + transformed_response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            transformed_response["injected_lines_count"] = injected_lines_count
            transformed_response["widget_value_id"] = widget_value_id
            if len(code_strings) != 0:
                transformed_response["filter_value"] = True
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.uiac.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.success.value,
                response=get_logs_errors_time_from_api_response(transformed_response),
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "widget_id": widget_id,
                    }
                ),
            )
            return transformed_response
        except GeneralException as e:
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.uiac.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.failed.value,
                response={"logs": "", "errors": str(e)},
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "widget_id": widget_id,
                    }
                ),
            )
            raise GeneralException(
                message=e.message,
                status_code=e.status_code,
            )
        except Exception as e:
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.uiac.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.failed.value,
                response={"logs": "", "errors": str(e)},
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "widget_id": widget_id,
                    }
                ),
            )
            raise GeneralException(
                message="The Code execution failed. \n" + str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def action_renderer(self, request, user, request_data={}, serialize_data=False, background_tasks=None):
        execution_start_time = datetime.now()
        executor_endpoint_id = 0
        try:
            injected_lines_count = None
            endpoint = request_data.get("executor_endpoint")
            code_string = request_data.get("code_string")
            app_id = request_data.get("app_id")
            screen_id = request_data.get("screen_id")

            if not (app_id and (code_string or screen_id)):
                raise GeneralException(
                    message="App Id and Widget Id or code_string should be provided",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            app_info = self.app_dao.get_app_by_id(app_id)
            if screen_id:
                app_screen = self.screen_dao.get_app_screen(app_id, screen_id)
            else:
                app_screen = None

            if not app_screen and not code_string:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": CodeExecutionErrors.screen_action_not_found.value},
                )
            (
                (code_string, injected_lines_count),
                action_error_message,
                executor_endpoint,
                executor_endpoint_id,
            ) = get_screen_action_settings(app_info, app_screen, request_data, request, code_string)
            if not code_string:
                # return action_settings
                raise GeneralException(
                    message=action_error_message,
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            elif not (executor_endpoint or endpoint):
                return self.create_response_from_static_output(code_string)

            # TODO: Experimental
            if executor_endpoint and not endpoint:
                endpoint = executor_endpoint

            no_error, response = execute_code_string_exec_env(endpoint, code_string)
            if not no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            no_error, transformed_response = get_data_from_api_response(response)
            if no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + transformed_response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            transformed_response["injected_lines_count"] = injected_lines_count
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.action.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.success.value,
                response=get_logs_errors_time_from_api_response(transformed_response),
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "screen_id": screen_id,
                    }
                ),
            )
            return transformed_response

        except Exception as e:
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.action.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.failed.value,
                response={"logs": "", "errors": str(e)},
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "screen_id": screen_id,
                    }
                ),
            )
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            if type(e) is GeneralException:
                status_code = e.status_code
            raise GeneralException(
                message="The Code execution failed. \n" + str(e),
                status_code=status_code,
            )

    def filter_renderer(self, request, user, request_data={}, serialize_data=False, background_tasks=None):
        execution_start_time = datetime.now()
        executor_endpoint_id = 0
        try:
            injected_lines_count = None
            endpoint = request_data.get("executor_endpoint")
            code_string = request_data.get("code_string")
            app_id = request_data.get("app_id")
            screen_id = request_data.get("screen_id")

            if not (app_id and (code_string or screen_id)):
                raise GeneralException(
                    message="App Id and Widget Id or code_string should be provided",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            app_info = self.app_dao.get_app_by_id(app_id)
            if screen_id:
                app_screen = self.screen_dao.get_app_screen(app_id, screen_id)
            else:
                app_screen = None

            if not app_screen and not code_string:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": CodeExecutionErrors.screen_filter_not_found.value},
                )
            (
                (code_string, injected_lines_count),
                filter_error_message,
                executor_endpoint,
                executor_endpoint_id,
            ) = get_screen_filter_settings(app_info, app_screen, request_data, request, code_string)
            if not code_string:
                # return filter_settings
                raise GeneralException(
                    message=filter_error_message,
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            elif not (executor_endpoint or endpoint):
                return self.create_response_from_static_output(code_string)

            # TODO: Experimental
            if executor_endpoint and not endpoint:
                endpoint = executor_endpoint

            no_error, response = execute_code_string_exec_env(endpoint, code_string)
            if not no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            no_error, transformed_response = get_data_from_api_response(response)
            if no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + transformed_response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            transformed_response["injected_lines_count"] = injected_lines_count
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.filter.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.success.value,
                response=get_logs_errors_time_from_api_response(transformed_response),
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "screen_id": screen_id,
                    }
                ),
            )
            return transformed_response

        except Exception as e:
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.filter.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.failed.value,
                response={"logs": "", "errors": str(e)},
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "screen_id": screen_id,
                    }
                ),
            )
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            if type(e) is GeneralException:
                status_code = e.status_code
            raise GeneralException(
                message="The Code execution failed. \n" + str(e),
                status_code=status_code,
            )

    def widget_filter_renderer(self, request, user, request_data={}, serialize_data=False, background_tasks=None):
        execution_start_time = datetime.now()
        executor_endpoint_id = 0
        try:
            endpoint = request_data.get("executor_endpoint")
            code_string = request_data.get("code_string")
            app_id = request_data.get("app_id")
            screen_id = request_data.get("screen_id")
            widget_id = request_data.get("widget_id")

            if not (app_id and (code_string or screen_id)):
                raise GeneralException(
                    message="App Id and Widget Id or code_string should be provided",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            app_info = self.app_dao.get_app_by_id(app_id)

            if widget_id:
                widget_value = self.widget_dao.get_multiwidgets_by_id(app_id, widget_id, request_data)
                if not widget_value:
                    raise GeneralException(
                        message=CodeExecutionErrors.widget_value_id_not_found.value,
                        status_code=status.HTTP_400_BAD_REQUEST,
                    )
            (
                no_widget_value,
                (code_string, injected_lines_count),
                widget_simulated_value,
                executor_endpoint,
                executor_endpoint_id,
            ) = get_dynamic_widget_code(
                app_info,
                widget_value,
                app_id,
                widget_id,
                request_data,
                request,
                code_string=None,
                widget_filter=True,
            )
            # TODO: Experimental
            if executor_endpoint and not endpoint:
                endpoint = executor_endpoint
            if code_string:
                filter_no_error, filter_response = execute_code_string_exec_env(endpoint, code_string)
            if not filter_no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + filter_response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            filter_no_error, transformed_filter_response = get_data_from_api_response(filter_response)
            if filter_no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + transformed_filter_response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            transformed_filter_response["injected_lines_count"] = injected_lines_count
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.filter.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.success.value,
                response=get_logs_errors_time_from_api_response(transformed_filter_response),
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "screen_id": screen_id,
                    }
                ),
            )
            return transformed_filter_response

        except Exception as e:
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.filter.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.failed.value,
                response={"logs": "", "errors": str(e)},
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "screen_id": screen_id,
                    }
                ),
            )
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            if type(e) is GeneralException:
                status_code = e.status_code
            raise GeneralException(
                message="The Code execution failed. \n" + str(e),
                status_code=status_code,
            )

    def app_function_renderer(
        self,
        request,
        user,
        request_data={},
        serialize_data=False,
        background_tasks=None,
    ):
        execution_start_time = datetime.now()
        executor_endpoint_id = 0
        try:
            injected_lines_count = None
            endpoint = request_data.get("executor_endpoint")
            code_string = request_data.get("code_string")
            current_function = request_data.get("function_value")
            current_function_name = request_data.get("function_name")
            app_id = request_data.get("app_id")
            screen_id = request_data.get("screen_id")

            if not (app_id and (code_string or screen_id)):
                raise GeneralException(
                    message="App Id and Widget Id or code_string should be provided",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            app_info = self.app_dao.get_app_by_id(app_id)

            if app_info and current_function and current_function_name:
                app_info.current_function = {
                    "key": current_function_name,
                    "value": current_function,
                }

            if not code_string:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": "Code not found"},
                )
            (
                (code_string, injected_lines_count),
                app_function_message,
                executor_endpoint,
                executor_endpoint_id,
            ) = get_app_function_settings(app_info, request_data, request, code_string)
            if not code_string:
                # return app_function_message
                raise GeneralException(
                    message=app_function_message,
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            elif not (executor_endpoint or endpoint):
                return self.create_response_from_static_output(code_string)

            # TODO: Experimental
            if executor_endpoint and not endpoint:
                endpoint = executor_endpoint

            no_error, response = execute_code_string_exec_env(endpoint, code_string)
            if not no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            no_error, transformed_response = get_data_from_api_response(response)
            if no_error:
                raise GeneralException(
                    message="The Code execution failed. \n" + transformed_response,
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            transformed_response["injected_lines_count"] = injected_lines_count
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.filter.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.success.value,
                response=get_logs_errors_time_from_api_response(transformed_response),
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "screen_id": screen_id,
                    }
                ),
            )
            return transformed_response

        except Exception as e:
            self.create_exec_log(
                background_tasks,
                user,
                executor_endpoint_id,
                ResourceTypes.filter.value,
                execution_start_time,
                datetime.now(),
                status=CodeExecutionStatus.failed.value,
                response={"logs": "", "errors": str(e)},
                context=json.dumps(
                    {
                        "app_id": app_id,
                        "screen_id": screen_id,
                    }
                ),
            )
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
            if type(e) is GeneralException:
                status_code = e.status_code
            raise GeneralException(
                message="The Code execution failed. \n" + str(e),
                status_code=status_code,
            )
