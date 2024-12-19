import json
import logging
from typing import Dict, List

from api.constants.apps.theme_error_messages import ThemeErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import App, AppTheme, AppThemeMode
from api.schemas.apps.theme_schema import (
    AddThemeRequestSchema,
    UpdateThemeRequestSchema,
)
from fastapi import status
from sqlalchemy import and_, desc
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class ThemeDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_themes(self) -> AppTheme:
        """
        Get all app themes.

        Args:
            None
        Returns:
            List of AppThemes
        """
        try:
            return self.db_session.query(AppTheme).filter_by(deleted_at=None).order_by(desc(AppTheme.readonly)).all()
        except Exception as e:
            logging.exception(e)
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
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_GETTING_THEME_BY_NAME.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def check_other_theme_by_name_exists(self, theme_id: int, theme_name: str) -> int:
        """
        Check if other theme with the given name exists

        Args:
            theme_id: int
            theme_name: str

        Returns:
            Count of themes with given name
        """
        try:
            return (
                self.db_session.query(AppTheme)
                .filter(and_(AppTheme.id != theme_id, AppTheme.name == theme_name))
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_GETTING_THEME_BY_NAME.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_theme_by_id(self, theme_id: int) -> AppTheme:
        """
        Get app theme by id

        Args:
            theme_id: id

        Returns:
            App theme object
        """
        try:
            return self.db_session.query(AppTheme).filter_by(id=theme_id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_GETTING_THEME_BY_ID.value},
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
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_ADDING_THEME.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def add_theme_mode(self, request_data: AddThemeRequestSchema, theme_id: int):
        """
        Add new app theme mode

        Args:
            request_data: AddThemeRequestSchema
            theme_id: theme's id to be updated

        Returns:
            None
        """
        try:
            for el in request_data.modes:
                app_theme_mode = AppThemeMode(
                    mode=el.mode,
                    bg_variant=el.bg_variant,
                    contrast_color=el.contrast_color,
                    chart_colors=json.dumps(el.chart_colors),
                    params=json.dumps(el.params or {}),
                    app_theme_id=theme_id,
                )
                self.db_session.add(app_theme_mode)
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_ADDING_THEME_MODE.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_theme(self, theme_id: int) -> Dict:
        """
        Delete app theme by id

        Args:
            theme_id: id

        Returns:
            Success dict
        """
        try:
            app_theme = self.db_session.query(AppTheme).filter_by(id=theme_id).first()
            app_theme.deleted_at = func.now()
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_DELETE_THEME.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_theme(self, theme_id: int, request_data: UpdateThemeRequestSchema) -> Dict:
        """
        Update app theme by id

        Args:
            theme_id: theme id
            request_data

        Returns:
            Success dict
        """
        try:
            app_theme = self.db_session.query(AppTheme).filter_by(id=theme_id).first()
            app_theme.name = request_data.name
            for new_mode in request_data.modes:
                mode = next((item for item in app_theme.modes if item.mode == new_mode["mode"]), None)
                if mode:
                    mode.bg_variant = new_mode["bg_variant"]
                    mode.contrast_color = new_mode["contrast_color"]
                    mode.chart_colors = json.dumps(new_mode["chart_colors"])
                    mode.params = json.dumps(new_mode["params"] or {})

            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_UPDATE_THEME.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_apps_by_theme_id(self, theme_id: int) -> List:
        """
        Get apps by theme id

        Args:
            theme_id: theme id
        Returns:
            List of apps
        """
        try:
            return self.db_session.query(App).filter(App.theme_id == theme_id, App.deleted_at.is_(None)).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": ThemeErrors.ERROR_GETTING_APPS_BY_THEME_ID.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
