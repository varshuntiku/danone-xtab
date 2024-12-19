import json
import logging
import sys
from time import time
from typing import Dict, List

from api.constants.apps.screen_error_messages import ScreenErrors
from api.daos.apps.screen_dao import ScreenDao
from api.dtos import GenericResponseDTO
from api.dtos.apps.screen_filters_dto import (
    ArchivedFilterUIACListDTO,
    GetScreenFiltersDTO,
    TestScreenFiltersDTO,
)
from api.middlewares.error_middleware import GeneralException
from api.schemas import GenericResponseSchema
from api.schemas.apps.screen_filters_schema import (
    FiltersResponseSchema,
    PreviewScreenFiltersRequestSchema,
    SaveScreenFiltersRequestSchema,
    ScreenFiltersResponseSchema,
    TestScreenFiltersRequestSchema,
    TestScreenFiltersResponseSchema,
)
from api.services.base_service import BaseService
from api.utils.app.app import sanitize_content
from api.utils.app.screen_filters import get_dynamic_filters_helper
from fastapi import Request, status


class ScreenFiltersService(BaseService):
    def __init__(self):
        super().__init__()
        self.screen_dao = ScreenDao(self.db_session)

    def get_screen_filters(self, app_id: int, screen_id: int) -> ScreenFiltersResponseSchema:
        app_screen = self.screen_dao.get_app_screen(app_id, screen_id)
        if not app_screen:
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        response = False
        if app_screen.screen_filters_value:
            screen_filters = json.loads(app_screen.screen_filters_value)

            if screen_filters and screen_filters.get("is_dynamic", False):
                response = screen_filters.get("code")
        return GetScreenFiltersDTO(response)

    def save_filters_code(
        self, user_id: int, app_id: int, screen_id: int, request_data: SaveScreenFiltersRequestSchema
    ) -> GenericResponseSchema:
        app_screen = self.screen_dao.get_app_screen(app_id, screen_id)
        if not app_screen:
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        incoming_screen_filters_value = {
            "code": request_data.code_string,
            "is_dynamic": True,
        }
        if not request_data.code_string:
            incoming_screen_filters_value = None

        self.screen_dao.save_filters_code(
            app_screen, incoming_screen_filters_value, request_data.screen_filters_open, user_id
        )

        return GenericResponseDTO("success")

    def test_filters(
        self,
        request: Request,
        token: str,
        app_id: int,
        request_data: TestScreenFiltersRequestSchema,
    ) -> TestScreenFiltersResponseSchema:
        try:
            screen_filters = {"code": request_data.code_string}
            start_time = time()

            (
                response_filters,
                response_filter_logs,
                error_lineno,
            ) = get_dynamic_filters_helper(
                request,
                app_id,
                None,
                token,
                json.dumps(screen_filters),
                ({"selected": request_data["selected_filters"]} if "selected_filters" in request_data else {}),
            )

            end_time = time()

            sanitized_response_filters = sanitize_content(response_filters)

            response = {
                "status": "success",
                "timetaken": str(round((end_time - start_time), 2)),
                "size": str(sys.getsizeof(json.dumps(sanitized_response_filters))),
                "output": sanitized_response_filters,
                "logs": response_filter_logs,
                "lineno": error_lineno,
            }

            return TestScreenFiltersDTO(response)
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": "Error executing test filter uiac"},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def preview_filters(
        self,
        request: Request,
        token: str,
        app_id: int,
        request_data: PreviewScreenFiltersRequestSchema,
    ) -> Dict | bool:
        try:
            screen_filters = {"code": request_data.code_string}
            (response_filters, _, _) = get_dynamic_filters_helper(
                request,
                app_id,
                None,
                token,
                json.dumps(screen_filters),
                ({"selected": request_data["selected_filters"]} if "selected_filters" in request_data else {}),
            )

            return sanitize_content(response_filters)

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": "Error executing preview filter uiac"},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_dynamic_filters(
        self,
        request: Request,
        token: str,
        app_id: int,
        screen_id: int,
        request_data: dict,
    ) -> Dict | bool:
        try:
            app_screen = self.screen_dao.get_app_screen(app_id, screen_id)
            if not app_screen:
                raise GeneralException(
                    message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value},
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            screen_filters = app_screen.screen_filters_value

            (new_filters, _, _) = get_dynamic_filters_helper(
                request, app_id, screen_id, token, screen_filters, request_data
            )

            return new_filters
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": "Error getting dynamic filters"},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_archived_filter_uiacs(self, app_id: int) -> List[ArchivedFilterUIACListDTO]:
        data = self.screen_dao.get_archived_filter_uiacs(app_id)
        archived_filters_json = [ArchivedFilterUIACListDTO(record, "filter") for record in data]
        return archived_filters_json

    def get_filters(self, app_id: int, screen_id: int) -> FiltersResponseSchema:
        app_filter_values = self.screen_dao.get_filters(app_id, screen_id)
        response_filter_values = []
        response_filter_topics = {}

        current_value_id = False
        current_values = {}
        for row in app_filter_values:
            if (current_value_id is False) or (row.widget_value_id != current_value_id):
                current_value_id = row.widget_value_id
                if current_values != {} and current_values not in response_filter_values:
                    response_filter_values.append(current_values)
                current_values = {}
            current_values[row.widget_tag_key] = row.widget_tag_value

            if row.widget_tag_key not in response_filter_topics:
                response_filter_topics[row.widget_tag_key] = [row.widget_tag_value]
            elif row.widget_tag_value not in response_filter_topics[row.widget_tag_key]:
                response_filter_topics[row.widget_tag_key].append(row.widget_tag_value)

        if current_values != {}:
            response_filter_values.append(current_values)

        return {"values": response_filter_values, "topics": response_filter_topics}
