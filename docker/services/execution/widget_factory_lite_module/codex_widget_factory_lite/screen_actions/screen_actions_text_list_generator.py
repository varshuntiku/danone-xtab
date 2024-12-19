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


class ScreenActionText(BaseScreenAction):
    def __init__(self, action_type, position="tab_nav_bar"):
        super().__init__()
        self.__initialise_component_dict(action_type, position)

    def __initialise_component_dict(self, action_type, position):
        if action_type is None:
            logging.warning("You are initializing the action button with no action type value")
            action_type = ""
        self.component_dict["actions"].append(
            {
                "action_type": action_type,
                "component_type": "text_list",
                "params": {"fetch_on_load": True},
                "position": {"portal": position},
            }
        )
