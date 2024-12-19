from enum import Enum


class IndustryHorizon(Enum):
    Vertical = "vertical"
    Horizontal = "horizontal"

    def get_horizon(value):
        if value == "vertical":
            return "vertical"
        elif value == "horizontal":
            return "horizontal"
        else:
            return "vertical"
