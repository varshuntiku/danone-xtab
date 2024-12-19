#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging

from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion


class Metric(BaseConversion):
    """
    The Metric class has the required conversion function to translate inputs
    into a JSON structure that can be rendered as the Metric/KPIs component on the Co.dx UI.
    _________________________________________________________________________

    Args:
        metric_value (str or numeric): Number/text to be show as the value on the metric component.
        metric_additional_value (str): Additional Data to be shown in the KPI, will be colored based on extra_dir
        metric_additional_value_direction (str): Can be 'up'/'down', will add an arrow with green for up and red for down as the colors
        alt_behavior (bool): Alter the behaviour of the extra_dir directive, green becomes red and vice versa.

    _________________________________________________________________________

    Attributes:
        json_string (str): This attribute generates a JSON string for the component
    _________________________________________________________________________

    Usage
    -----
    - Sample code
    >>> from codex_widget_factory_lite.visuals.metric import Metric
    >>> metric_json = Metric(metric_value = "$ 100k", metric_additional_value="20% YoY", metric_additional_value_direction="down", alt_behavior= False).json_string

    Returns
    -------
    The `json_string` attribute returns a JSON string that is used to render the component on the UI
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
        {
            "value": "<Number/text to be show as the Value>",
            "extra_dir": "<Can be 'up'/'down', will add an arrow with green for up and red for down as the colors>",
            "extra_value": "<Additional Data to be shown in the KPI, will be colored based on extra_dir>",
            "alt_behaviour": "<Alter the behaviour of the extra_dir directive, green becomes red and vice versa>"
        }
    ```

    """

    DEFAULT_CODE = """
from codex_widget_factory_lite.visuals.metric import Metric
dynamic_outputs = Metric(metric_value = "$ 100k", metric_additional_value="20% YoY", metric_additional_value_direction="down", alt_behavior= False).json_string
"""

    def __init__(
        self,
        metric_value,
        metric_additional_value=None,
        metric_additional_value_direction=None,
        alt_behavior=False,
        isTooltip=False,
        tooltip_text="",
        placement="bottom",
    ):
        super().__init__()
        self.__initialise_component_dict(
            metric_value,
            metric_additional_value,
            metric_additional_value_direction,
            alt_behavior,
            isTooltip,
            tooltip_text,
            placement,
        )

    def __initialise_component_dict(
        self,
        metric_value,
        metric_additional_value,
        metric_additional_value_direction,
        alt_behavior,
        isTooltip,
        tooltip_text,
        placement,
    ):
        if metric_value is None or metric_value == "":
            logging.warning("You are initializing the metric component with an empty or None value")
            metric_value = ""
        if metric_additional_value is not None and metric_additional_value_direction not in [
            "up",
            "down",
        ]:
            logging.warning(
                "You are initializing an unrecognized value for metric_additional_value_direction. It accepts only values of 'up' and 'down'. Setting default to 'up'"
            )
            metric_additional_value_direction = "up"
        if isinstance(alt_behavior, bool) is False:
            logging.warning(
                "Invalid value passed to 'alt_behavior'. It accepts only boolean values. Setting default to 'False'"
            )
        self.component_dict = {
            "value": metric_value,
            "extra_dir": metric_additional_value_direction,
            "extra_value": metric_additional_value,
            "alt_behaviour": alt_behavior,
            "isTooltip": isTooltip,
            "tooltip_text": tooltip_text,
            "placement": placement,
        }
