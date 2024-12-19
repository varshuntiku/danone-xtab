import json
import logging
from typing import List

from api.constants.apps.screen_error_messages import ScreenErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import AppScreen, AppScreenWidget
from api.schemas.apps.screen_schema import (
    ScreenSchema,
    UpdateScreenOverviewRequestSchema,
)
from fastapi import status
from sqlalchemy.sql import asc, func


class ScreenDao(BaseDao):
    def perform_rollback(self):
        """
        Perform rollback if an error occured
        """
        return super().perform_rollback()

    def perform_commit(self):
        """
        Perform commit after all necessary operation are completed without error
        """
        return super().perform_commit()

    # Let's remove/update this once we work on overview api
    def get_overview_detail(self, app_id: int, screen_id: int) -> AppScreen:
        """
        Gets overview information by screen id

        Args:
            app_id: int
            screen_id: int

        Returns:
            App screen
        """
        try:
            return self.db_session.query(AppScreen).filter_by(id=screen_id, app_id=app_id).first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message={"error": ScreenErrors.GET_OVERVIEW_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_screens_by_app_id(self, app_id: int) -> List[AppScreen]:
        """
        Gets the app screens for given the app id

        Args:
            app_id: app id

        Returns:
            List of app screens
        """
        try:
            return (
                self.db_session.query(AppScreen)
                .filter_by(app_id=app_id, deleted_at=None)
                .order_by(asc(AppScreen.screen_index))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message={"error": ScreenErrors.GET_SCREENS_BY_APP_ID_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_screen_by_id(self, id: int) -> AppScreen:
        """
        Gets the app screen given the screen id

        Args:
            id: app screen id

        Returns:
            app screen object
        """
        try:
            return self.db_session.query(AppScreen).filter_by(id=id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message={"error": ScreenErrors.GET_SCREEN_BY_ID_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_screen(self, user_id: int, app_screen: AppScreen) -> None:
        """
        Deletes the provided app screen

        Args:
            user_id: id of the user deleting the app screen
            app_screen: app_screen being deleted
        """
        try:
            app_screen.deleted_at = func.now()
            app_screen.deleted_by = user_id
            self.db_session.flush()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message={"error": ScreenErrors.DELETE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_screen(
        self, user_id: int, app_id: int, screen_index: int, app_screen: AppScreen, screen_details: ScreenSchema
    ) -> None:
        """
        Updates app screen details

        Args:
            user_id: id of the user updating the app screen
            screen_index: new screen_index of the screen
            app_screen: screen being updated
            screen_details: info to be updated for the given screen
        """
        try:
            app_screen.app_id = app_id
            app_screen.screen_index = screen_index
            app_screen.screen_name = screen_details.name
            app_screen.level = screen_details.level
            app_screen.hidden = screen_details.hidden
            app_screen.updated_at = func.now()
            app_screen.updated_by = user_id
            self.db_session.flush()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message={"error": ScreenErrors.UPDATE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_screen_overview(
        self,
        user_id: int,
        app_id: int,
        screen_id: int,
        screen_overview_details: UpdateScreenOverviewRequestSchema,
    ) -> None:
        """
        Updates app screen overview

        Args:
            user_id: id of the user updating the app screen
            app_id: app id
            screen_id: id of the screen for which overview is to be updated
            request_data: UpdateScreenOverviewRequestSchema
        """
        try:
            app_screen = self.get_app_screen(app_id, screen_id)
            app_screen.screen_description = screen_overview_details.screen_description
            app_screen.screen_image = screen_overview_details.screen_image
            app_screen.screen_auto_refresh = screen_overview_details.screen_auto_refresh
            app_screen.rating_url = screen_overview_details.rating_url
            app_screen.updated_by = user_id
            app_screen.updated_at = func.now()

            self.db_session.commit()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message={"error": ScreenErrors.UPDATE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_screen(
        self,
        user_id: int,
        app_id: int,
        screen_index: int,
        screen_details: ScreenSchema,
    ) -> None:
        """
        Create new app screen

        Args:
            user_id: id of the user creating the app screen
            app_id: id of the app this screen will be linked to
            screen_index: screen_index of the new screen
            screen_details: information to be added to the new screen
        """
        try:
            new_screen = AppScreen(
                app_id=app_id,
                screen_index=screen_index,
                screen_name=screen_details.name,
                screen_description=None,
                screen_filters_open=None,
                screen_auto_refresh=None,
                screen_image=None,
                level=screen_details.level,
                graph_type=None,
                horizontal=None,
                screen_filters_value=None,
                action_settings=None,
                hidden=screen_details.hidden,
                created_by=user_id,
            )
            self.db_session.add(new_screen)
            self.db_session.flush()
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.CREATE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_app_screen(self, app_id: int, screen_id: int) -> AppScreen:
        """
        Gets the app screen given the app id and screen id

        Args:
            app_id: app id
            screen_id: app screen id

        Returns:
            app screen object
        """
        try:
            return self.db_session.query(AppScreen).filter_by(app_id=app_id, id=screen_id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScreenErrors.APP_SCREEN_BY_ID_ERROR.value},
            )

    def update_app_screen_actions(self, screen_id: int, user_id: int, action_settings: dict) -> AppScreen:
        """
        Updates app screen actions

        Args:
            screen_id: app screen id
            user_id: id of the user updating the app screen
            action_settings: the action setings of the screen

        Returns:
            updated app screen object
        """
        try:
            app_screen = self.get_screen_by_id(screen_id)

            app_screen.action_settings = action_settings
            app_screen.updated_by = user_id

            self.db_session.commit()
            return app_screen
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_UPDATE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def count_app_screen_widget_by_screen_id(self, screen_id: int) -> int:
        """
        Get count of app screen widgets by screen id

        Args:
            screen_id: int

        Returns:
            Returns count of screen widgets related to a screen
        """
        try:
            return self.db_session.query(AppScreenWidget).filter_by(screen_id=screen_id, deleted_at=None).count()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScreenErrors.COUNT_SCREEN_WIDGET_ERROR.value},
            )

    def save_filters_code(
        self, app_screen: AppScreen, screen_filters_value: dict, screen_filter_open: bool, user_id: int
    ) -> None:
        """
        Get count of app screen widgets by screen id

        Args:
            app_screen: screen whose filter uiac is to be updated
            screen_filters_value: new value for filter uiac to be saved
            screen_filter_open: bool
            user_id: id of the user updating the filters
        """
        try:
            app_screen.screen_filters_value = json.dumps(screen_filters_value) if screen_filters_value else None
            app_screen.screen_filter_open = screen_filter_open if screen_filter_open else False
            app_screen.updated_by = user_id
            app_screen.updated_at = func.now()

            self.perform_commit()
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScreenErrors.SAVE_SCREEN_FILTER_ERROR.value},
            )

    def update_screen_layout_details(
        self, id: int, graph_type: str, horizontal: bool | None, user_id: int
    ) -> AppScreen:
        """
        Updates app screen layout details

        Args:
            id: screen id
            graph_type: the layout's graph type
            horizontal: flag telling whether it's a horizontal layout
            user_id: id of the user updating the app screen layout

        Returns:
            App screen object
        """
        try:
            app_screen = self.get_screen_by_id(id)
            if app_screen:
                app_screen.graph_type = graph_type
                app_screen.horizontal = horizontal
                app_screen.updated_by = user_id
                app_screen.updated_at = func.now()
                self.db_session.commit()
            return app_screen
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.UPDATE_SCREEN_LAYOUT_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
