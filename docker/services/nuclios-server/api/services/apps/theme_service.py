from typing import List

from api.constants.apps.theme_error_messages import ThemeErrors
from api.constants.apps.theme_success_messages import ThemeSuccess
from api.daos.apps.theme_dao import ThemeDao
from api.dtos.apps.theme_dto import ThemeDTO
from api.helpers.apps.theme_helper import ThemeHelper
from api.middlewares.error_middleware import GeneralException
from api.schemas.apps.theme_schema import (
    AddThemeRequestSchema,
    UpdateThemeRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema, SuccessResponseSchema
from api.services.base_service import BaseService
from fastapi import status


class ThemeService(BaseService):
    def __init__(self):
        super().__init__()
        self.theme_dao = ThemeDao(self.db_session)
        self.theme_helper = ThemeHelper()

    def get_themes(self) -> List[ThemeDTO]:
        """
        Get All APP Themes.
        """
        themes = self.theme_dao.get_themes()
        # sorting so the entries with readonly = True take priority
        sorted_themes = sorted(themes, key=lambda x: (x.readonly is not True), reverse=False)
        filtered_themes = [theme for theme in sorted_themes if len(theme.modes)]
        res = [ThemeDTO(theme) for theme in filtered_themes]
        return res

    def add_theme(self, request_data: AddThemeRequestSchema) -> dict:
        check_theme_exist = self.theme_dao.check_theme_by_name(request_data.name)
        if check_theme_exist > 0:
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_THEME_NAME_EXISTS.value},
                status_code=status.HTTP_409_CONFLICT,
            )

        new_theme = self.theme_dao.add_theme(request_data)
        self.theme_dao.add_theme_mode(request_data, new_theme.id)
        return {"id": new_theme.id}

    def get_theme_by_id(self, theme_id: int) -> ThemeDTO:
        theme = self.theme_dao.get_theme_by_id(theme_id)
        if theme is None:
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_THEME_NOT_FOUND.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return ThemeDTO(theme)

    def delete_theme(self, theme_id: int) -> SuccessResponseSchema:
        theme = self.theme_dao.get_theme_by_id(theme_id)
        if theme is None:
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_THEME_NOT_FOUND.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        if theme.readonly:
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_THEME_READONLY.value},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        if not theme.deleted_at:
            self.theme_dao.delete_theme(theme_id)
        return {"success": ThemeSuccess.DELETE_THEME_SUCCESS.value}

    def update_app_theme(self, theme_id: int, request_data: UpdateThemeRequestSchema) -> MessageResponseSchema:
        theme = self.theme_dao.get_theme_by_id(theme_id)
        if theme is None:
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_THEME_NOT_FOUND.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        theme_name_exists = self.theme_dao.check_other_theme_by_name_exists(theme_id, request_data.name)
        if theme_name_exists:
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_THEME_NAME_EXISTS.value},
                status_code=status.HTTP_409_CONFLICT,
            )
        self.theme_dao.update_theme(theme_id, request_data)
        return {"message": ThemeSuccess.UPDATE_THEME_SUCCESS.value}

    def get_apps_by_theme_id(self, theme_id: int) -> List:
        app = self.theme_dao.get_apps_by_theme_id(theme_id)
        app_ids = [app.id for app in app]
        return app_ids
