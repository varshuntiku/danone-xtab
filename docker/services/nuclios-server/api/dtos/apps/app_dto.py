import json
from typing import Any, List

from api.daos.apps.notification_subscription_dao import NotificationSubscriptionDao
from api.daos.apps.screen_dao import ScreenDao
from api.helpers.apps.app_helper import AppHelper
from api.helpers.apps.notification_subscripiton_helper import (
    NotificationSubscripitonHelper,
)
from api.helpers.generic_helpers import GenericHelper
from api.models.base_models import (
    App,
    AppScreen,
    AppScreenWidget,
    AppScreenWidgetValue,
    AppUser,
    ContainerMapping,
    ProgressBar,
)


class AppOverviewDTO:
    def __init__(
        self,
        user_id: int,
        app: App,
        env_apps: List,
        app_screens: List[AppScreen],
        app_modules: dict,
        story_count: int,
        app_user: AppUser,
        screens: List[str],
        container_mapping_details: List[ContainerMapping],
        app_helper: AppHelper,
        generic_helper: GenericHelper,
        screen_dao: ScreenDao,
        notification_subscription_dao: NotificationSubscriptionDao,
        notification_subscription_helper: NotificationSubscripitonHelper,
    ):
        self.id = app.id
        self.user_id = app.app_creator_id
        self.env_apps = env_apps
        self.environment = app.environment
        self.name = app.name
        self.theme_id = app.theme_id
        self.screens = [
            AppOverviewScreenDTO(
                screen, screen_dao, notification_subscription_dao, app.id, user_id, notification_subscription_helper
            ).__dict__
            for screen in app_screens
        ]
        self.modules = app_modules
        self.industry = app_helper.industry_names(app.container_id)
        self.function = app_helper.function_names(app.container_id)
        self.description = app.description
        self.blueprint_link = app.blueprint_link
        self.config_link = app.config_link
        self.approach_url = generic_helper.get_blob(app.approach_blob_name) if app.approach_blob_name else False
        self.logo_url = generic_helper.get_blob(app.logo_blob_name) if app.logo_blob_name else False
        self.small_logo_url = generic_helper.get_blob(app.small_logo_blob_name) if app.small_logo_blob_name else False
        self.logo_blob_name = app.logo_blob_name
        self.small_logo_blob_name = app.small_logo_blob_name
        self.story_count = story_count
        self.restricted_app = (False if app_user else True) if app.restricted_app else False
        self.is_user_admin = (app_user.is_admin if app_user else False) if app.restricted_app else True
        self.permissions = json.loads(app_user.permissions) if app_user and app_user.permissions else False
        self.is_app_user = True if app_user else False
        self.user_mgmt_access = "user_mgmt" in screens
        self.contact_email = app.contact_email if app.contact_email else None
        self.problem_area = app.problem_area
        self.industry_id = container_mapping_details[0].industry_id if len(container_mapping_details) else None
        self.function_id = container_mapping_details[0].function_id if len(container_mapping_details) else None
        self.is_connected_systems_app = app.is_connected_systems_app if app.is_connected_systems_app else False
        self.subscription_type = notification_subscription_dao.get_app_subscription_type(
            user_id=user_id, app_id=app.id, app_screens=app_screens
        )


class AppOverviewScreenDTO:
    def __init__(
        self,
        screen: AppScreen,
        screen_dao: ScreenDao,
        notification_subscripiton_dao: NotificationSubscriptionDao,
        app_id: int,
        user_id: int,
        notification_subscripiton_helper: NotificationSubscripitonHelper,
    ):
        self.id = screen.id
        self.screen_index = screen.screen_index
        self.screen_name = screen.screen_name
        self.screen_description = screen.screen_description
        self.screen_filters_open = screen.screen_filters_open
        self.screen_auto_refresh = screen.screen_auto_refresh
        self.screen_image = screen.screen_image
        self.level = screen.level
        self.graph_type = screen.graph_type
        self.horizontal = screen.horizontal
        self.graph_width = screen.graph_width
        self.graph_height = screen.graph_height
        self.rating_url = screen.rating_url
        self.comment_enabled = screen.comment_enabled
        self.subscription_setting = notification_subscripiton_dao.get_subscriptions(
            user_id=user_id, app_id=app_id, screen_id=screen.id
        )
        self.widget_comment_enabled = notification_subscripiton_helper.get_widget_comment_enabled_for_screen(
            screen_id=screen.id
        )
        self.widget_count = screen_dao.count_app_screen_widget_by_screen_id(screen.id)
        self.screen_filters_values_present = (
            True if screen.screen_filters_value and screen.screen_filters_value != "false" else False
        )
        self.screen_actions_present = True if screen.action_settings and screen.action_settings != "false" else False
        self.hidden = screen.hidden if screen.hidden else False


