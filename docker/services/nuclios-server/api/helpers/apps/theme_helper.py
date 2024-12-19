class ThemeHelper:
    """
    Helper class for theme.
    """

    def modes_com_key(self, e):
        return e.mode

    def sort_modes(self, modes):
        modes.sort(key=self.modes_com_key, reverse=True)
        return modes
