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


class BaseConversion(ABC):
    """
    The BaseConversion is an abstract class is used to define base properties, abstract methods and abstract properties (if any).

    Attributes:
        json_string (str): This attribute generates a JSON string for the component

    """

    def __init__(self):
        self.component_dict = {}

    def add_information(self, visual_object, title=None):
        self.component_dict["assumptions"] = visual_object.component_dict
        if title is not None:
            self.component_dict["assumptions"]["title"] = title

    def add_tooltip(self, isTooltip=False, tooltip_text="This is a tooltip", placement="bottom"):
        self.component_dict["isTooltip"] = isTooltip
        self.component_dict["tooltip_text"] = tooltip_text
        self.component_dict["placement"] = placement

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
