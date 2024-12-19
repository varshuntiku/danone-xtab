import json
import logging

from api.constants.apps.theme_error_messages import ThemeErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import AppTheme, AppThemeMode
from api.schemas.apps.theme_schema import AddThemeRequestSchema
from fastapi import status


class ThemeDao(BaseDao):
    def get_themes(self) -> AppTheme:
        """
        Get all app themes.

        Args:
            None
        Returns:
            List of AppThemes
        """
        try:
            return self.db_session.query(AppTheme).filter_by(deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_GETTING_THEMES.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def check_theme_by_name(self, theme_name: str) -> int:
        """
        Check if theme with the given name exists

        Args:
            theme_name: str

        Returns:
            Count of themes with given name
        """
        try:
            return self.db_session.query(AppTheme).filter_by(name=theme_name, deleted_at=None).count()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_GETTING_THEME_BY_NAME.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def add_theme(self, request_data: AddThemeRequestSchema) -> AppTheme:
        """
        Add new app theme

        Args:
            request_data: AddThemeRequestSchema

        Returns:
            New app theme
        """
        try:
            theme = AppTheme(
                name=request_data.name,
            )
            self.db_session.add(theme)
            self.db_session.commit()
            return theme
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_ADDING_THEME.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def add_theme_mode(self, request_data=AddThemeRequestSchema):
        """
        Add new app theme mode

        Args:
            request_data: AddThemeRequestSchema

        Returns:
            None
        """
        try:
            add_theme = self.add_theme(request_data)
            for el in request_data.modes:
                app_theme_mode = AppThemeMode(
                    mode=el.mode,
                    bg_variant=el.bg_variant,
                    contrast_color=el.contrast_color,
                    chart_colors=json.dumps(el.chart_colors),
                    params=json.dumps(el.params or {}),
                    app_theme_id=add_theme.id,
                )
                self.db_session.add(app_theme_mode)
            self.db_session.commit()
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_ADDING_THEME_MODE.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
