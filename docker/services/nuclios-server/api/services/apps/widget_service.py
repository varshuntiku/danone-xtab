import html
import json
import logging
import sys
from time import time
from typing import List

from api.constants.apps.app_error_messages import AppErrors
from api.constants.apps.widget_error_messages import WidgetErrors
from api.constants.apps.widget_success_messages import WidgetSuccess
from api.constants.error_messages import GeneralErrors
from api.daos.apps.app_dao import AppDao
from api.daos.apps.screen_dao import ScreenDao
from api.daos.apps.widget_dao import WidgetDao
from api.dtos.apps.widget_dto import ArchivedUiacListDTO, WidgetDTO
from api.helpers.alerts_notifications.alerts_helper import AlertsHelper
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import User
from api.schemas.apps.widget_schema import (
    GeneralWidgetResponseSchema,
    GetMultiWidgetRequestSchema,
    GetMultiWidgetResponseSchema,
    GetWidgetRequestSchema,
    GetWidgetResponseSchema,
    GetWidgetUiacResponseSchema,
    SaveWidgetConfigRequestSchema,
    SaveWidgetRequestSchema,
    SaveWidgetResponseSchema,
    SaveWidgetUiacRequestSchema,
    TestWidgetVisualizationRequestSchema,
    TestWidgetVisualizationResponseSchema,
    UpdateWidgetConnSystemIdentifierRequestSchema,
)
from api.schemas.generic_schema import StatusDataResponseSchema, SuccessResponseSchema
from api.services.base_service import BaseService
from api.utils.app.app import sanitize_content
from api.utils.app.screen_filters import get_dynamic_filters_helper
from api.utils.app.widget import get_dynamic_widgets
from fastapi import Request, Response, status


