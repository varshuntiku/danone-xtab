from typing import Dict, List

from api.controllers.base_controller import BaseController
from api.schemas import GenericResponseSchema
from api.schemas.apps.screen_filters_schema import (
    FiltersResponseSchema,
    GetArchivedFilterUIACListResponseSchema,
    PreviewScreenFiltersRequestSchema,
    SaveScreenFiltersRequestSchema,
    ScreenFiltersResponseSchema,
    TestScreenFiltersRequestSchema,
    TestScreenFiltersResponseSchema,
)
from api.services.apps.screen_filters_service import ScreenFiltersService
from fastapi import Request


class ScreenFiltersController(BaseController):
    def get_screen_filters(self, app_id: int, screen_id: int) -> ScreenFiltersResponseSchema:
        with ScreenFiltersService() as screen_filters_service:
            response = screen_filters_service.get_screen_filters(app_id, screen_id)
            return self.get_serialized_data(ScreenFiltersResponseSchema, response)

    def save_filters_code(
        self, user_id: int, app_id: int, screen_id: int, request_data: SaveScreenFiltersRequestSchema
    ) -> GenericResponseSchema:
        with ScreenFiltersService() as screen_filters_service:
            response = screen_filters_service.save_filters_code(user_id, app_id, screen_id, request_data)
            return self.get_serialized_data(GenericResponseSchema, response)

    def test_filters(
        self,
        request: Request,
        token: str,
        app_id: int,
        request_data: TestScreenFiltersRequestSchema,
    ) -> TestScreenFiltersResponseSchema:
        with ScreenFiltersService() as screen_filters_service:
            response = screen_filters_service.test_filters(request, token, app_id, request_data)
            return self.get_serialized_data(TestScreenFiltersResponseSchema, response)

    def preview_filters(
        self,
        request: Request,
        token: str,
        app_id: int,
        request_data: PreviewScreenFiltersRequestSchema,
    ) -> Dict | bool:
        with ScreenFiltersService() as screen_filters_service:
            response = screen_filters_service.preview_filters(request, token, app_id, request_data)
            return response

    def get_dynamic_filters(
        self,
        request: Request,
        token: str,
        app_id: int,
        screen_id: int,
        request_data: dict,
    ) -> Dict | bool:
        with ScreenFiltersService() as screen_filters_service:
            response = screen_filters_service.get_dynamic_filters(request, token, app_id, screen_id, request_data)
            return response

    def get_archived_filter_uiacs(self, app_id: int) -> List[GetArchivedFilterUIACListResponseSchema]:
        with ScreenFiltersService() as screen_filters_service:
            archived_filters_uiac_list = screen_filters_service.get_archived_filter_uiacs(app_id)
            return self.get_serialized_list(GetArchivedFilterUIACListResponseSchema, archived_filters_uiac_list)

    def get_filters(self, app_id: int, screen_id: int) -> FiltersResponseSchema:
        with ScreenFiltersService() as screen_filters_service:
            return screen_filters_service.get_filters(app_id, screen_id)
