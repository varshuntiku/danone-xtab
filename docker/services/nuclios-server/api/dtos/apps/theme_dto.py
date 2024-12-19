import json

from api.helpers.apps.theme_helper import ThemeHelper


class ThemeDTO:
    """
    DTO to return list of themes.
    """

    def __init__(self, theme):
        self.theme_helper = ThemeHelper()
        self.id = theme.id
        self.name = theme.name
        self.readOnly = theme.readonly
        self.modes = self.__generate_modes(theme.modes)

    def __generate_modes(self, modes):
        """
        Generate modes using theme_helper.sort_modes.
        """
        sorted_modes = self.theme_helper.sort_modes(modes)
        return [ModeDTO(mode) for mode in sorted_modes]


class ModeDTO:
    """
    DTO for modes within a theme.
    """

    def __init__(self, mode):
        self.mode = mode.mode
        self.bg_variant = mode.bg_variant
        self.contrast_color = mode.contrast_color
        self.chart_colors = json.loads(mode.chart_colors)
        self.params = json.loads(mode.params or {})
