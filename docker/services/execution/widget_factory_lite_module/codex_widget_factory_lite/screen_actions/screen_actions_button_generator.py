#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging

from codex_widget_factory_lite.conversion_utils.base_screen_action import (
    BaseScreenAction,
)


class ScreenActionButton(BaseScreenAction):
    def __init__(
        self,
        button_label,
        action_type,
        colorVariant="success",
        variant="outlined",
        position="tab_nav_bar",
        shape="",
        start_icon={},
        end_icon={},
    ):
        super().__init__()
        self.__initialise_component_dict(
            button_label, action_type, colorVariant, variant, position, shape, start_icon, end_icon
        )

    def __initialise_component_dict(
        self, button_label, action_type, colorVariant, variant, position, shape, start_icon, end_icon
    ):
        if button_label is None or button_label == "":
            logging.warning("You are initializing the action button label with an empty or None value")
            button_label = "Button"
        if action_type is None:
            logging.warning("You are initializing the action button with no action type value")
            action_type = ""
        self.component_dict["actions"].append(
            {
                "action_type": action_type,
                "component_type": "button",
                "params": {
                    "text": button_label,
                    "colorVariant": colorVariant,
                    "variant": variant,
                },
                
                "position": {"portal": position},
            }
        )
        if shape:
            self.component_dict["actions"][0]["params"]["shape"] = shape
        if start_icon:
            self.component_dict["actions"][0]["params"]["startIcon"] = start_icon
        if end_icon:
            self.component_dict["actions"][0]["params"]["endIcon"] = end_icon
