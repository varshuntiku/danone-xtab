from api.api_helpers.solution_workbench.screen_helper import OverviewHelper


class OverviewDTO:
    """
    Using nested DTO for packages.
    We are using helper class OverviewHelper to get packages.
    Packages are not part of the table AppScreen(We are gettings packages fron product_server/requirements.txt"
    """

    def __init__(self, overview):
        self.id = overview.id
        self.screen_index = overview.screen_index
        self.screen_name = overview.screen_name
        self.screen_description = overview.screen_description
        self.screen_image = overview.screen_image
        self.level = overview.level
        self.graph_type = overview.graph_type
        self.horizontal = overview.horizontal
        self.rating_url = overview.rating_url
        self.available_packages = OverviewHelper.get_installed_packages()
        self.graph_width = overview.graph_width
        self.graph_height = overview.graph_height
