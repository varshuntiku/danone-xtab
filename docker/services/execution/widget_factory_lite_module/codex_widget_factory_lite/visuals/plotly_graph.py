#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import logging

import plotly
from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion


class PlotlyGraph(BaseConversion):
    """
    The PlotlyGraph class has the required conversion function to translate a plotly object or a plotly dictionary
    into a JSON structure that can be rendered as the Metric/KPIs component on the Co.dx UI.
    _________________________________________________________________________

    Args:
        plot_object (dict or plotly.graph_objs.Figure):  A dictionary or a plotly object. If dictionary, it is required to have keys data and layout.
        dropdown_options (list, optional): A list of options, with each option being a dictionary having two mandatory keys - label, value.
            This value will become the action_type that can be referred in the UIac.
        selected_option_value (str, optional): Used to set a particular option from the dropdown. The string value should be
            the selected option value. By default this is set to the value of the first option.
        dropdown_label (str, optional): Used to set the label of the dropdown. By default, it is set to 'Select'.
    _________________________________________________________________________

    Attributes:
        json_string (str): This attribute generates a JSON string for the component
    _________________________________________________________________________

    Usage
    -----
    - Sample code
    >>> from codex_widget_factory_lite.visuals.plotly_graph import PlotlyGraph
    >>> import plotly.express as px
    >>> df = px.data.iris()
    >>> fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
    >>> graph_json = PlotlyGraph(plot_object = fig).json_string

    Returns
    -------
    The `json_string` attribute returns a JSON string that is used to render the component on the UI
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
        {
            "data": "<Plotly graph data - varies by graph type>",
            "layout": "<Plotly layout config>",
        }
    ```

    """

    DEFAULT_CODE = """
from codex_widget_factory_lite.visuals.plotly_graph import PlotlyGraph
import plotly.graph_objects as go

fig = go.Figure(go.Waterfall(
    name = "20", orientation = "v",
    measure = ["relative", "relative", "total", "relative", "relative", "total"],
    x = ["Sales", "Consulting", "Net revenue", "Purchases", "Other expenses", "Profit before tax"],
    textposition = "outside",
    text = ["+60", "+80", "", "-40", "-20", "Total"],
    y = [60, 80, 0, -40, -20, 0],
    connector = {"line":{"color":"rgb(63, 63, 63)"}},
))

fig.update_layout(
    title = "Profit and loss statement 2018",
    showlegend = True
)

dynamic_outputs = PlotlyGraph(plot_object = fig).json_string
"""

    def __init__(self, plot_object, dropdown_options=[], selected_option_value="", dropdown_label="Select"):
        """
        `plot object` can either be a plotly object or a dictionary with keys - data and layout
        """
        super().__init__()
        self.__initialise_component_dict(plot_object, dropdown_options, selected_option_value, dropdown_label)

    def __initialise_component_dict(self, plot_object, dropdown_options, selected_option_value, dropdown_label):
        # check if `plot_object` is a plotly object
        if isinstance(plot_object, plotly.graph_objs._figure.Figure):
            self.component_dict = json.loads(plot_object.to_json())
        elif type(plot_object) is dict:
            if "data" in plot_object and "layout" in plot_object:
                self.component_dict = plot_object
            else:
                logging.warn(
                    "The plot_object dictionary does not represent a plotly object. Data and layout are mandatory keys for a plotly json structure"
                )
                self.component_dict = {"data": [], "layout": {}}
        else:
            logging.warn("plot_object is neither a plotly object nor a dictionary - defaulting to empty fig object")
            self.component_dict = {"data": [], "layout": {}}

        if dropdown_options:
            self.component_dict["dropdownConfig"] = {
                "options": dropdown_options,
                "selectedOptionValue": selected_option_value or dropdown_options[0]["value"],
                "dropdownLabel": dropdown_label,
            }
