#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import logging
from abc import ABC


class BaseScreenAction(ABC):
    """
    The BaseScreenAction is an abstract class is used to define base properties,
    abstract methods and abstract properties (if any) of screen levle actions on co.dx.

    Attributes:
        json_string (returns str): This attribute generates a JSON string for the component

    Methods
        append_action (ScreenActionClassType) : This methods appends another action into the
            existing JSON structure. Handy when defining multiple action types

    """

    def __init__(self):
        self.component_dict = {"actions": []}

    def append_action(self, screen_action_object):
        self.component_dict["actions"] = self.component_dict["actions"] + screen_action_object.component_dict["actions"]

    @property
    def json_string(self):
        """
        This attribute generates a JSON string for the component
        """
        try:
            if isinstance(self.component_dict, dict):
                return json.dumps(self.component_dict)
            else:
                logging.error(
                    "Error in conversion utils - component_dict must be of type dictionary",
                    exc_info=True,
                )
                return "{}"
        except Exception:
            logging.exception(
                "Error in conversion utils - error occurred while converting component dictionary structure to JSON"
            )
            return "{}"
