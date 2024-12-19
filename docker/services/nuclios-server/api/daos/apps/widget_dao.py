import json
import logging
from datetime import datetime
from operator import or_
from typing import Dict, List, Tuple

from api.constants.apps.widget_error_messages import WidgetErrors
from api.daos.base_daos import BaseDao
from api.dtos.apps.widget_dto import ArchivedUiacListDTO
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (  # WidgetConnectedSystemIdentifier,
    AppScreen,
    AppScreenWidget,
    AppScreenWidgetFilterValue,
    AppScreenWidgetValue,
)
from api.schemas.apps.planogram_schema import SavePlanogramRequestSchema
from api.schemas.apps.widget_schema import (  # UpdateWidgetConnSystemIdentifierRequestSchema,
    GetMultiWidgetRequestSchema,
    GetWidgetRequestSchema,
    GetWidgetResponseSchema,
)
from fastapi import status
from sqlalchemy import and_, asc, desc, text
from sqlalchemy.orm import Session, aliased
from sqlalchemy.sql import func


class WidgetDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_widgets_by_app_screen_ids(self, app_id: int, screen_id: int) -> Tuple[List[AppScreenWidget], int]:
        """
        Gets the list and count of widgets for given app id and screen id

        Args:
            app_id: app id
            screen_id: screen id

        Returns:
            List and count of widgets
        """
        try:
            widgets_list = (
                self.db_session.query(AppScreenWidget)
                .filter_by(app_id=app_id, screen_id=screen_id, deleted_at=None)
                .order_by(asc(AppScreenWidget.widget_index))
                .all()
            )
            return widgets_list, len(widgets_list)
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.GET_WIDGETS_BY_APP_SCREEN_IDS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_widgets_by_screen_id(self, screen_id: int) -> List[AppScreenWidget]:
        """
        Gets the list of widgets for given screen id

        Args:
            screen_id: screen id

        Returns:
            List of widgets
        """
        try:
            return self.db_session.query(AppScreenWidget).filter_by(screen_id=screen_id, deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.GET_WIDGETS_BY_SCREEN_ID_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_widget_by_id(self, id: int) -> AppScreenWidget:
        """
        Gets the widgets given widget id

        Args:
            id: widget id

        Returns:
            Widget object
        """
        try:
            widget = self.db_session.query(AppScreenWidget).filter_by(id=id).first()

            if not widget:
                raise GeneralException(
                    message={"error": WidgetErrors.WIDGET_NOT_FOUND_ERROR.value},
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return widget
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.GET_WIDGET_BY_ID_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def add_widget(
        self,
        app_id: int,
        screen_id: int,
        widget_index: int,
        widget_key: str,
        is_label: bool,
        config: str,
        user_id: int,
        flush_only: bool = False,
    ) -> AppScreenWidget:
        """
        Adds a new widget

        Args:
            app_id: app id
            screen_id: screen id
            widget_index: widget index
            widget_key: widget key
            is_label: flag for label
            config: widget's config string
            user_id: user id
            flush_only: use this flag to only flush

        Returns:
            Widget object
        """
        try:
            widget = AppScreenWidget(
                app_id=app_id,
                screen_id=screen_id,
                widget_index=widget_index,
                widget_key=widget_key,
                is_label=is_label,
                config=config,
                created_by=user_id,
            )

            self.db_session.add(widget)
            self.db_session.flush() if flush_only else self.db_session.commit()

            return widget
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.ADD_WIDGET_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_widget(
        self, id: int, config: str, widget_key: str, user_id: int, flush_only: bool = False
    ) -> AppScreenWidget | None:
        """
        Updates the widget details of the given id

        Args:
            id: widget id
            config: widget config string
            widget_key: widget key
            user_id: int
            flush_only: use this flag to only flush

        Returns:
            Widget object
        """
        try:
            widget = self.get_widget_by_id(id=id)

            if widget:
                widget.config = config
                widget.widget_key = widget_key
                widget.updated_by = user_id
                widget.updated_at = func.now()

                self.db_session.flush() if flush_only else self.db_session.commit()

            return widget
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.UPDATE_WIDGET_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_widget(self, user_id: int, app_screen_widget: AppScreenWidget) -> None:
        """
        Deletes the provided app screen widget

        Args:
            user_id: id of the user deleting the app screen widget
            app_screen_widget: app screen widget being deleted
        """
        try:
            app_screen_widget.deleted_at = func.now()
            app_screen_widget.deleted_by = user_id
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.DELETE_WIDGET_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_widgets_by_app_id(self, user_id: int, app_id: int) -> None:
        """
        Deletes the app screen widgets for given app_id

        Args:
            user_id: id of the user deleting the app screen widget
            app_id: app id for screen widget being deleted

        Returns:
            None
        """
        try:
            self.db_session.query(AppScreenWidget).filter(
                and_(
                    AppScreenWidget.app_id == app_id,
                    AppScreenWidget.deleted_at.is_(None),
                )
            ).update({"deleted_at": func.now(), "deleted_by": user_id})
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.DELETE_WIDGET_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_widget_value_by_ids(self, app_id: int, screen_id: int, widget_id: int) -> AppScreenWidgetValue:
        """Gets the widget value for given app, screen and widget ids

        Args:
            app_id: app id
            screen_id: screen id
            widget_id: widget id

        Returns:
            Widget value object
        """
        try:
            widget_value = (
                self.db_session.query(AppScreenWidgetValue)
                .filter_by(app_id=app_id, screen_id=screen_id, widget_id=widget_id)
                .order_by(desc(AppScreenWidgetValue.id))
                .first()
            )
            return widget_value
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.GET_WIDGETS_BY_APP_SCREEN_IDS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_all_filtered_widget_values_by_ids(
        self, app_id: int, screen_id: int, widget_id: int, widget_value_id: int
    ) -> List[AppScreenWidgetValue]:
        """
        Gets all the widget values for given app, screen and widget ids
        excluding the ones with the given widget value id

        Args:
            app_id: app id
            screen_id: screen id
            widget_id: widget id
            widget_value_id: widget value id

        Returns:
            List of widget values satisfying the given filter condition
        """
        try:
            return (
                self.db_session.query(AppScreenWidgetValue)
                .filter_by(app_id=app_id, screen_id=screen_id, widget_id=widget_id)
                .filter(AppScreenWidgetValue.id != widget_value_id)
                .order_by(desc(AppScreenWidgetValue.id))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.GET_FILTERED_WIDGET_VALUES_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_widget_value(
        self,
        app_id: int,
        screen_id: int,
        widget_id: int,
        user_id: int,
        widget_value_code: str,
        widget_filter_value_code: str,
        flush_only: bool = False,
    ) -> AppScreenWidgetValue | None:
        """
        Updates the widget value details of the given ids

        Args:
            app_id: app id
            screen_id: screen id
            widget_id: widget id
            user_id: int
            widget_value_code: widget uiac code
            flush_only: use this flag to only flush

        Returns:
            Widget object
        """
        try:
            widget_value = self.get_widget_value_by_ids(app_id, screen_id, widget_id)

            if widget_value:
                widget_value.widget_value = widget_value_code
                widget_value.updated_by = user_id
                widget_value.updated_at = func.now()
                widget_value.widget_filter_value = widget_filter_value_code
                self.db_session.flush() if flush_only else self.db_session.commit()

            return widget_value
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.UPDATE_WIDGET_VALUE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def add_widget_value(
        self,
        app_id: int,
        screen_id: int,
        widget_id: int,
        user_id: int,
        widget_value_code: str,
        widget_simulated_value: str,
        widget_filter_value_code: str = "",
        flush_only: bool = False,
    ) -> AppScreenWidgetValue:
        """
        Adds a new widget value

        Args:
            app_id: app id
            screen_id: screen id
            widget_id: widget id
            user_id: user id
            widget_value_code: widget uiac code
            widget_simulated_value: widget simulated value
            flush_only: use this flag to only flush data

        Returns:
            Widget value object
        """
        try:
            widget_value = AppScreenWidgetValue(
                app_id=app_id,
                screen_id=screen_id,
                widget_id=widget_id,
                widget_value=widget_value_code,
                widget_simulated_value=widget_simulated_value,
                widget_filter_value_code=widget_filter_value_code,
                created_by=user_id,
            )

            self.db_session.add(widget_value)
            self.db_session.flush() if flush_only else self.db_session.commit()

            return widget_value
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.ADD_WIDGET_VALUE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_widget_value(self, user_id: int, widget_value: AppScreenWidgetValue) -> None:
        """
        Deletes the provided app screen widget value record

        Args:
            user_id: id of the user deleting the app screen widget
            widget_value: widget value being deleted
        """
        try:
            widget_value.deleted_at = func.now()
            widget_value.deleted_by = user_id
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.DELETE_WIDGET_VALUE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_widget_values_by_app_id(self, user_id: int, app_id: int) -> None:
        """
        Deletes the app screen widget value records for given app_id

        Args:
            user_id: id of the user deleting the app screen widget
            app_id: app_id for widget value being deleted

        Returns:
            None
        """
        try:
            self.db_session.query(AppScreenWidgetValue).filter(
                and_(
                    AppScreenWidgetValue.app_id == app_id,
                    AppScreenWidgetValue.deleted_at.is_(None),
                )
            ).update({"deleted_at": func.now(), "deleted_by": user_id})
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.DELETE_WIDGET_VALUE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_archived_uiacs(self, app_id: int) -> List[ArchivedUiacListDTO]:
        """
        Get list of lost UIaC's for a Project
        Args:
            app_id: app's id
        Returns:
            list: list of all the lost widgets
        """
        try:
            query = (
                self.db_session.query(AppScreenWidgetValue, AppScreenWidget, AppScreen)
                .filter(
                    AppScreenWidget.app_id == app_id,
                    or_(
                        AppScreenWidget.deleted_at.is_not(None),
                        AppScreen.deleted_at.is_not(None),
                    ),
                    text("CAST(app_screen_widget_value.widget_value AS JSONB) ->> 'code' != ''"),
                )
                .join(
                    AppScreenWidget,
                    AppScreenWidget.id == AppScreenWidgetValue.widget_id,
                )
                .join(AppScreen, AppScreen.id == AppScreenWidget.screen_id)
                .order_by(desc(AppScreenWidgetValue.created_at))
                .all()
            )
            return query
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": WidgetErrors.GET_ARCHIVED_UIACS_ERROR.value},
            )

    def get_multiwidgets_by_id(self, app_id: int, screen_id: int, request_data: GetMultiWidgetRequestSchema) -> dict:
        """
        Fetch widget by given app_id and screen_id
        Args:
            app_id: app's id

        Returns:
            dict: widget data
        """
        try:
            widget_value = (
                self.db_session.query(AppScreenWidgetValue)
                .filter_by(
                    app_id=app_id,
                    screen_id=screen_id,
                    widget_id=request_data.widget.id,
                    deleted_at=None,
                )
                .join(AppScreenWidget)
                .filter(AppScreenWidget.widget_key == request_data.widget.widget_key)
                .first()
            )
            return widget_value
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": WidgetErrors.GET_WIDGETS_BY_APP_SCREEN_IDS_ERROR.value},
            )

    def get_widget_value_by_app_and_screen(
        self, app_id: int, screen_id: int, request_data: GetWidgetRequestSchema
    ) -> GetWidgetResponseSchema:
        """
        Filter app screen widget by widget filters

        Args:
            app_id: app's id
            screen_id: screen's id
            request_data: GetWidgetRequestSchema
        Returns:
            Widget value after filtering
        """
        try:
            widget_value = (
                self.db_session.query(AppScreenWidgetValue)
                .filter_by(app_id=app_id, screen_id=screen_id)
                .join(AppScreenWidget)
            )

            filter_aliases = []

            for filter_key in request_data.filters:
                filter_value_alias = aliased(AppScreenWidgetFilterValue)
                widget_value.join(filter_value_alias)
                filter_aliases.append(filter_value_alias)
            widget_value = widget_value.filter(AppScreenWidget.widget_key == request_data.widget["widget_key"])
            index = 0
            for filter_key in request_data.filters:
                try:
                    if (
                        not isinstance(request_data.filters[filter_key], int)
                        and "checked" in request_data.filters[filter_key]
                        and request_data.filters[filter_key]["checked"] != ""
                    ):
                        widget_value = widget_value.filter(
                            filter_aliases[index].widget_value_id == AppScreenWidgetValue.id
                        )
                        widget_value = widget_value.filter(filter_aliases[index].widget_tag_key == filter_key)
                        widget_value = widget_value.filter(
                            filter_aliases[index].widget_tag_value == request_data.filters[filter_key]["checked"]
                        )
                except Exception:
                    pass
                index = index + 1
            return widget_value.first()

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": WidgetErrors.GET_WIDGETS_BY_APP_SCREEN_IDS_ERROR.value},
            )

    def get_widget_id_by_value_id(self, value_id: int) -> int:
        try:
            return (
                self.db_session.query(AppScreenWidgetValue)
                .filter(AppScreenWidgetValue.id == value_id)
                .first()
                .widget_id
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": WidgetErrors.GET_WIDGET_ID_BY_VALUE_ID_ERROR.value},
            )

    def get_widget_value(self, app_id: int, limit: int) -> List:
        """
        Get widget value by

        Args:
            app_id: app's id
            screen_id: screen's id
            request_data: GetWidgetRequestSchema
        Returns:
            Widget value after filtering
        """
        try:
            widget_value = (
                self.db_session.query(
                    AppScreenWidgetValue.widget_value,
                    AppScreenWidget.widget_key,
                    AppScreenWidget.config,
                    AppScreen.screen_filters_value,
                    AppScreen.id,
                    AppScreenWidget.id,
                )
                .filter(
                    and_(
                        AppScreenWidgetValue.app_id == app_id,
                        AppScreenWidgetValue.deleted_at.is_(None),
                        AppScreenWidget.deleted_at.is_(None),
                        AppScreen.deleted_at.is_(None),
                    )
                )
                .join(AppScreen, AppScreenWidgetValue.screen_id == AppScreen.id)
                .join(
                    AppScreenWidget,
                    AppScreenWidget.id == AppScreenWidgetValue.widget_id,
                )
                .filter(AppScreenWidget.is_label.is_(True))
                .distinct()
                .limit(limit)
                .all()
            )
            return widget_value

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": WidgetErrors.GET_WIDGET_BY_APP_ID_ERROR.value},
            )

    def get_widget_value_by_id(self, widget_value_id: int) -> AppScreenWidgetValue:
        """
        Get AppScreenWidgetValue object by widget value id.

        Args:
            widget_value_id: id of the widget value
        Returns:
            AppScreenWidgetValue object
        """
        try:
            return self.db_session.query(AppScreenWidgetValue).filter_by(id=widget_value_id).first()

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": WidgetErrors.GET_WIDGET_ID_BY_VALUE_ID_ERROR.value},
            )

    def get_unordered_widget_value_by_ids(self, app_id: int, screen_id: int, widget_id: int) -> AppScreenWidgetValue:
        """Gets the unordered widget value for given app, screen and widget ids

        Args:
            app_id: app id
            screen_id: screen id
            widget_id: widget id

        Returns:
            Widget value object
        """
        try:
            return (
                self.db_session.query(AppScreenWidgetValue)
                .filter_by(app_id=app_id, screen_id=screen_id, widget_id=widget_id)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.GET_WIDGETS_BY_APP_SCREEN_IDS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_widget_value_by_id_app_and_screen(
        self, app_id: int, screen_id: int, widget_value_id: int
    ) -> AppScreenWidgetValue:
        """
        Get app screen widget value by id, app_id and screen_id

        Args:
            app_id: app id
            screen_id: screen id
            widget_value_id: widget value id

        Returns:
            App screen widget value object
        """
        try:
            return (
                self.db_session.query(AppScreenWidgetValue)
                .filter_by(app_id=app_id, screen_id=screen_id, id=widget_value_id)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": WidgetErrors.GET_WIDGET_BY_APP_ID_ERROR.value},
            )

    def save_planogram(
        self,
        widget_value_id: int,
        request_data: SavePlanogramRequestSchema,
        widget_value: Dict,
    ) -> Dict:
        """
        Save planogram data

        Args:
            widget_value_id: id of the widget value
            requets_data: request data

        Returns:
            Success dict
        """
        try:
            app_screen_widget_value = self.db_session.query(AppScreenWidgetValue).filter_by(id=widget_value_id).first()
            widget_value["planogram"]["status"]["updated_at"] = datetime.now().strftime("%d %b, %Y %H:%M:%S")
            widget_value["planogram"]["status"]["updated_by"] = request_data.user_name
            if request_data.approve:
                widget_value["planogram"]["status"]["label"] = "Approved"
            elif request_data.publish:
                widget_value["planogram"]["status"]["label"] = "Published"
            else:
                widget_value["planogram"]["status"]["label"] = "Pending"
            app_screen_widget_value.widget_simulated_value = json.dumps(widget_value)

            self.db_session.commit()
            return {"success": "True"}
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": WidgetErrors.SAVE_PLANOGRAM_DATA_ERROR.value},
            )

    def get_widgets_by_app_id(self, app_id: int) -> List[AppScreenWidget]:
        """
        Get app screen widgets by app_id

        Args:
            app_id: app id

        Returns:
            List of App screen widgets
        """
        try:
            return self.db_session.query(AppScreenWidget).filter_by(app_id=app_id, deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": WidgetErrors.GET_WIDGET_BY_APP_ID_ERROR.value},
            )

    def get_widget_values_by_app_id(self, app_id: int) -> List[AppScreenWidgetValue]:
        """
        Get app screen widget values by app_id

        Args:
            app_id: app id

        Returns:
            List of App screen widget values
        """
        try:
            return self.db_session.query(AppScreenWidgetValue).filter_by(app_id=app_id, deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": WidgetErrors.GET_WIDGET_BY_APP_ID_ERROR.value},
            )

    def add_widget_import_app(
        self,
        app_id: int,
        widget_info,
        user_id: int,
        screen_id: int = None,
    ) -> AppScreenWidget:
        """
        Adds a new widget

        Args:
            app_id: app id
            screen_id: screen id
            widget_index: widget index
            widget_key: widget key
            is_label: flag for label
            config: widget's config string
            user_id: user id

        Returns:
            Widget object
        """
        try:
            try:
                widget_info = {
                    "screen_id": widget_info.screen_id,
                    "widget_index": widget_info.widget_index,
                    "widget_key": widget_info.widget_key,
                    "is_label": widget_info.is_label,
                    "config": widget_info.config,
                }
            except Exception:
                pass
            widget = AppScreenWidget(
                app_id=app_id,
                screen_id=screen_id if screen_id else widget_info["screen_id"],
                widget_index=widget_info["widget_index"],
                widget_key=widget_info["widget_key"],
                is_label=widget_info["is_label"],
                config=widget_info["config"],
                created_by=user_id,
            )

            return widget
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.ADD_WIDGET_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def add_widget_value_import_app(
        self,
        app_id: int,
        screen_id: int,
        widget_id: int,
        user_id: int,
        widget_value_code: str,
        widget_simulated_value: str,
        widget_filter_value_code: str,
    ) -> AppScreenWidgetValue:
        """
        Adds a new widget value

        Args:
            app_id: app id
            screen_id: screen id
            widget_id: widget id
            user_id: user id
            widget_value_code: widget uiac code
            widget_simulated_value: widget simulated value

        Returns:
            Widget value object
        """
        try:
            widget_value = AppScreenWidgetValue(
                app_id=app_id,
                screen_id=screen_id,
                widget_id=widget_id,
                widget_value=widget_value_code,
                widget_simulated_value=widget_simulated_value,
                created_by=user_id,
                widget_filter_value_code=widget_filter_value_code,
            )

            return widget_value
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.ADD_WIDGET_VALUE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_widget_value_with_widget_by_id(self, widget_value_id: int, widget_id: int):
        """
        Gets widget value with widget details given widget value id

        Args:
            widget_value_id: widget value id

        Returns:
            widget value with widget details object
        """
        try:
            return (
                self.db_session.query(AppScreenWidgetValue, AppScreenWidget)
                .filter_by(id=widget_value_id)
                .join(AppScreenWidget, AppScreenWidget.id == widget_id)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": WidgetErrors.GET_WIDGET_BY_APP_ID_ERROR.value},
            )

    def update_widget_index(self, widget_id: int, new_index: int, user_id: int, flush_only: bool = False):
        """
        Updates the index of a widget.

        Args:
            widget_id: The ID of the widget to update.
            new_index: The new index to set for the widget.
            user_id: The ID of the user making the update.
            flush_only: If true, only flushes the session without committing.
        """
        try:
            widget = self.get_widget_by_id(widget_id)
            widget.widget_index = new_index
            self.db_session.flush() if flush_only else self.db_session.commit()

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.UPDATE_WIDGET_INDEX_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_widget_value_by_widget_id(self, widget_id: int):
        try:
            widget_value = self.db_session.query(AppScreenWidgetValue).filter_by(widget_id=widget_id).first()
            return widget_value
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.GET_WIDGETS_BY_APP_SCREEN_IDS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    # def get_widget_connected_system_identifier_by_id(self, id: int) -> WidgetConnectedSystemIdentifier:
    #     """
    #     Retrieves a WidgetConnectedSystemIdentifier object by id

    #     Args:
    #         id: id of WidgetConnectedSystemIdentifier object

    #     Returns:
    #         WidgetConnectedSystemIdentifier object
    #     """
    #     try:
    #         return self.db_session.query(WidgetConnectedSystemIdentifier).filter_by(id=id).first()
    #     except Exception as e:
    #         logging.exception(e)
    #         raise GeneralException(
    #             status.HTTP_422_UNPROCESSABLE_ENTITY,
    #             message={"error": WidgetErrors.GET_WIDGET_CONNECTED_SYSTEM_BY_ID_ERROR.value},
    #         )

    # def check_duplicate_widget_system_connected_identifier(
    #     self, app_id: int, widget_id: int, request_data: UpdateWidgetConnSystemIdentifierRequestSchema
    # ) -> WidgetConnectedSystemIdentifier:
    #     """
    #     Checks for duplicate widget system connected identifier.

    #     Args:
    #         app_id: app's id
    #         widget_id: widget's id
    #         request_data: UpdateWidgetConnSystemIdentifierRequestSchema

    #     Returns:
    #         WidgetConnectedSystemIdentifier object
    #     """
    #     try:
    #         return (
    #             self.db_session.query(WidgetConnectedSystemIdentifier)
    #             .filter_by(
    #                 app_id=app_id,
    #                 widget_id=widget_id,
    #                 dashboard_id=request_data.dashboard_id,
    #                 business_process_id=request_data.business_process_id,
    #                 problem_definition_id=request_data.problem_definition_id,
    #             )
    #             .first()
    #         )
    #     except Exception as e:
    #         logging.exception(e)
    #         raise GeneralException(
    #             status.HTTP_422_UNPROCESSABLE_ENTITY,
    #             message={"error": WidgetErrors.CHECK_DUPLICATE_WIDGET_CONNECTED_SYSTEM_ERROR.value},
    #         )

    # def add_duplicate_widget_system_connected_identifier(
    #     self, request_data: UpdateWidgetConnSystemIdentifierRequestSchema, app_id: int, widget_id: int
    # ) -> Dict:
    #     """
    #     Adds a new duplicate widget system connected identifier.

    #     Args:
    #         request_data: UpdateWidgetConnSystemIdentifierRequestSchema
    #         app_id: app id
    #         widget_id: widget id

    #     Returns:
    #         success dict
    #     """
    #     try:
    #         widget_identifier = WidgetConnectedSystemIdentifier(
    #             id=request_data.id,
    #             app_id=int(app_id),
    #             widget_id=int(widget_id),
    #             dashboard_id=request_data.dashboard_id,
    #             problem_definition_id=request_data.problem_definition_id,
    #             business_process_id=request_data.business_process_id,
    #             created_by=None,
    #             is_active=True,
    #         )
    #         self.db_session.add(widget_identifier)
    #         self.db_session.commit()
    #         return {"success": True}

    #     except Exception as e:
    #         logging.exception(e)
    #         raise GeneralException(
    #             status.HTTP_422_UNPROCESSABLE_ENTITY,
    #             message={"error": WidgetErrors.ADD_WIDGET_CONNECTED_SYSTEM_ERROR.value},
    #         )

    # def update_duplicate_widget_system_connected_identifier(
    #     self, request_data: UpdateWidgetConnSystemIdentifierRequestSchema
    # ) -> Dict:
    #     """
    #     Updates the duplicate widget system connected identifier.
    #     Args:
    #         request_data: UpdateWidgetConnSystemIdentifierRequestSchema

    #     Returns:
    #         success dict
    #     """
    #     try:
    #         self.db_session.query(WidgetConnectedSystemIdentifier).filter(
    #             and_(WidgetConnectedSystemIdentifier.id == request_data.id)
    #         ).update(
    #             {
    #                 "dashboard_id": request_data.dashboard_id,
    #                 "problem_definition_id": request_data.problem_definition_id,
    #                 "business_process_id": request_data.business_process_id,
    #             }
    #         )
    #         self.db_session.commit()
    #         return {"success": True}

    #     except Exception as e:
    #         logging.exception(e)
    #         raise GeneralException(
    #             status.HTTP_422_UNPROCESSABLE_ENTITY,
    #             message={"error": WidgetErrors.UPDATE_DUPLICATE_WIDGET_CONNECTED_SYSTEM_ERROR.value},
    #         )
