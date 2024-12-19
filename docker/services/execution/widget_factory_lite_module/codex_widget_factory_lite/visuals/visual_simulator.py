#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


import ast
import json

import pandas as pd
from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion
from plotly.io import to_json


class VisualSimulator(BaseConversion):
    """
    The Simulator class has the required conversion function to translate a object
    into a JSON structure that can be rendered simulator component on the Co.dx UI.

    """

    def __init__(self, figure_obj, simulator_options_table, simulator_buttons_table, screen_json):
        """
        Description
        -----------
        The function helps to make a visual simulator with a plotly plot
        along with simulator section.
        Simulator has options of slider, upload, radio, dropdown, input text, input number etc.,
        There is also control input option which can be set to make section sliders,
        or input sum not exceed the value specified on control option.
        Parameters
        ----------
        figure_obj : plotly figure, required
            A plotly figure object that needs to shown on UI.
        simulator_options_table : pandas dataframe, required
            The simulator options table is a dataframe that contains the properties
            for the simulator section.
            The table contains columns such as :
                "header", "input_type", "label", "id", "value", "options", "max", "min", "steps", "control"

            The simulator on the screen, contains various sections.
            "header" - string, Contains the name of headers.
                Each section is identifed by headers.
                The Header given here is applied to section name
            "input-type" - string, The name of the input type.
                Can be one of - "slider", "upload", "radio", "text", "number", "dropdown"
                The properties required by each of the input type is provided below.
                    "slider" - "label", "id", "value", "max", "min", "steps", "control"
                    "upload" - "label", "id", "value"
                    "radio" - "label", "id", "value", "options"
                    "text" - "label", "id", "value"
                    "number" - "label", "id", "value", "max", "min", "steps", "control"
                    "dropdown" - "label", "id", "value", "options"
            "label" - string, The name of the simulator option.
                This name is shown on the UI.
            "id" - string, The identifier for the simulator option.
                This name can be used for the tracking of changes.
            "value" - int, string, list, The value of the simulator option.
                We can set a default value to appear on screen.
                The value is a list for the upload input-type, due to possibility of
                multiple files to be uploaded.
            "options" - list, The list of options to be shown on the UI.
                The options are useful for dropdown input, radio input.
            "max" - int, float, The maximum value for the simulator input.
            "min" - int, float, The minimum value for the simulator input.
            "steps" - int, float, The steps that can be applied to the value.
                Increase / Decrease the value by the given no.of steps / multiple of steps
            "control": list, Contains the keys of other inputs which should be controlled
                Specify this option for the input that shall control other inputs.
                Can be applied for only number/decimal type inputs.
        simulator_buttons_table : pandas dataframe, required
            The dataframe contains buttons properties for simulator section.
            The columns are "name", "variant", "type", "action", "action_flag_type"
            Each row contains the properties for the buttons.
            "name" - string, Name of the button
            "variant" - string, button variant - "outlined" / "contained"
            "type" - string, Not used. specify "primary" / "upload" / "reset" / "submit" etc.,
            "action" - string, Not used. specify "modify" / "upload" / "reset" / "submit" etc.,
            "action_flag_type" - string, Used for tracking.
                Give a unique name of action_flag_type so as to identify the button click.
        screen_json : dict, required
            Provide the screen json with the value that comes from UI.
            The screen json is the screen_data.
        Usage
        -----
        >>> visual_simulator_dict = get_response_visual_simulator_screen(....)
        >>> dynamic_outputs = json.dumps(visual_simulator_dict)
        Returns
        -------
        A dict object containing visual simulator structure.
        It contains simulator_options, plotly plot.
        """
        super().__init__()
        full_visual_simulator_dict = {}
        visual_sim_json = to_json(figure_obj)
        full_visual_simulator_dict = json.loads(visual_sim_json)
        if screen_json:
            full_visual_simulator_dict["simulator_options"] = screen_json["simulator_options"]
        else:
            full_visual_simulator_dict["simulator_options"] = self.__get_simulator_options_dict(
                simulator_df=simulator_options_table,
                simulator_buttons_df=simulator_buttons_table,
            )
        self.component_dict = full_visual_simulator_dict

    def __get_simulator_options_dict(self, simulator_df, simulator_buttons_df):
        """
        Internal function to make table / visual simulator section
        headers, options dict.
        Returns
        -------
        A dict object containing simulator options, sections, headers
        """
        simulator_options_required = {
            "slider": [
                "input_type",
                "label",
                "id",
                "value",
                "max",
                "min",
                "steps",
                "control",
            ],
            "upload": ["input_type", "label", "id", "value"],
            "radio": ["input_type", "label", "id", "value", "options"],
            "text": ["input_type", "label", "id", "value"],
            "number": [
                "input_type",
                "label",
                "id",
                "value",
                "max",
                "min",
                "steps",
                "control",
            ],
            "dropdown": ["input_type", "label", "id", "value", "options"],
        }
        simulator_options_dict = {}
        header_names = list(simulator_df["header"].unique())
        sections_info_list = []
        object_columns = []
        for col_name in list(simulator_df.keys()):
            if simulator_df[col_name].dtype == "object":
                object_columns.append(col_name)
        for header in header_names:
            simulator_df_filtered = simulator_df[simulator_df["header"] == header]
            section_dict = {}
            section_options_list = []
            for index_name in list(simulator_df_filtered.index):
                raw_option_dict = simulator_df_filtered.loc[index_name].to_dict()
                for key_name in object_columns:
                    try:
                        raw_option_dict[key_name] = ast.literal_eval(raw_option_dict[key_name])
                    except Exception:
                        # temp_val = 1
                        pass
                option_dict = {
                    key: value
                    if type(value)
                    in [
                        str,
                        pd._libs.tslibs.timestamps.Timestamp,
                        list,
                        float,
                        int,
                        bool,
                    ]
                    else value.item()
                    for key, value in raw_option_dict.items()
                    if key in simulator_options_required[raw_option_dict["input_type"]]
                }
                if pd.isna(option_dict.get("control", "No Value")):
                    option_dict.pop("control", "No Value")
                section_options_list.append(option_dict)
            section_dict["header"] = header
            section_dict["inputs"] = section_options_list
            sections_info_list.append(section_dict)
        simulator_options_dict["sections"] = sections_info_list
        simulator_buttons_list = []
        for index_name in list(simulator_buttons_df.index):
            simulator_buttons_list.append(simulator_buttons_df.loc[index_name].to_dict())
        simulator_options_dict["actions"] = simulator_buttons_list
        return simulator_options_dict

    def get_simulator_option_user_input(screen_json):
        """
        Description
        -----------
        The function helps to get the simulator options which is
        modified by the user in the UI.

        The returned dict Contains values of all headers and Id's.

        Parameters
        ----------
        screen_json : dict, required
            The screen data that comes from UI.

        Returns
        -------
        The dict object (simulator_dict)
            The returned dict contains keys as headers and value as a dict
            which has keys as id's and values as value modified by user.
        """
        header_options_dict = {}
        for section_n in screen_json["simulator_options"]["sections"]:
            options_dict = {}
            for input_n in section_n["inputs"]:
                try:
                    options_dict[input_n["id"]] = input_n["value"]
                except Exception:
                    # temp_val = 1
                    pass
            header_options_dict[section_n["header"]] = options_dict

        return header_options_dict
