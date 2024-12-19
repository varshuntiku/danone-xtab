from typing import Dict, List

from api.controllers.base_controller import BaseController
from api.dtos.apps.theme_dto import ThemeDTO
from api.schemas.apps.theme_schema import (
    AddThemeRequestSchema,
    GetThemeByIdResponseSchema,
    UpdateThemeRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema, SuccessResponseSchema
from api.services.apps.theme_service import ThemeService


class ThemeController(BaseController):
    def get_themes(self) -> List[ThemeDTO]:
        with ThemeService() as theme_service:
            themes = theme_service.get_themes()
            return themes

    def add_theme(self, request_data: AddThemeRequestSchema) -> Dict:
        with ThemeService() as theme_service:
            theme = theme_service.add_theme(request_data)
            return theme

    def get_theme_by_id(self, theme_id: int) -> GetThemeByIdResponseSchema:
        with ThemeService() as theme_service:
            theme = theme_service.get_theme_by_id(theme_id)
            return theme

    def delete_theme(self, theme_id: int) -> SuccessResponseSchema:
        with ThemeService() as theme_service:
            theme = theme_service.delete_theme(theme_id)
            return theme

    def update_app_theme(self, theme_id: int, request_data: UpdateThemeRequestSchema) -> MessageResponseSchema:
        with ThemeService() as theme_service:
            theme = theme_service.update_app_theme(theme_id, request_data)
            return theme

    def get_apps_by_theme_id(self, theme_id: int) -> List:
        with ThemeService() as theme_service:
            apps = theme_service.get_apps_by_theme_id(theme_id)
            return apps
