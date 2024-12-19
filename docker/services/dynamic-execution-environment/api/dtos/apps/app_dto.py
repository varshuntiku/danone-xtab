import json
from typing import List

from api.daos.apps.screen_dao import ScreenDao
from api.helpers.apps.app_helper import AppHelper
from api.models.base_models import App, AppScreen, AppUser, ContainerMapping


class AppOverviewDTO:
    def __init__(
        self,
        app: App,
        env_apps: List,
        app_screens: List[AppScreen],
        app_modules: dict,
        story_count: int,
        app_user: AppUser,
        screens: List[str],
        container_mapping_details: List[ContainerMapping],
        app_helper: AppHelper,
        screen_dao: ScreenDao,
    ):
        self.id = app.id
        self.user_id = app.app_creator_id
        self.env_apps = env_apps
        self.environment = app.environment
        self.name = app.name
        self.theme_id = app.theme_id
        self.screens = [AppOverviewScreenDTO(screen, screen_dao).__dict__ for screen in app_screens]
        self.modules = app_modules
        self.industry = app_helper.industry_names(app.container_id)
        self.function = app_helper.function_names(app.container_id)
        self.description = app.description
        self.blueprint_link = app.blueprint_link
        self.config_link = app.config_link
        self.approach_url = app_helper.get_blob(app.approach_blob_name) if app.approach_blob_name else False
        self.logo_url = app_helper.get_blob(app.logo_blob_name) if app.logo_blob_name else False
        self.small_logo_url = app_helper.get_blob(app.small_logo_blob_name) if app.small_logo_blob_name else False
        self.logo_blob_name = app.logo_blob_name
        self.small_logo_blob_name = app.small_logo_blob_name
        self.story_count = story_count
        self.restricted_app = (False if app_user else True) if app.restricted_app else False
        self.is_user_admin = (app_user.is_admin if app_user else False) if app.restricted_app else True
        self.permissions = json.loads(app_user.permissions) if app_user and app_user.permissions else False
        self.is_app_user = True if app_user else False
        self.user_mgmt_access = "user_mgmt" in screens
        self.contact_email = app.contact_email if app.contact_email else False
        self.problem_area = app.problem_area
        self.industry_id = container_mapping_details[0].industry_id if len(container_mapping_details) else None
        self.function_id = container_mapping_details[0].function_id if len(container_mapping_details) else None
        self.is_connected_systems_app = app.is_connected_systems_app if app.is_connected_systems_app else False


class AppOverviewScreenDTO:
    def __init__(self, screen: AppScreen, screen_dao: ScreenDao):
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
        self.rating_url = screen.rating_url
        self.widget_count = screen_dao.count_app_screen_widget_by_screen_id(screen.id)
        self.screen_filters_values_present = (
            True if screen.screen_filters_value and screen.screen_filters_value != "false" else False
        )
        self.screen_actions_present = True if screen.action_settings and screen.action_settings != "false" else False
        self.hidden = screen.hidden if screen.hidden else False
