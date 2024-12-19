#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging
import traceback

import pandas as pd
from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion


class Insights(BaseConversion):
    """
    The Insights class has the required conversion function to translate inputs
    into a JSON structure that can be rendered as the the insights component on the Co.dx UI.
    _________________________________________________________________________

    Args:
        insights_label (str): Insight label name
        insights_values (dataframe or list of dictionaries)
    _________________________________________________________________________

    Attributes:
        json_string (str): This attribute generates a JSON string for the component
    _________________________________________________________________________

    Usage
    -----
    - Sample code
    >>> from codex_widget_factory_lite.visuals.insights import Insights
    >>> insights_json = Insights(insights_label = "Sample insights",
            insights_values = [{
                "label": "Sales - Volume",
                "severity": "success",
                "value": "100K Units"
                }]).json_string


    Returns
    -------
    The `json_string` attribute returns a JSON string that is used to render the component on the UI
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
    {
        "insight_data": [
            {
            "label": "Sales - Volume",
            "severity": "success",
            "value": "100K Units"
            },
            {
            "label": "Revenue",
            "value": "$134 M"
            },
            {
            "label": "Deviation from 1YP",
            "severity": "success",
            "value": "$17 M"
            },
            {
            "label": "Estimated Reversal Cost",
            "value": "$1 M"
            }
        ],
        "insight_label": "Scenario 2 : Outcome"
    }
    ```

    """

    DEFAULT_CODE = """
from codex_widget_factory_lite.visuals.insights import Insights
dynamic_outputs = Insights(
    insights_label = "Sample insights",
    insights_values = [{
        "label": "Sales - Volume",
        "severity": "success",
        "value": "100K Units"
    }]).json_string
"""

    def __init__(self, insights_label="", insights_values=[]):
        super().__init__()
        self.__initialise_component_dict(insights_label, insights_values)

    def __initialise_component_dict(self, insights_label, insights_values):
        try:
            if insights_label is None or insights_label == "":
                logging.warn("The insights label name is either None or an empty string")
                insights_label = ""
            self.component_dict["insight_label"] = insights_label
            if isinstance(insights_values, list):
                temp_list = [item for item in insights_values if "label" in item]
                self.component_dict["insight_data"] = temp_list
            elif isinstance(insights_values, pd.DataFrame):
                temp_df = (
                    insights_values[
                        ["label", "item", "severity", "insight_type", "icons", "dislikes", "likes", "comments", "share"]
                    ]
                    if set(["label", "item", "severity"]).issubset(insights_values.columns)
                    else insights_values[["label", "item"]]
                )
                self.component_dict["insight_data"] = temp_df.to_dict("records")
        except Exception:
            logging.error(traceback.format_exc())