class AppDTO:
    def __init__(self, app, container_mapping_details, industry_str, function_str):
        self.id = app.id
        self.name = app.name
        self.description = app.description if app.description else False
        self.industry = industry_str
        self.function = function_str if industry_str else False
        self.config_link = app.config_link if app.config_link else False
        self.blueprint_link = app.blueprint_link if app.blueprint_link else False
        self.orderby = app.orderby if (app.orderby or app.orderby == 0) and isinstance(app.orderby, int) else 0
        self.logo_url = app.logo_blob_name if app.logo_blob_name else False
        self.small_logo_url = app.small_logo_blob_name if app.small_logo_blob_name else False
        self.environment = app.environment
        # Note: Sharing single industry/function ids assuming user can have single mapping per app as part of this version
        self.industry_id = container_mapping_details[0].industry_id if len(container_mapping_details) else None
        self.function_id = container_mapping_details[0].function_id if len(container_mapping_details) else None
        self.nac_collaboration = json.loads(app.modules).get("nac_collaboration", False) if app.modules else False
        self.is_connected_systems_app = app.is_connected_systems_app if app.is_connected_systems_app else False


class UserAppDTO:
    def __init__(self, user_app):
        self.id = user_app.app_id
        self.name = user_app.name
        self.app_user_id = user_app.id


class ExportAppDTO:
    def __init__(
        self,
        CODX_APP_VERSION: str,
        CLIENT_HTTP_ORIGIN: str,
        source_app: App,
        app_screens_to_be_replicated: List[AppScreen],
        app_screen_widgets_to_be_replicated: List[AppScreenWidget],
        app_screen_widget_value_to_be_replicated: List[AppScreenWidgetValue],
    ):
        self.version = CODX_APP_VERSION
        self.source_app_url = f"{CLIENT_HTTP_ORIGIN}/app/{str(source_app.id)}"
        self.app_info = {
            "id": source_app.id,
            "name": source_app.name,
            "contact_email": source_app.contact_email,
            "function_defns": source_app.function_defns,
            "functions": source_app.function_defns,
        }
        self.screens = [ExportAppScreensDTO(screen_entity).__dict__ for screen_entity in app_screens_to_be_replicated]
        self.widgets = [
            ExportAppWidgetsDTO(widget_entity).__dict__ for widget_entity in app_screen_widgets_to_be_replicated
        ]
        self.widget_values = [
            ExportAppWidgetValuesDTO(widget_value_entity).__dict__
            for widget_value_entity in app_screen_widget_value_to_be_replicated
        ]


class ExportAppScreensDTO:
    def __init__(self, screen_entity: AppScreen):
        self.id = screen_entity.id
        self.screen_index = screen_entity.screen_index
        self.screen_name = screen_entity.screen_name
        self.screen_description = screen_entity.screen_description
        self.screen_filters_open = screen_entity.screen_filters_open
        self.screen_auto_refresh = screen_entity.screen_auto_refresh
        self.screen_image = screen_entity.screen_image
        self.level = screen_entity.level
        self.horizontal = screen_entity.horizontal
        self.graph_type = screen_entity.graph_type
        self.screen_filters_value = screen_entity.screen_filters_value
        self.action_settings = screen_entity.action_settings
        self.hidden = screen_entity.hidden
        self.graph_width = screen_entity.graph_width
        self.graph_height = screen_entity.graph_height


class ExportAppWidgetsDTO:
    def __init__(self, widget_entity: AppScreenWidget):
        self.id = widget_entity.id
        self.screen_id = widget_entity.screen_id
        self.widget_index = widget_entity.widget_index
        self.widget_key = widget_entity.widget_key
        self.is_label = widget_entity.is_label
        self.config = widget_entity.config


class ExportAppWidgetValuesDTO:
    def __init__(self, widget_value_entity: AppScreenWidgetValue):
        self.id = widget_value_entity.id
        self.screen_id = widget_value_entity.screen_id
        self.widget_id = widget_value_entity.widget_id
        self.widget_value = widget_value_entity.widget_value
        self.widget_filter_value = widget_value_entity.widget_filter_value
        self.widget_simulated_value = None


class ProgressBarDTO:
    def __init__(
        self,
        progress_bar: ProgressBar,
        app_screen: AppScreen,
        app_screens: List,
        screen_dao: Any,
        notification_subscription_dao: NotificationSubscriptionDao,
        notification_subscription_helper: NotificationSubscripitonHelper,
    ):
        # self.stage = progress_bar.stage
        self.message = progress_bar.message
        # self.status = progress_bar.status
        # self.total_stages = progress_bar.total_stages
        self.completed = progress_bar.completed
        # self.title = progress_bar.title
        # self.stage_descriptions = progress_bar.stage_descriptions
        self.stage_percentage = progress_bar.stage_percentage
        self.type = progress_bar.type
        self.screen_id = app_screen.id
        self.screen_name = app_screen.screen_name
        self.screens = [
            AppOverviewScreenDTO(
                screen,
                screen_dao,
                notification_subscription_dao,
                app_screen.app_id,
                app_screen.created_by,
                notification_subscription_helper,
            ).__dict__
            for screen in app_screens
        ]
