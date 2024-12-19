import json
import logging
from typing import Dict, List

from api.configs.settings import AppSettings, get_app_settings
from api.constants.apps.app_error_messages import AppErrors
from api.daos.apps.app_dao import AppDao
from api.daos.apps.execution_env_dao import ExecutionEnvDao
from api.daos.apps.screen_dao import ScreenDao
from api.daos.apps.widget_dao import WidgetDao
from api.daos.dashboards.function_dao import FunctionDao
from api.daos.dashboards.industry_dao import IndustryDao
from api.middlewares.error_middleware import GeneralException
from fastapi import status
from sqlalchemy.orm import Session

settings = get_app_settings()


class AppHelper:
    def __init__(self, db_session: Session):
        self.db_session = db_session
        self.app_dao = AppDao(db_session)
        self.screen_dao = ScreenDao(db_session)
        self.widget_dao = WidgetDao(db_session)
        self.industry_dao = IndustryDao(db_session)
        self.function_dao = FunctionDao(db_session)
        self.app_settings = AppSettings()
        self.execution_env_dao = ExecutionEnvDao(db_session)

    def container_mapping_details(self, container_id: int):
        container_mapping = self.app_dao.get_container_mappings_by_container_id(container_id)
        return container_mapping

    def industries(self, container_id: int):
        industries_details = [
            self.industry_dao.get_industry_by_id(container_mapping.industry_id)
            for container_mapping in self.container_mapping_details(container_id)
        ]
        filtered_industries_details = list(filter(lambda item: item is not None, industries_details))
        return filtered_industries_details

    def industry_names(self, container_id: int):
        return ",".join(
            list(
                map(
                    lambda industry: industry.industry_name,
                    self.industries(container_id),
                )
            )
        )

    def functions(self, container_id: int):
        functions_details = [
            self.function_dao.get_function_by_id(container_mapping.function_id)
            for container_mapping in self.container_mapping_details(container_id)
        ]
        filtered_functions_details = list(filter(lambda item: item is not None, functions_details))
        return filtered_functions_details

    def function_names(self, container_id: int):
        return ",".join(
            list(
                map(
                    lambda function: function.function_name,
                    self.functions(container_id),
                )
            )
        )

    def update_app_screens_for_app_user(self, screens, app_screens, app_user) -> tuple[List, List]:
        for user_role in app_user.user_roles:
            screens.extend(json.loads(user_role.permissions))
        screens = [screen.replace("app_screen_", "") for screen in screens]
        last_matched_level = None
        filtered_app_screens = []
        current_branch = [None, None, None]
        for screen in app_screens:
            screen_level = screen.level or 0
            current_branch[screen_level] = screen
            if str(screen.id) in screens:
                current_branch = current_branch[0 : (screen_level + 1)]
                filtered_app_screens.extend(list(filter(None, current_branch)))
                current_branch = [None, None, None]
                last_matched_level = screen_level
            elif last_matched_level is None:
                continue
            elif screen_level > (last_matched_level or 0):
                filtered_app_screens.append(screen)
            else:
                last_matched_level = None
        app_screens = filtered_app_screens
        return (screens, app_screens)

    def handle_clone_app(self, request_data: Dict, user_id: int):
        try:
            if "source_app_data" in request_data:
                source_app_data = request_data.get("source_app_data")
                app_info = source_app_data.get("app_info")

                # Create new app from request data
                source_app = self.app_dao.create_import_app(
                    user_id=user_id,
                    name=app_info["name"],
                    contact_email=app_info["contact_email"],
                    is_connected_systems_app=request_data.get("is_connected_systems_app", False),
                    variables=app_info.get("variables", None),
                )
                source_app.id = app_info["id"]
                source_app.function_defns = app_info["function_defns"]

                screens = source_app_data.get("screens")
                app_screens_to_be_replicated = []
                for screen in screens:
                    app_screen = self.screen_dao.create_import_app_screen(
                        app_id=source_app.id, screen_info=screen, user_id=user_id
                    )
                    app_screen.id = screen["id"]
                    app_screens_to_be_replicated.append(app_screen)

                widgets = source_app_data.get("widgets")
                app_screen_widgets_to_be_replicated = []
                for widget in widgets:
                    app_screen_widget = self.widget_dao.add_widget_import_app(
                        app_id=source_app.id, widget_info=widget, user_id=user_id
                    )
                    app_screen_widget.id = widget["id"]
                    app_screen_widgets_to_be_replicated.append(app_screen_widget)

                screen_widget_values = source_app_data.get("widget_values")
                app_screen_widget_value_to_be_replicated = []
                for screen_widget_value in screen_widget_values:
                    app_screen_widget_value = self.widget_dao.add_widget_value_import_app(
                        app_id=source_app.id,
                        screen_id=screen_widget_value["screen_id"],
                        widget_id=screen_widget_value["widget_id"],
                        widget_value_code=screen_widget_value["widget_value"],
                        widget_simulated_value=screen_widget_value["widget_simulated_value"],
                        widget_filter_value_code=screen_widget_value.get("widget_filter_value", None),
                        user_id=user_id,
                    )
                    app_screen_widget_value.id = screen_widget_value["id"]
                    app_screen_widget_value_to_be_replicated.append(app_screen_widget_value)
            else:
                source_app_id = request_data.get("source_app_id")
                source_app = self.app_dao.get_app_by_id(app_id=source_app_id)  # app to be replicated
                app_info = source_app.__dict__

                app_screens_to_be_replicated = self.screen_dao.get_screens_by_app_id(app_id=source_app_id)
                app_screen_widgets_to_be_replicated = self.widget_dao.get_widgets_by_app_id(app_id=source_app_id)
                app_screen_widget_value_to_be_replicated = self.widget_dao.get_widget_values_by_app_id(
                    app_id=source_app_id
                )
            for app_widget_values in app_screen_widget_value_to_be_replicated:
                __widget_value__ = (
                    json.loads(app_widget_values.widget_value) if app_widget_values.widget_value else None
                )
                if type(__widget_value__) is dict and __widget_value__.get("is_dynamic", False) is False:
                    raise GeneralException(
                        message=AppErrors.CANNOT_REPLICATE_APP_ERROR.value,
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    )

            # For App to be replicated from scracth.
            # The app does not yet exists. so it has to be created.
            # The condition is that, destination_app_id ia None, but destination_app_env will have the value
            destination_app = None
            destination_app_id = request_data.get("destination_app_id")

            if destination_app_id:
                destination_app = self.app_dao.get_app_by_id(app_id=destination_app_id)

                self.screen_dao.delete_screens_by_app_id(user_id=user_id, app_id=destination_app_id)

                self.widget_dao.delete_widgets_by_app_id(user_id=user_id, app_id=destination_app_id)

                self.widget_dao.delete_widget_values_by_app_id(user_id=user_id, app_id=destination_app_id)
                self.db_session.flush()
            else:
                destination_app = self.app_dao.create_import_app(
                    user_id=user_id,
                    name=request_data.get("app_name", ""),
                    contact_email=request_data.get("contact_email", ""),
                    is_connected_systems_app=request_data.get("is_connected_systems_app", False),
                    modules=json.dumps(
                        {
                            "nac_collaboration": request_data.get("nac_collaboration", False),
                            "top_navbar": request_data.get("top_navbar", False),
                        }
                    ),
                )
                self.db_session.add(destination_app)
                app_container = self.app_dao.create_app_container_import_app(
                    orderby=0, problem=request_data.get("app_name", "")
                )
                self.db_session.add(app_container)
                self.db_session.flush()
                destination_app.container_id = app_container.id
                destination_app.environment = "preview"
                self.db_session.flush()

            # overview being copied over from source to destination
            if request_data.get("clone_overview"):
                destination_app.approach_blob_name = source_app.approach_blob_name
                destination_app.blueprint_link = source_app.blueprint_link
                destination_app.config_link = source_app.config_link
                destination_app.description = source_app.description
                destination_app.logo_blob_name = source_app.logo_blob_name
                destination_app.orderby = source_app.orderby
                destination_app.small_logo_blob_name = source_app.small_logo_blob_name
                destination_app.theme_id = source_app.theme_id
                self.db_session.flush()

            # check if app variables need to be copied
            if request_data.get("app_variables"):
                copy_app_vars_flag = request_data.get("app_variables")
                if copy_app_vars_flag is True:
                    destination_app.variables = source_app.variables

            if request_data.get("app_functions"):
                copy_app_vars_flag = request_data.get("app_functions")
                if copy_app_vars_flag is True:
                    destination_app.function_defns = source_app.function_defns
            elif "source_app_data" in request_data:
                destination_app.function_defns = request_data["source_app_data"]["app_info"]["functions"]

            if request_data.get("destination_app_env"):
                destination_app.environment = request_data.get("destination_app_env")

            destination_app.source_app_id = source_app.id if "source_app_data" not in request_data else None

            self.db_session.flush()

            self.app_dao.add_container_mapping(
                industry_id=request_data.get("industry_id"),
                function_id=request_data.get("function_id"),
                container_id=destination_app.container_id,
            )

            # For Its Screens
            screen_id_mapping = {}
            for screen_entity in app_screens_to_be_replicated:
                new_screen_entity = self.screen_dao.create_import_app_screen(
                    app_id=destination_app.id,
                    user_id=user_id,
                    screen_info=screen_entity,
                )
                self.db_session.add(new_screen_entity)
                self.db_session.flush()
                screen_id_mapping[screen_entity.id] = new_screen_entity.id

            widget_id_mapping = {}
            for widget_entity in app_screen_widgets_to_be_replicated:
                if screen_id_mapping.get(widget_entity.screen_id):
                    new_widget_entity = self.widget_dao.add_widget_import_app(
                        app_id=destination_app.id,
                        user_id=user_id,
                        widget_info=widget_entity,
                        screen_id=screen_id_mapping[widget_entity.screen_id],
                    )
                    self.db_session.add(new_widget_entity)
                    self.db_session.flush()
                    widget_id_mapping[widget_entity.id] = new_widget_entity.id

            widget_value_id_mapping = {}
            for widget_value_entity in app_screen_widget_value_to_be_replicated:
                if screen_id_mapping.get(widget_value_entity.screen_id) and widget_id_mapping.get(
                    widget_value_entity.widget_id
                ):
                    new_widget_value_entity = self.widget_dao.add_widget_value_import_app(
                        app_id=destination_app.id,
                        screen_id=screen_id_mapping[widget_value_entity.screen_id],
                        widget_id=widget_id_mapping[widget_value_entity.widget_id],
                        widget_value_code=widget_value_entity.widget_value,
                        widget_simulated_value=None,
                        user_id=user_id,
                        widget_filter_value_code=widget_value_entity.widget_filter_value,
                    )
                    self.db_session.add(new_widget_value_entity)
                    self.db_session.flush()
                    widget_value_id_mapping[widget_value_entity.id] = new_widget_value_entity.id

            self.db_session.flush()
            self.db_session.commit()
            return {"app_id": destination_app.id}
        except Exception as ex:
            logging.exception(ex)
            raise GeneralException(
                message={"error": AppErrors.CREATE_CLONE_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def handle_replicate_app(self, request_data: Dict, user_id: int):
        try:
            source_app_id = request_data.get("source_app_id")
            source_app = self.app_dao.get_app_by_id(app_id=source_app_id)  # app to be replicated

            app_screens_to_be_replicated = self.screen_dao.get_screens_by_app_id(app_id=source_app_id)
            app_screen_widgets_to_be_replicated = self.widget_dao.get_widgets_by_app_id(app_id=source_app_id)
            app_screen_widget_value_to_be_replicated = self.widget_dao.get_widget_values_by_app_id(app_id=source_app_id)

            for app_widget_values in app_screen_widget_value_to_be_replicated:
                __widget_value__ = (
                    json.loads(app_widget_values.widget_value) if app_widget_values.widget_value else None
                )
                if type(__widget_value__) is dict and __widget_value__.get("is_dynamic", False) is False:
                    raise GeneralException(
                        message=AppErrors.CANNOT_REPLICATE_APP_ERROR.value,
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    )

            # For App to be replicated from scracth.
            # The app does not yet exists. so it has to be created.
            # The condition is that, destination_app_id is None, but destination_app_env will have the value
            destination_app = None
            destination_app_id = request_data.get("destination_app_id")

            if destination_app_id:
                destination_app = self.app_dao.get_app_by_id(app_id=destination_app_id)

                self.screen_dao.delete_screens_by_app_id(user_id=user_id, app_id=destination_app_id)

                self.widget_dao.delete_widgets_by_app_id(user_id=user_id, app_id=destination_app_id)

                self.widget_dao.delete_widget_values_by_app_id(user_id=user_id, app_id=destination_app_id)
                self.db_session.flush()
            else:
                destination_app = self.app_dao.create_import_app(
                    user_id=user_id,
                    name=source_app.name,
                    theme_id=source_app.theme_id,
                    contact_email=source_app.contact_email,
                    modules=source_app.modules,
                    is_connected_systems_app=source_app.is_connected_systems_app,
                )
                self.db_session.add(destination_app)

            # overview being copied over from source to destination
            destination_app.approach_blob_name = source_app.approach_blob_name
            destination_app.blueprint_link = source_app.blueprint_link
            destination_app.config_link = source_app.config_link
            destination_app.description = source_app.description
            destination_app.logo_blob_name = source_app.logo_blob_name
            destination_app.orderby = source_app.orderby
            destination_app.small_logo_blob_name = source_app.small_logo_blob_name
            destination_app.function_defns = source_app.function_defns
            self.db_session.flush()

            # check if app variables need to be copied
            if request_data.get("copy_app_vars_flag"):
                copy_app_vars_flag = request_data.get("copy_app_vars_flag")
                if copy_app_vars_flag is True:
                    destination_app.variables = source_app.variables

            if request_data.get("destination_app_env"):
                destination_app.environment = request_data.get("destination_app_env")

            destination_app.source_app_id = source_app.id
            destination_app.container_id = source_app.container_id
            self.db_session.flush()

            # For Its Screens
            screen_id_mapping = {}
            for screen_entity in app_screens_to_be_replicated:
                new_screen_entity = self.screen_dao.create_import_app_screen(
                    app_id=destination_app.id,
                    user_id=user_id,
                    screen_info=screen_entity,
                )
                self.db_session.add(new_screen_entity)
                self.db_session.flush()
                screen_id_mapping[screen_entity.id] = new_screen_entity.id

            widget_id_mapping = {}
            for widget_entity in app_screen_widgets_to_be_replicated:
                if screen_id_mapping.get(widget_entity.screen_id):
                    new_widget_entity = self.widget_dao.add_widget_import_app(
                        app_id=destination_app.id,
                        user_id=user_id,
                        widget_info=widget_entity,
                        screen_id=screen_id_mapping[widget_entity.screen_id],
                    )
                    self.db_session.add(new_widget_entity)
                    self.db_session.flush()
                    widget_id_mapping[widget_entity.id] = new_widget_entity.id

            widget_value_id_mapping = {}
            for widget_value_entity in app_screen_widget_value_to_be_replicated:
                if screen_id_mapping.get(widget_value_entity.screen_id) and widget_id_mapping.get(
                    widget_value_entity.widget_id
                ):
                    new_widget_value_entity = self.widget_dao.add_widget_value_import_app(
                        app_id=destination_app.id,
                        screen_id=screen_id_mapping[widget_value_entity.screen_id],
                        widget_id=widget_id_mapping[widget_value_entity.widget_id],
                        widget_value_code=widget_value_entity.widget_value,
                        widget_simulated_value=None,
                        user_id=user_id,
                        widget_filter_value_code=widget_value_entity.widget_filter_value,
                    )
                    self.db_session.add(new_widget_value_entity)
                    self.db_session.flush()
                    widget_value_id_mapping[widget_value_entity.id] = new_widget_value_entity.id

            self.db_session.flush()
            self.db_session.commit()
            return {"new_app_id": destination_app.id}
        except Exception as ex:
            logging.exception(ex)
            raise GeneralException(
                message={"error": AppErrors.CREATE_REPLICA_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
