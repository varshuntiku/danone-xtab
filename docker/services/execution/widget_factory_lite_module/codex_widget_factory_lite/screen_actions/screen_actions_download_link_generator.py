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


class ScreenActionDownload(BaseScreenAction):
    def __init__(self, button_label, action_type, position="tab_nav_bar",file_name = "File"):
        super().__init__()
        self.__initialise_component_dict(button_label, action_type, position,file_name)

    def __initialise_component_dict(self, button_label, action_type, position,file_name):
        if button_label is None or button_label == "":
            logging.warning("You are initializing the action button label with an empty or None value")
            button_label = "Download Button"
        if action_type is None:
            logging.warning("You are initializing the action button with no action type value")
            action_type = ""
        if action_type == "test_download_action":
            self.component_dict["actions"].append(
                {
                    "action_type": action_type,
                    "component_type": "download_link",
                    "params": {
                        "is_icon": True,
                        "text": "button_label",
                        "fetch_on_click": True,
                    },
                    "position": {"portal": position},
                    "fileName":file_name
                   
                }
            )
        elif action_type=="test_download_content":
            self.component_dict["actions"].append(
                {
                    "action_type": action_type,
                    "component_type": "content_link",
                    "params": {
                        "is_icon": True,
                        "text": "button_label",
                        "fetch_on_click": True,
                    },
                    "position": {"portal": position},
                    "fileName":file_name
                }
            )
        elif action_type == "test_download_file_content":
            self.component_dict["actions"].append(
                {
                    "action_type": action_type,
                    "component_type": "filecontent_link",
                    "params": {
                        "is_icon": True,
                        "text": "button_label",
                        "fetch_on_click": True,
                    },
                    "position": {"portal": position},
                    "fileName":file_name
                }
            )



         
            


        