import logging
from operator import or_
from typing import List, Tuple

from api.constants.apps.widget_error_messages import WidgetErrors
from api.daos.base_daos import BaseDao
from api.dtos.apps.widget_dto import ArchivedUiacListDTO
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    AppScreen,
    AppScreenWidget,
    AppScreenWidgetFilterValue,
    AppScreenWidgetValue,
)
from api.schemas.apps.widget_schema import (
    GetMultiWidgetRequestSchema,
    GetWidgetRequestSchema,
    GetWidgetResponseSchema,
)
from fastapi import status
from sqlalchemy import asc, desc, text
from sqlalchemy.orm import aliased
from sqlalchemy.sql import func


class WidgetDao(BaseDao):
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
            self.perform_rollback()
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
            self.perform_rollback()
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
            self.perform_rollback()
            raise GeneralException(
                message={"error": WidgetErrors.GET_WIDGET_BY_ID_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def add_widget(
        self, app_id: int, screen_id: int, widget_index: int, widget_key: str, is_label: bool, config: str, user_id: int
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
            self.db_session.commit()

            return widget
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": WidgetErrors.ADD_WIDGET_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_widget(self, id: int, config: str, widget_key: str, user_id: int) -> AppScreenWidget | None:
        """
        Updates the widget details of the given id

        Args:
            id: widget id
            config: widget config string
            widget_key: widget key
            user_id: int

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

                self.db_session.commit()

            return widget
        except Exception as e:
            self.perform_rollback()
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
            logging.exception(e)
            self.perform_rollback()
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

            if not widget_value:
                raise GeneralException(
                    message={"error": WidgetErrors.WIDGET_VALUE_NOT_FOUND_ERROR.value},
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return widget_value
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
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
            self.perform_rollback()
            raise GeneralException(
                message={"error": WidgetErrors.GET_FILTERED_WIDGET_VALUES_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_widget_value(
        self, app_id: int, screen_id: int, widget_id: int, user_id: int, widget_value_code: str
    ) -> AppScreenWidgetValue | None:
        """
        Updates the widget value details of the given ids

        Args:
            app_id: app id
            screen_id: screen id
            widget_id: widget id
            user_id: int
            widget_value_code: widget uiac code

        Returns:
            Widget object
        """
        try:
            widget_value = self.get_widget_value_by_ids(app_id, screen_id, widget_id)

            if widget_value:
                widget_value.widget_value = widget_value_code
                widget_value.updated_by = user_id
                widget_value.updated_at = func.now()

                self.db_session.commit()

            return widget_value
        except Exception as e:
            self.perform_rollback()
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
            )

            self.db_session.add(widget_value)
            self.db_session.commit()

            return widget_value
        except Exception as e:
            self.perform_rollback()
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
            logging.exception(e)
            self.perform_rollback()
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
                    or_(AppScreenWidget.deleted_at.is_not(None), AppScreen.deleted_at.is_not(None)),
                    text("CAST(app_screen_widget_value.widget_value AS JSONB) ->> 'code' != ''"),
                )
                .join(AppScreenWidget, AppScreenWidget.id == AppScreenWidgetValue.widget_id)
                .join(AppScreen, AppScreen.id == AppScreenWidget.screen_id)
                .order_by(desc(AppScreenWidgetValue.created_at))
                .all()
            )
            return query
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": WidgetErrors.GET_ARCHIVED_UIACS_ERROR.value},
            )

    def get_multiwidgets_by_id(self, app_id: int, widget_id: int, request_data: GetMultiWidgetRequestSchema) -> dict:
        """
        Fetch widget by given app_id and widget_id
        Args:
            app_id: app's id

        Returns:
            dict: widget data
        """
        try:
            widget_value = (
                self.db_session.query(AppScreenWidgetValue).filter(
                    or_(AppScreenWidgetValue.widget_id == widget_id, AppScreenWidgetValue.id == widget_id),
                    AppScreenWidgetValue.app_id == app_id,
                    # widget_id=request_data.widget.id,
                    AppScreenWidgetValue.deleted_at.is_(None),
                )
                # .filter(AppScreenWidget.widget_key == request_data.widget.widget_key)
                # .first()
            )
            if hasattr(request_data, "widget") and request_data.widget:
                widget_value = widget_value.join(AppScreenWidget).filter(
                    AppScreenWidget.widget_key == request_data.widget.widget_key
                )
            widget_value = widget_value.first()
            return widget_value
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
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
            self.perform_rollback()
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
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": WidgetErrors.GET_WIDGET_ID_BY_VALUE_ID_ERROR.value},
            )
