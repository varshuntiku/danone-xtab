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


class ScreenActionsHandler(BaseScreenAction):
    def __init__(self, message=None, type="success", download_url=None, message_list=None):
        super().__init__()
        self.__initialise_component_dict(message, type, download_url, message_list)

    def __initialise_component_dict(self, message, type, download_url, message_list):
        if message_list is not None and len(message_list) > 0:
            logging.info("Generating JSON for text list action screen")
            self.component_dict = {"list": message_list}
        else:
            if message is None:
                logging.warning("You are initializing the action handler message with an empty value")
                message = ""
            logging.info("Generating JSON for action buttons")
            self.component_dict = {
                "message": message,
                "severity": type,
            }
            if download_url is not None:
                self.component_dict["url"] = download_url
