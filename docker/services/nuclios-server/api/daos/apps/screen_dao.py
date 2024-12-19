import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, List

from api.constants.apps.screen_error_messages import ScreenErrors
from api.constants.error_messages import GeneralErrors
from api.daos.base_daos import BaseDao
from api.dtos.apps.screen_filters_dto import ArchivedFilterUIACListDTO
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    AppScreen,
    AppScreenWidget,
    AppScreenWidgetFilterValue,
    CustomLayout,
)
from api.schemas.apps.ai_response_schema import SaveAiInsightRequestSchema
from api.schemas.apps.screen_schema import (
    InsertLayoutOptionsRequestResponse,
    ScreenSchema,
    UpdateLayoutOptionsRequestResponse,
    UpdateScreenComment,
    UpdateScreenOverviewRequestSchema,
)
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_, asc, desc, func


class ScreenDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

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
            resp = self.db_session.query(AppScreen).filter_by(id=screen_id, app_id=app_id).first()
            return resp
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.GET_OVERVIEW_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def set_comment_state(self, app_id: int, screen_id: int, request_data: UpdateScreenComment) -> AppScreen:
        """
        Updates the comment_enabled state for a specific screen.

        Args:
            app_id: int
            screen_id: int
            request_data: UpdateScreenComment

        Returns:
            App screen
        """
        try:
            app_screen = self.db_session.query(AppScreen).filter_by(id=screen_id, app_id=app_id).first()
            if not app_screen:
                raise GeneralException(
                    message={"error": ScreenErrors.SCREEN_NOT_FOUND.value},
                    status_code=status.HTTP_404_NOT_FOUND,
                )

            app_screen.comment_enabled = request_data.state
            self.db_session.commit()
            return request_data.state is True

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
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
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.DELETE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_screens_by_app_id(self, user_id: int, app_id: int) -> None:
        """
        Deletes the app screens for given app id

        Args:
            user_id: id of the user deleting the app screen
            app_id: app id for app_screens being deleted
        """
        try:
            self.db_session.query(AppScreen).filter(
                and_(
                    AppScreen.app_id == app_id,
                    AppScreen.deleted_at.is_(None),
                )
            ).update({"deleted_at": func.now(), "deleted_by": user_id})
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.DELETE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_screen(
        self,
        user_id: int,
        app_id: int,
        screen_index: int,
        app_screen: AppScreen,
        screen_details: ScreenSchema,
        screen_item: Dict,
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
            app_screen.level = screen_item["level"] if ("level" in screen_item and screen_item["level"]) else None
            app_screen.hidden = screen_details.hidden
            app_screen.updated_at = func.now()
            app_screen.updated_by = user_id
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
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
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.UPDATE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_screen(
        self, user_id: int, app_id: int, screen_index: int, screen_details: ScreenSchema, screen_item: Dict
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
                level=(screen_item["level"] if ("level" in screen_item and screen_item["level"]) else None),
                graph_type=None,
                horizontal=None,
                screen_filters_value=None,
                action_settings=None,
                hidden=screen_details.hidden,
                graph_width=None,
                graph_height=None,
                created_by=user_id,
            )
            self.db_session.add(new_screen)
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
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
            self.db_session.rollback()
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
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScreenErrors.COUNT_SCREEN_WIDGET_ERROR.value},
            )

    def save_filters_code(
        self,
        app_screen: AppScreen,
        screen_filters_value: dict,
        screen_filter_open: bool,
        user_id: int,
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
        self,
        id: int,
        graph_type: str,
        horizontal: bool | None,
        graph_width: str,
        graph_height: str,
        user_id: int,
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
                app_screen.graph_width = graph_width
                app_screen.graph_height = graph_height
                app_screen.updated_by = user_id
                app_screen.updated_at = func.now()
                self.db_session.commit()
            return app_screen
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.UPDATE_SCREEN_LAYOUT_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_archived_filter_uiacs(self, app_id: int) -> List[ArchivedFilterUIACListDTO]:
        """
        Get list of archived filter uiac for specific app which are not older than 60 days

        Args:
            app_id: app's id

        Returns:
            json: {list of archived filter uiac}
        """
        try:
            time_elapsed = datetime.now(timezone.utc) - timedelta(days=60)
            archived_code = (
                self.db_session.query(AppScreen)
                .filter(
                    AppScreen.deleted_at.is_not(None),
                    AppScreen.app_id == app_id,
                    AppScreen.screen_filters_value != "false",
                    AppScreen.screen_filters_value.is_not(None),
                    AppScreen.deleted_at > time_elapsed,
                )
                .order_by(desc(AppScreen.created_at))
                .all()
            )
            return archived_code
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScreenErrors.GET_ARCHIVED_FILTER_UIACS_ERROR.value},
            )

    def get_custom_layouts(self, app_id: int) -> List[CustomLayout]:
        """
        Gets the custom layouts for given app id

        Args:
            app_id: app id

        Returns:
            list of custom layouts object
        """
        try:
            return self.db_session.query(CustomLayout).filter_by(app_id=app_id).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScreenErrors.GET_CUSTOM_LAYOUTS_ERROR.value},
            )

    def update_custom_layouts(self, request_data: UpdateLayoutOptionsRequestResponse | Dict):
        """
        Updates the custom layouts for given app id

        Args:
            app_id: app id

        Returns:
            list of custom layouts object
        """
        try:
            custom_layout = (
                self.db_session.query(CustomLayout)
                .filter_by(app_id=request_data["app_id"] if type(request_data) is dict else request_data.app_id)
                .first()
            )
            layout_options = (
                request_data["layout_options"] if type(request_data) is dict else request_data.layout_options.__dict__
            )
            updated_layout = [
                *custom_layout.layout_options,
                {**layout_options},
            ]
            custom_layout.layout_options = list({frozenset(item.items()): item for item in updated_layout}.values())
            self.perform_commit()
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScreenErrors.UPDATE_CUSTOM_LAYOUTS_ERROR.value},
            )

    def insert_custom_layouts(self, request_data: InsertLayoutOptionsRequestResponse):
        """
        Inserts the default layouts for given app id

        Args:
            app_id: app id

        Returns:
            list of custom layouts object
        """
        try:
            get_max_id = self.db_session.query(func.max(CustomLayout.id)).first()
            max_id = 0
            for row in get_max_id:
                max_id = 0 if row is None else row
            new_layout = CustomLayout(id=max_id + 1, app_id=request_data.app_id)
            self.db_session.add(new_layout)
            self.perform_commit()
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScreenErrors.INSERT_CUSTOM_LAYOUTS_ERROR.value},
            )

    def save_user_guide(self, app_id: int, screen_id: int, user_guide: list | None) -> Dict:
        """
        Adds a user guide to the app screen

        Args:
            app_id: app id,
            screen_id: screen id,
            user_guide: list of user guide

        Returns:
            None
        """
        try:
            app_screen = self.get_app_screen(app_id, screen_id)
            if user_guide is None:
                app_screen.user_guide = None
            else:
                app_screen.user_guide = str(user_guide)
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": ScreenErrors.SAVE_USER_GUIDE_ERROR.value},
            )

    def get_app_screens_by_app_ids(self, app_ids: List[int]) -> List:
        """
        Gets app screens for all the app ids passed

        Args:
            app_ids: app ids

        Returns:
            List of app screens
        """
        try:
            return (
                self.db_session.query(AppScreen)
                .filter(AppScreen.app_id.in_(app_ids), AppScreen.marked.is_(True))
                .add_columns(
                    AppScreen.id,
                    AppScreen.screen_index,
                    AppScreen.screen_name,
                    AppScreen.app_id,
                    AppScreen.marked,
                )
                .filter_by(deleted_at=None)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": ScreenErrors.SCREENS_BY_APP_IDS_ERROR.value},
            )

    def get_filters(self, app_id: int, screen_id: int) -> List[AppScreenWidgetFilterValue]:
        """
        Gets a list of all the filters

        Args:
            app_id: app id
            screen_id: screen id

        Returns:
            List of AppScreenWidgetFilterValue objects
        """
        try:
            app_filter_values = (
                self.db_session.query(AppScreenWidgetFilterValue)
                .filter_by(app_id=app_id, screen_id=screen_id)
                .order_by(asc(AppScreenWidgetFilterValue.widget_value_id))
                .all()
            )
            return app_filter_values
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

    def get_filters_by_app_id(self, app_id: int) -> List[AppScreenWidgetFilterValue]:
        """
        Gets a list of all the filters by app id

        Args:
            app_id: app id

        Returns:
            List of AppScreenWidgetFilterValue objects
        """
        try:
            app_filter_values = self.db_session.query(AppScreenWidgetFilterValue).filter_by(app_id=app_id).all()
            return app_filter_values
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

    def create_import_app_screen(self, app_id: int, screen_info: AppScreen | Dict, user_id: int) -> AppScreen:
        """
        Create new app screen

        Args:
            app_id: app id
            screen_id: int
            screen_info: data for creating new app screen
            user_id: user creating app screen

        Returns:
            AppScreen
        """
        try:
            try:
                screen_info = {
                    "screen_index": screen_info.screen_index,
                    "screen_name": screen_info.screen_name,
                    "screen_description": screen_info.screen_description,
                    "screen_filters_open": screen_info.screen_filters_open,
                    "screen_auto_refresh": screen_info.screen_auto_refresh,
                    "screen_image": screen_info.screen_image,
                    "level": screen_info.level,
                    "horizontal": screen_info.horizontal,
                    "graph_type": screen_info.graph_type,
                    "screen_filters_value": screen_info.screen_filters_value,
                    "action_settings": screen_info.action_settings,
                    "hidden": screen_info.hidden,
                    "graph_width": screen_info.graph_width,
                    "graph_height": screen_info.graph_height,
                }
            except Exception:
                pass
            new_app_screen = AppScreen(
                app_id=app_id,
                screen_index=screen_info["screen_index"],
                screen_name=screen_info["screen_name"],
                screen_description=screen_info["screen_description"],
                screen_filters_open=screen_info["screen_filters_open"],
                screen_auto_refresh=screen_info["screen_auto_refresh"],
                screen_image=screen_info["screen_image"],
                level=screen_info["level"],
                horizontal=screen_info["horizontal"],
                graph_type=screen_info["graph_type"],
                screen_filters_value=screen_info["screen_filters_value"],
                action_settings=screen_info["action_settings"],
                hidden=screen_info["hidden"],
                graph_width=screen_info["graph_width"],
                graph_height=screen_info["graph_height"],
                created_by=user_id,
            )
            return new_app_screen
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": "Error creating app screen"},
            )

    def delete_filter_values_by_app_id(self, user_id: int, app_id: int) -> None:
        """
        Deletes the app screen widgets for given app_id

        Args:
            user_id: id of the user deleting the app screen widget
            app_id: app id for screen widget being deleted
        """
        try:
            self.db_session.query(AppScreenWidgetFilterValue).filter(
                and_(
                    AppScreenWidgetFilterValue.app_id == app_id,
                    AppScreenWidgetFilterValue.deleted_at.is_(None),
                )
            ).update({"deleted_at": func.now(), "deleted_by": user_id})
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.DELETE_FILTER_VALUE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_screen_ai_response(
        self,
        app_screen: AppScreen,
        request_data: SaveAiInsightRequestSchema,
        user_email: str,
    ) -> None:
        """
        Updates app screen ai response

        Args:
            app_screen: screen being updated
            request_data: data to be updated
        """
        try:
            app_screen.ai_response = json.dumps({"response": request_data.response_text, "config": request_data.config})
            app_screen.ai_response_verified_at = func.now()
            app_screen.ai_response_verified_email = user_email
            app_screen.ai_response_verified_name = request_data.username

            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.UPDATE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def auto_create_screen(
        self,
        user_id: int,
        app_id: int,
        screen_index: int,
        screen_details: ScreenSchema,
        screen_item: Dict,
        screen_filters_value: str,
        horizontal: bool,
        graph_type: str,
        graph_width: str,
        graph_height: str,
    ) -> None:
        """
        Create new app screen

        Args:
            user_id: id of the user creating the app screen
            app_id: id of the app this screen will be linked to
            screen_index: screen_index of the new screen
            screen_details: information to be added to the new screen
            screen_item: screen level details
        """
        try:
            new_screen = AppScreen(
                app_id=app_id,
                screen_index=screen_index,
                screen_name=screen_details["name"],
                screen_description=None,
                screen_filters_open=None,
                screen_auto_refresh=None,
                screen_image=None,
                level=(screen_item["level"] if ("level" in screen_item and screen_item["level"]) else None),
                graph_type=graph_type,
                horizontal=horizontal,
                screen_filters_value=screen_filters_value,
                action_settings=None,
                hidden=screen_details["hidden"],
                graph_width=graph_width,
                graph_height=graph_height,
                created_by=user_id,
            )
            self.db_session.add(new_screen)
            self.db_session.flush()
            return new_screen
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.CREATE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_max_screen_index(self, app_id: int) -> int:
        """
        Gets the maximum screen index present in the AppScreen table for the given app id

        Args:
            None

        Returns:
            maximum screen index
        """
        try:
            result = self.db_session.query(func.max(AppScreen.screen_index)).filter_by(app_id=app_id).first()
            max_screen_index = 0
            for row in result:
                max_screen_index = 0 if row is None else row
            return max_screen_index
        except Exception as e:
            logging.exception(e)
            return 0

    def update_screen_details(self, app_screen: AppScreen, user_id: int, screen_name: str) -> Dict:
        """
        Updates screen details(name) given the app screen

        Args:
            app_screen: AppScreen object
            user_id: id of the user updating the title
            screen_name: screen name

        Returns:
            Success message
        """
        try:
            app_screen.screen_name = screen_name
            app_screen.updated_by = user_id
            app_screen.updated_at = func.now()
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.CREATE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_app_screen_filters(self, screen_id: int, user_id: int, screen_filters_value: str) -> AppScreen:
        """
        Updates app screen filters

        Args:
            screen_id: app screen id
            user_id: id of the user updating the app screen
            screen_filters_value: sreen filters code value

        Returns:
            updated app screen object
        """
        try:
            app_screen = self.get_screen_by_id(screen_id)
            if app_screen:
                app_screen.screen_filters_value = screen_filters_value
                app_screen.updated_by = user_id
                app_screen.updated_at = func.now()

                self.db_session.flush()
            return app_screen
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_UPDATE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_app_screen(
        self,
        app_screen: AppScreen,
        user_id: int | None,
        screen_filters_value: str,
        horizontal: bool,
        graph_type: str,
        graph_width: str,
        graph_height: str,
        screen_name: str,
    ) -> None:
        """
        Updates app screen

        Args:
            app_screen: AppScreen object
            user_id: id of the user updating the app screen
            screen_filters_value: app screen filters details
            horizontal: tells if app screen layout is horizontal
            graph_type: app screen layout type
            graph_width: app screen layout width
            graph_height: app screen layout height
            screen_name: app screen name

        Returns:
            None
        """
        try:
            app_screen.graph_type = graph_type
            app_screen.horizontal = horizontal
            app_screen.screen_filters_value = screen_filters_value
            app_screen.graph_width = graph_width
            app_screen.graph_height = graph_height
            app_screen.screen_name = screen_name
            app_screen.updated_at = func.now()
            app_screen.updated_by = user_id
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.UPDATE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_app_screen(
        self, user_id: int | None, app_id: int, screen_index: int, screen_name: str, screen_level: int
    ) -> None:
        """
        Create new app screen

        Args:
            user_id: id of the user creating the app screen
            app_id: id of the app this screen will be linked to
            screen_index: screen_index of the new screen
            screen_name: screen name
            screen_level: screen level

        Returns:
            None
        """
        try:
            app_screen = AppScreen(
                app_id=app_id,
                screen_index=screen_index,
                screen_name=screen_name,
                screen_description=None,
                screen_filters_open=None,
                screen_auto_refresh=None,
                screen_image=None,
                level=screen_level,
                graph_type=None,
                horizontal=None,
                screen_filters_value=None,
                action_settings=None,
                hidden=False,
                graph_width=None,
                graph_height=None,
                created_by=user_id,
            )
            self.db_session.add(app_screen)
            self.db_session.commit()
            return app_screen
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.CREATE_SCREEN_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def check_app_screen_exist_by_name(self, app_id: int, screen_name: str, screen_id: int = None) -> AppScreen:
        """
        Check if screen with given app id and screen name exists

        Args:
            app_id: app id
            screen_name: screen name

        Returns:
            AppScreen object
        """
        try:
            app_screen = None
            if screen_id:
                app_screen = (
                    self.db_session.query(AppScreen)
                    .filter(
                        AppScreen.deleted_at.is_(None),
                        AppScreen.app_id == app_id,
                        AppScreen.screen_name == screen_name,
                        AppScreen.id != screen_id,
                    )
                    .first()
                )
            else:
                app_screen = (
                    self.db_session.query(AppScreen)
                    .filter_by(app_id=app_id, screen_name=screen_name, deleted_at=None)
                    .first()
                )
            return app_screen
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": ScreenErrors.CHECK_SCREEN_EXIST_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