class WidgetService(BaseService):
    def __init__(self):
        super().__init__()
        self.widget_dao = WidgetDao(self.db_session)
        self.screen_dao = ScreenDao(self.db_session)
        self.app_dao = AppDao(self.db_session)
        self.alerts_helper = AlertsHelper(self.db_session)

    def get_widgets(self, app_id: int, screen_id: int, response: Response) -> List[WidgetDTO]:
        widget_list, count = self.widget_dao.get_widgets_by_app_screen_ids(app_id, screen_id)
        result = [WidgetDTO(widget) for widget in widget_list]
        response.headers["content-type"] = "application/json"
        response.headers["X-Total-Count"] = html.escape(str(count))
        response.headers["Access-Control-Expose-Headers"] = "Content-Type, X-Total-Count"
        return result

    def save_widgets(
        self, user_id: int, app_id: int, screen_id: int, request_data: SaveWidgetRequestSchema
    ) -> SaveWidgetResponseSchema:
        try:
            selected_layout = getattr(request_data, "selected_layout")
            graph_type = selected_layout["graph_type"] if "graph_type" in selected_layout else None
            horizontal = selected_layout["horizontal"] if "horizontal" in selected_layout else None
            graph_width = selected_layout["graph_width"] if "graph_width" in selected_layout else None
            graph_height = selected_layout["graph_height"] if "graph_height" in selected_layout else None
            self.screen_dao.update_screen_layout_details(
                id=screen_id,
                graph_type=graph_type,
                horizontal=horizontal,
                graph_width=graph_width,
                graph_height=graph_height,
                user_id=user_id,
            )

            request_widget_ids = []
            for widget_item in getattr(request_data, "widgets"):
                if str(widget_item["id"]).startswith("new_"):
                    pass
                else:
                    request_widget_ids.append(widget_item["id"])

            app_screen_widgets = self.widget_dao.get_widgets_by_screen_id(screen_id=screen_id)
            for app_screen_widget in app_screen_widgets:
                if app_screen_widget.id in request_widget_ids:
                    pass
                else:
                    self.widget_dao.delete_widget(user_id=user_id, app_screen_widget=app_screen_widget)

            for widget_item in getattr(request_data, "widgets"):
                if str(widget_item["id"]).startswith("new_"):
                    self.widget_dao.add_widget(
                        app_id=app_id,
                        screen_id=screen_id,
                        widget_index=widget_item["widget_index"],
                        widget_key=widget_item.get("config", {}).get("title", ""),
                        is_label=widget_item["is_label"],
                        config=json.dumps(widget_item["config"]),
                        user_id=user_id,
                    )
                else:
                    self.widget_dao.update_widget(
                        id=widget_item["id"],
                        config=json.dumps(widget_item["config"]),
                        widget_key=widget_item.get("config", {}).get("title", ""),
                        user_id=user_id,
                    )
            app_screen_widgets, _ = self.widget_dao.get_widgets_by_app_screen_ids(app_id, screen_id)

            return {
                "status": "success",
                "widgets": [WidgetDTO(widget) for widget in app_screen_widgets],
            }
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.SAVE_LAYOUT_ERROR.value + " " + str(e)},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def save_widget_config(
        self, user_id: int, widget_id: int, request_data: SaveWidgetConfigRequestSchema
    ) -> GeneralWidgetResponseSchema:
        config = getattr(request_data, "config", {})
        self.widget_dao.update_widget(
            id=widget_id,
            config=json.dumps(config),
            widget_key=config.get("title", ""),
            user_id=user_id,
        )

        return {"status": "success"}

    def test_visualization(
        self, app_id: int, request_data: TestWidgetVisualizationRequestSchema, request: Request
    ) -> TestWidgetVisualizationResponseSchema:
        try:
            start_time = time()
            access_token = request.headers.get("authorization", None)
            widget_value_json, run_logs, error_lineno = get_dynamic_widgets(
                app_id,
                None,
                access_token,
                getattr(request_data, "filters", {}),
                getattr(request_data, "code", ""),
                None,
                request=request,
            )
            end_time = time()

            sanitized_widget_value_json = sanitize_content(widget_value_json)

            response_data = {
                "status": "success",
                "timetaken": str(round((end_time - start_time), 2)),
                "size": str(sys.getsizeof(sanitized_widget_value_json)),
                "output": json.loads(sanitized_widget_value_json),
                "logs": str(run_logs),
                "lineno": error_lineno,
            }
            return response_data
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

    def save_widget_uiac(
        self, user_id: int, app_id: int, screen_id: int, widget_id: int, request_data: SaveWidgetUiacRequestSchema
    ) -> GeneralWidgetResponseSchema:
        try:
            _widget_value = self.widget_dao.get_widget_value_by_ids(
                app_id=app_id, screen_id=screen_id, widget_id=widget_id
            )

            incoming_widget_value = {
                "is_dynamic": True,
                "code": getattr(request_data, "code", None),
            }
            if incoming_widget_value["code"] is None:
                incoming_widget_value = None
            incoming_widget_filter_value = {
                "code": getattr(request_data, "filter_code", None),
            }
            if incoming_widget_filter_value["code"] is None:
                incoming_widget_filter_value = None

            if _widget_value:
                self.widget_dao.update_widget_value(
                    app_id=app_id,
                    screen_id=screen_id,
                    widget_id=widget_id,
                    user_id=user_id,
                    widget_value_code=json.dumps(incoming_widget_value) if incoming_widget_value else None,
                    widget_filter_value_code=json.dumps(incoming_widget_filter_value)
                    if incoming_widget_filter_value
                    else None,
                )
                other_widget_values = self.widget_dao.get_all_filtered_widget_values_by_ids(
                    app_id=app_id, screen_id=screen_id, widget_id=widget_id, widget_value_id=_widget_value.id
                )
                for owv in other_widget_values:
                    self.widget_dao.delete_widget_value(user_id=user_id, widget_value=owv)
            else:
                self.widget_dao.add_widget_value(
                    app_id=app_id,
                    screen_id=screen_id,
                    widget_id=widget_id,
                    user_id=user_id,
                    widget_value_code=json.dumps(incoming_widget_value) if incoming_widget_value else None,
                    widget_filter_value_code=json.dumps(incoming_widget_value) if incoming_widget_value else None,
                    widget_simulated_value=None,
                )

            return {"status": "success"}
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": WidgetErrors.SAVE_UIAC_ERROR.value},
            )

    def get_archived_uiacs(self, app_id: int) -> List[ArchivedUiacListDTO]:
        data = self.widget_dao.get_archived_uiacs(app_id)
        widget_values_json = [ArchivedUiacListDTO(record, "widget") for record in data]
        return widget_values_json

    async def get_multi_widget(
        self,
        app_id: int,
        screen_id: int,
        access_token: str,
        request_data: GetMultiWidgetRequestSchema,
        request: Request,
    ) -> GetMultiWidgetResponseSchema:
        try:
            logging.info(
                f"Multi-Widget API: appId: {app_id}, widget_id: {request_data.widget.id}, user: {request.state.logged_in_email}"
            )
            app = self.app_dao.get_app_by_id(app_id)
            if app is None:
                raise GeneralException(
                    message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                    status_code=status.HTTP_404_NOT_FOUND,
                )

            app_modules = json.loads(app.modules)
            widget_value = self.widget_dao.get_multiwidgets_by_id(app_id, screen_id, request_data)
            if widget_value:
                widget_value_id = widget_value.id
                widget_simulated_value = widget_value.widget_simulated_value
                widget_value_code = widget_value.widget_value
                widget_filter_code = widget_value.widget_filter_value if widget_value.widget_filter_value else None
                # If code fragment get dynamic data

                widget_filter_json = json.loads(widget_filter_code) if widget_filter_code else None
                widget_json = json.loads(widget_value_code)
                try:
                    if widget_json.get("is_dynamic", False) and widget_json["code"] and widget_json["code"] != "":
                        widget_value, _, _ = get_dynamic_widgets(
                            app_id=app_id,
                            widget_id=request_data.widget.id,
                            access_token=access_token,
                            filters=request_data.filters,
                            widget_code=widget_json["code"],
                            data_state_key=getattr(request_data, "data_state_key", None),
                            widget_event=getattr(request_data, "widget_event", None),
                            request=request,
                            prev_screen_data=getattr(request_data, "prev_screen_data", None),
                        )
                    if widget_filter_json:
                        if widget_filter_json["code"] and widget_filter_json["code"] != "":
                            widget_filter_value, _, _ = get_dynamic_widgets(
                                app_id=app_id,
                                widget_id=request_data.widget.id,
                                access_token=access_token,
                                filters={},
                                widget_code=widget_filter_json["code"],
                                data_state_key=getattr(request_data, "data_state_key", None),
                                request=request,
                            )
                        else:
                            widget_filter_value = None
                    else:
                        widget_filter_value = None
                except Exception as error_msg:
                    logging.exception(error_msg)
                    raise GeneralException(
                        status.HTTP_422_UNPROCESSABLE_ENTITY,
                        message={"error": WidgetErrors.PARSE_UIAC_ERROR.value},
                    )

            else:
                widget_value = False
                widget_simulated_value = False
                widget_value_id = None
                widget_filter_value = None
            try:
                widget_value = json.loads(widget_value) if widget_value else widget_value
                widget_simulated_value = (
                    json.loads(widget_simulated_value) if widget_simulated_value else widget_simulated_value
                )
                widget_filter_value = json.loads(widget_filter_value) if widget_filter_value else widget_filter_value
            except Exception as error_msg:
                logging.exception(error_msg)

            if app_modules.get("alerts", False) and widget_value and widget_value.get("alert_config", False):
                await self.alerts_helper.notification_data(
                    app_id, request_data.widget.id, widget_value, request.state.user
                )

            res = {
                "data": {
                    "widget_value_id": widget_value_id,
                    "value": widget_value,
                    "simulated_value": widget_simulated_value,
                    "filter_value": widget_filter_value,
                }
            }
            return res
        except Exception as error_msg:
            logging.exception(error_msg)
            logging.info(
                f"Error occuerd, Multi-Widget API: appId: {app_id}, widget_id: {request_data.widget.id}, user: {request.state.logged_in_email}, Error: {error_msg}"
            )
            if error_msg.exception_type == "General Exception":
                raise GeneralException(status_code=error_msg.status_code, message=error_msg.message)
            else:
                raise GeneralException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    message={"error": WidgetErrors.PROCESS_WIDGET_ERROR.value},
                )

    async def get_widget(
        self,
        app_id: int,
        screen_id: int,
        access_token: str,
        request_data: GetWidgetRequestSchema,
        user: User,
        request: Request,
    ) -> GetWidgetResponseSchema:
        try:
            app = self.app_dao.get_app_by_id(app_id)
            if app is None:
                raise GeneralException(
                    message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            app_modules = json.loads(app.modules)
            widget_value = self.widget_dao.get_widget_value_by_app_and_screen(app_id, screen_id, request_data)
            if widget_value:
                widget_value_id = widget_value.id
                widget_simulated_value = widget_value.widget_simulated_value
                widget_value = widget_value.widget_value
                # If code fragment get dynamic data
                try:
                    widget_json = ""
                    try:  # for handling number or just string KPIs like 'xx M' or 'xx.y /xx.y'
                        widget_json = json.loads(widget_value)
                    except Exception:
                        widget_json = widget_value
                    if type(widget_json) is not dict:
                        raise GeneralException(
                            message={"error": WidgetErrors.JUST_KPI_ERROR.value},
                            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        )
                    if widget_json.get("is_dynamic", False):
                        widget_value, logs, error_lineno = get_dynamic_widgets(
                            app_id=app_id,
                            widget_id=request_data.widget["id"],
                            access_token=access_token,
                            filters=request_data.filters,
                            widget_code=widget_json["code"],
                            data_state_key=getattr(request_data, "data_state_key", None),
                            widget_event=getattr(request_data, "widget_event", None),
                            request=request,
                        )
                    else:
                        raise GeneralException(
                            message={"error": WidgetErrors.DYNAMIC_WIDGET_DATA_ERROR.value},
                            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        )
                except Exception:
                    pass
            else:
                widget_value = False
                widget_simulated_value = False
                widget_value_id = None
            if widget_value_id is not None:
                widget_id = self.widget_dao.get_widget_id_by_value_id(widget_value_id)

            try:
                try:
                    widget_value = json.loads(widget_value)
                except Exception:
                    widget_value = widget_value
                widget_simulated_value = json.loads(widget_simulated_value) if widget_simulated_value else False
            except Exception as error_msg:
                logging.exception(error_msg)
                widget_simulated_value = False

            if app_modules.get("alerts", False) and widget_value and widget_value.get("alert_config", False):
                await self.alerts_helper.notification_data(app_id, widget_id, widget_value, user)
            response = {
                "data": {
                    "widget_value_id": widget_value_id,
                    "value": widget_value,
                    "simulated_value": widget_simulated_value,
                }
            }
            return response

        except Exception as error_msg:
            logging.exception(error_msg)
            if error_msg.exception_type == "General Exception":
                raise GeneralException(status_code=error_msg.status_code, message=error_msg.message)
            else:
                raise GeneralException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    message={"error": WidgetErrors.PROCESS_WIDGET_ERROR.value},
                )

    def get_widget_uiac(self, app_id: int, screen_id: int, widget_id: int) -> GetWidgetUiacResponseSchema:
        widget_value = self.widget_dao.get_unordered_widget_value_by_ids(
            app_id=app_id, screen_id=screen_id, widget_id=widget_id
        )
        response = {}

        if widget_value and widget_value.widget_value:
            widget_value_code = json.loads(widget_value.widget_value)
            if widget_value_code.get("is_dynamic"):
                response["code"] = widget_value_code.get("code")
            if widget_value.widget_filter_value:
                widget_filter_value = json.loads(widget_value.widget_filter_value)
                response["filter_code"] = widget_filter_value.get("code")

        return response

    def get_screen_widget(self, app_id: int, screen_id: int, widget_id: int) -> StatusDataResponseSchema:
        app_screen_widget = self.widget_dao.get_widget_by_id(widget_id)
        widget_val = self.widget_dao.get_unordered_widget_value_by_ids(app_id, screen_id, widget_id)
        response = json.loads(app_screen_widget.config) if app_screen_widget.config else {}
        if widget_val and widget_val.widget_value:
            widget_val = json.loads(widget_val.widget_value)
            if widget_val.get("is_dynamic"):
                response["code"] = widget_val.get("code")
        return {"status": "success", "data": response}

    def update_widget_conn_systems_identifier(
        self, app_id: int, widget_id: int, request_data: UpdateWidgetConnSystemIdentifierRequestSchema
    ) -> SuccessResponseSchema:
        for key, row_data in request_data.root.items():
            item = self.widget_dao.get_widget_connected_system_identifier_by_id(row_data.id)
            if item is None:
                check_duplicate = self.widget_dao.check_duplicate_widget_system_connected_identifier(
                    app_id, widget_id, row_data
                )
                if check_duplicate is None:
                    if (
                        row_data.dashboard_id is None
                        or row_data.problem_definition_id is None
                        or row_data.business_process_id is None
                    ):
                        raise GeneralException(
                            status.HTTP_200_OK, message={"error": GeneralErrors.SAVE_EMPTY_VALUE_ERROR.value}
                        )
                    else:
                        self.widget_dao.add_duplicate_widget_system_connected_identifier(row_data, app_id, widget_id)
                else:
                    raise GeneralException(
                        status.HTTP_422_UNPROCESSABLE_ENTITY,
                        message={"error": WidgetErrors.ALREADY_EXIST_KPI_ERROR.value},
                    )
            else:
                self.widget_dao.update_duplicate_widget_system_connected_identifier(row_data)

        return {"success": WidgetSuccess.UPDATE_WIDGET_IDENTIFIER_SUCCESS.value}

    def get_widget_dynamic_filters(
        self,
        request: Request,
        token: str,
        app_id: str,
        screen_id: str,
        widget_id: str,
        request_data: dict,
    ) -> dict | bool:
        try:
            widget_value = self.widget_dao.get_widget_value_by_ids(
                app_id=app_id, screen_id=screen_id, widget_id=widget_id
            )
            if not widget_value:
                raise GeneralException(
                    message={"error": "widget not found"},
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            widget_filter_value = widget_value.widget_filter_value
            (new_filters, _, _) = get_dynamic_filters_helper(
                request, app_id, screen_id, token, widget_filter_value, request_data
            )
            return new_filters
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": "Error getting dynamic filters"},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
