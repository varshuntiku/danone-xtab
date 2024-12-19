from api.helpers.apps.screen_helper import ScreenHelper


class OverviewDTO:
    def __init__(self, screen):
        self.id = screen.id
        self.screen_index = screen.screen_index
        self.screen_name = screen.screen_name
        self.screen_description = screen.screen_description
        self.screen_image = screen.screen_image
        self.level = screen.level
        self.graph_type = screen.graph_type
        self.horizontal = screen.horizontal
        self.rating_url = screen.rating_url
        self.available_packages = ScreenHelper.get_installed_packages()
        self.graph_width = screen.graph_width
        self.graph_height = screen.graph_height
        self.comment_enabled = screen.comment_enabled


class ScreenDTO:
    def __init__(self, screen, subscripton):
        self.id = screen.id
        self.name = screen.screen_name
        self.hidden = screen.hidden
        self.level = screen.level
        self.screen_index = screen.screen_index
        self.comment_enabled = screen.comment_enabled
        self.subscription = subscripton if subscripton else None


class GetScreensDTO:
    def __init__(self, screen):
        self.id = screen.id
        self.screen_name = screen.screen_name
        self.level = screen.level
        self.screen_index = screen.screen_index
        self.screen_description = screen.screen_description
        self.screen_image = screen.screen_image
        self.graph_type = screen.graph_type
        self.horizontal = screen.horizontal
        self.rating_url = screen.rating_url
        self.graph_width = screen.graph_width
        self.graph_height = screen.graph_height
