#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


import ast

import pandas as pd
from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion


class TableSimulator(BaseConversion):
    """
    The TableSimulator class has the required conversion function to translate a object
    into a JSON structure that can be rendered configurable form and other widgets on the Co.dx UI.

    """

    def __init__(
        self,
        main_table,
        aux_table,
        simulator_options_table,
        main_buttons_table,
        aux_buttons_table,
        simulator_buttons_table,
        main_table_name,
        aux_table_name,
        screen_json,
        main_indicator_option_table="",
        aux_indicator_option_table="",
        main_alt_behaviour_table="",
        aux_alt_behaviour_table="",
        main_suffix_option_table="",
        aux_suffix_option_table="",
        main_prefix_option_table="",
        aux_prefix_option_table="",
        main_formatted_option_table="",
        aux_formatted_option_table="",
        main_extra_values={},
        show_search_bar=True,
    ):
        super().__init__()
        self.__initialise_component_dict(
            main_table,
            aux_table,
            simulator_options_table,
            main_buttons_table,
            aux_buttons_table,
            simulator_buttons_table,
            main_table_name,
            aux_table_name,
            screen_json,
            main_indicator_option_table,
            aux_indicator_option_table,
            main_alt_behaviour_table,
            aux_alt_behaviour_table,
            main_suffix_option_table,
            aux_suffix_option_table,
            main_prefix_option_table,
            aux_prefix_option_table,
            main_formatted_option_table,
            aux_formatted_option_table,
            main_extra_values,
            show_search_bar,
        )

    def __initialise_component_dict(
        self,
        main_table,
        aux_table,
        simulator_options_table,
        main_buttons_table,
        aux_buttons_table,
        simulator_buttons_table,
        main_table_name,
        aux_table_name,
        screen_json,
        main_indicator_option_table="",
        aux_indicator_option_table="",
        main_alt_behaviour_table="",
        aux_alt_behaviour_table="",
        main_suffix_option_table="",
        aux_suffix_option_table="",
        main_prefix_option_table="",
        aux_prefix_option_table="",
        main_formatted_option_table="",
        aux_formatted_option_table="",
        main_extra_values={},
        show_search_bar=True,
    ):
        self.component_dict = self.get_response_table_simulator_screen(
            main_table,
            aux_table,
            simulator_options_table,
            main_buttons_table,
            aux_buttons_table,
            simulator_buttons_table,
            main_table_name,
            aux_table_name,
            screen_json,
            main_indicator_option_table,
            aux_indicator_option_table,
            main_alt_behaviour_table,
            aux_alt_behaviour_table,
            main_suffix_option_table,
            aux_suffix_option_table,
            main_prefix_option_table,
            aux_prefix_option_table,
            main_formatted_option_table,
            aux_formatted_option_table,
            main_extra_values,
            show_search_bar,
        )

    def get_response_table_simulator_screen(
        self,
        main_table,
        aux_table,
        simulator_options_table,
        main_buttons_table,
        aux_buttons_table,
        simulator_buttons_table,
        main_table_name,
        aux_table_name,
        screen_json,
        main_indicator_option_table="",
        aux_indicator_option_table="",
        main_alt_behaviour_table="",
        aux_alt_behaviour_table="",
        main_suffix_option_table="",
        aux_suffix_option_table="",
        main_prefix_option_table="",
        aux_prefix_option_table="",
        main_formatted_option_table="",
        aux_formatted_option_table="",
        main_extra_values={},
        show_search_bar=True,
    ):
        """
        Description
        -----------
        The function helps to make a table simulator with a main table
        and an auxiliary table along with simulator section.

        The tables have options to add input boxes, dropdowns, action-icons etc.,

        Simulator has options of slider, upload, radio, dropdown, input text, input number etc.,
        There is also control input option which can be set to make section sliders,
        or input sum not exceed the value specified on control option.

        Parameters
        ----------
        main_table : pandas dataframe, required
            The main_table is a dataframe of n_rows, n_columns.
            It contains values that need to shown on the main table of the screen.
            A scroll option is applied on UI if n_rows is high.
        aux_table : pandas dataframe, required
            The aux_table is a dataframe of n_rows, n_columns.
            It contains values that need to shown on the auxiliary table
            of the screen.
            A scroll option is applied on UI if n_rows is high.
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

        main_buttons_table : pandas dataframe, required
            The dataframe contains buttons properties for main table section.
            The columns are "name", "variant", "type", "action", "action_flag_type"
            Each row contains the properties for the buttons.
            "name" - string, Name of the button
            "variant" - string, button variant - "outlined" / "contained"
            "type" - string, Not used. specify "primary" / "upload" / "reset" / "submit" etc.,
            "action" - string, Not used. specify "modify" / "upload" / "reset" / "submit" etc.,
            "action_flag_type" - string, Used for tracking.
                Give a unique name of action_flag_type so as to identify the button click.

        aux_buttons_table : pandas dataframe, required
            The dataframe contains buttons properties for aux table section.
            The columns are "name", "variant", "type", "action", "action_flag_type"
            Each row contains the properties for the buttons.
            "name" - string, Name of the button
            "variant" - string, button variant - "outlined" / "contained"
            "type" - string, Not used. specify "primary" / "upload" / "reset" / "submit" etc.,
            "action" - string, Not used. specify "modify" / "upload" / "reset" / "submit" etc.,
            "action_flag_type" - string, Used for tracking.
                Give a unique name of action_flag_type so as to identify the button click.

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

        main_table_name : string, required
            The name of main table.

        aux_table_name : string, required
            The name of auxiliary table.

        screen_json : dict, required
            Provide the screen json with the value that comes from UI.
            The screen json is the screen_data.

        main_indicator_option_table : pandas dataframe or string, optional (default="")
            An indicator for all cells or certain cells of main_table.
            A string value, when the indicator is same for all cells in main
            table. The value can be one of - "", "Up", "Down", "dropdown", "input", "action-icon".
            A dataframe is given when we need different indicators in different cells.
            If dataframe, the main_indicator_option_table should have shape
            as the shape of main_table provided.
            If indicator is required to certain cell of a column, row pair then,
            pass the indicator at those cells in the main_indicator_option_table.
            Below mentioned indicators can be used accordingly to the use case,
                "" - empty string implies No indicator
                "Up" - To show the value in green color.
                "Down" - To show the value in red color.
                "dropdown" - gives a dropdown on the UI
                "action-icon" - gives a action like delete icon etc., on the UI
                "input" - gives a input box on the UI.

        aux_indicator_option_table : pandas dataframe or string, optional (default="")
            An indicator for all cells or certain cells of aux_table.
            A string value, when the indicator is same for all cells in auxiliary
            table. The value can be one of - "",
            A dataframe is given when we need different indicators in different cells.
            If dataframe, the aux_indicator_option_table should have shape
            as the shape of aux_table provided.
            If indicator is required to certain cell of a column, row pair then,
            pass the indicator at those cells in the the aux_indicator_option_table.
            Below mentioned indicators can be used accordingly to the use case,
                "" - empty string implies No indicator.
                "Up" - To show the value in green color.
                "Down" - To show the value in red color.

        main_alt_behaviour_table : pandas dataframe or bool, optional (default="")
            Alternate behaviour value.
            A bool value, when the alternate behaviour is needed for all cells in
            main table. The value can be True / False
            A dataframe is given when we need different alt_behaviour in different cells.
            If dataframe, the main_alt_behaviour_table should have shape
            as the shape of main_table provided.
            If alt_behaviour is required to certain cell of a column, row pair then,
            pass the True/False at those cells in the main_alt_behaviour_table.

        aux_alt_behaviour_table : pandas dataframe or bool, optional (default="")
            Alternate behaviour value.
            A bool value, when the alternate behaviour is needed for all cells in
            auxiliary table. The value can be True / False
            A dataframe is given when we need different alt_behaviour in different cells.
            If dataframe, the aux_alt_behaviour_table should have shape
            as the shape of main_table provided.
            If alt_behaviour is required to certain cell of a column, row pair then,
            pass the True/False at those cells in the aux_alt_behaviour_table.

        main_suffix_option_table : pandas dataframe or string, optional (default="")
            Suffix option value.
            A string value, when the suffix is same for all cells in main table.
            The suffix value will be shown as suffix to the value in main table of UI.
            A dataframe is given when we need different suffixes in different cells.
            If dataframe, the main_suffix_option_table should have shape
            as the shape of main_table provided.
            If suffix is required to certain cell of a column, row pair then,
            pass the suffix value at those cells in the main_suffix_option_table.

        aux_suffix_option_table : pandas dataframe or string, optional (default="")
            Suffix option value.
            A string value, when the suffix is same for all cells in auxiliary table.
            The suffix value will be shown as suffix to the value in auxiliary table of UI.
            A dataframe is given when we need different suffixes in different cells.
            If dataframe, the aux_suffix_option_table should have shape
            as the shape of aux_table provided.
            If suffix is required to certain cell of a column, row pair then,
            pass the suffix value at those cells in the aux_suffix_option_table.

        main_prefix_option_table : pandas dataframe or string, optional (default="")
            Prefix option value.
            A string value, when the prefix is same for all cells in main table.
            The prefix value will be shown as prefix to the value in main table of UI.
            A dataframe is given when we need different prefixes in different cells.
            If dataframe, the main_prefix_option_table should have shape
            as the shape of main_table provided.
            If prefix is required to certain cell of a column, row pair then,
            pass the prefix value at those cells in the main_prefix_option_table.

        aux_prefix_option_table : pandas dataframe or string, optional (default="")
            Prefix option value.
            A string value, when the prefix is same for all cells in auxiliary table.
            The prefix value will be shown as prefix to the value in auxiliary table of UI.
            A dataframe is given when we need different prefixes in different cells.
            If dataframe, the aux_prefix_option_table should have shape
            as the shape of aux_table provided.
            If prefix is required to certain cell of a column, row pair then,
            pass the prefix value at those cells in the aux_prefix_option_table.

        main_formatted_option_table : pandas dataframe or bool, optional (default="")
            Format option value.
            Formats the number by adding commas to the value in main table of UI.
            A bool value, when the formatting is needed for all cells in
            main table. The value can be True / False
            A dataframe is given when we need formatting in different cells.
            If dataframe, the main_formatted_option_table should have shape
            as the shape of main_table provided.
            If formatting is required to certain cell of a column, row pair then,
            pass the True/False at those cells in the main_formatted_option_table.

        aux_formatted_option_table : pandas dataframe or bool, optional (default="")
            Format option value.
            Formats the number by adding commas to the value in auxiliary table of UI.
            A bool value, when the formatting is needed for all cells in
            auxiliary table. The value can be True / False
            A dataframe is given when we need formatting in different cells.
            If dataframe, the aux_formatted_option_table should have shape
            as the shape of aux_table provided.
            If formatting is required to certain cell of a column, row pair then,
            pass the True/False at those cells in the aux_formatted_option_table.

        main_extra_values : dict, optional (default={})
            The main_extra_values is requried when the action-icon, dropdowns are
            added to main_table as indicators.
            It's a key-value pair of column name and values relevant to given indicator.
            If indicator for column is 'action-icon', then value contains a dict.
                The dict format is - {'type': "delete",
                                    'icon_color': <hex_code_of_color>,
                                    'action_flag_type': <name of action to trace>}
            If indicator for column is 'dropdown', then value contains a list.

        show_search_bar : bool, optional (default=True)
            The option to whether or not, provide a search bar for main table.

        Usage
        -----
        >>> table_simulator_dict = get_response_table_simulator_screen(....)
        >>> dynamic_outputs = json.dumps(table_simulator_dict)

        Returns
        -------
        A dict object containing table simulator structure.
        It contains simulator_options, main_table, aux_table
        """

        full_table_simulator_dict = {}
        full_table_simulator_dict["aux_table"] = self._get_table_simulator_dict(
            df_table=aux_table,
            indicator_table=aux_indicator_option_table,
            alt_behaviour_table=aux_alt_behaviour_table,
            suffix_option_table=aux_suffix_option_table,
            prefix_option_table=aux_prefix_option_table,
            formatted_option_table=aux_formatted_option_table,
            buttons_table=aux_buttons_table,
            table_name=aux_table_name,
            select_values={},
        )

        full_table_simulator_dict["is_table_simulator"] = True
        full_table_simulator_dict["main_table"] = self._get_table_simulator_dict(
            df_table=main_table,
            indicator_table=main_indicator_option_table,
            alt_behaviour_table=main_alt_behaviour_table,
            suffix_option_table=main_suffix_option_table,
            prefix_option_table=main_prefix_option_table,
            formatted_option_table=main_formatted_option_table,
            buttons_table=main_buttons_table,
            table_name=main_table_name,
            select_values=main_extra_values,
        )

        if screen_json:
            full_table_simulator_dict["simulator_options"] = screen_json["simulator_options"]
        else:
            full_table_simulator_dict["simulator_options"] = self._get_simulator_options_dict(
                simulator_df=simulator_options_table,
                simulator_buttons_df=simulator_buttons_table,
            )
        if not show_search_bar:
            full_table_simulator_dict["suppress_search"] = True

        return full_table_simulator_dict

    def get_simulator_screen_variables(self):
        """
        The function helps to get the screen variables when using a
        simulator component.

        Returns
        -------
        A tuple containing - action_type, screen_data, selected_filters
        """
        if "action_type" in globals().keys():
            action_type = globals()["action_type"]
            screen_data = globals()["screen_data"]
            selected_filters = globals().get("filter_data", None)
        else:
            action_type = None
            screen_data = None
            selected_filters = globals().get("selected_filters", None)

        return action_type, screen_data, selected_filters

    def _get_simulator_options_dict(self, simulator_df, simulator_buttons_df):
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
            "": ["input_type", "label", "id", "value"],
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
                        tuple,
                        dict,
                    ]
                    else value.item()
                    for key, value in raw_option_dict.items()
                    if key in simulator_options_required[raw_option_dict["input_type"]]
                }

                if pd.isna(option_dict.get("control", "No Value")):
                    # control_val = option_dict.pop("control", "No Value")
                    pass

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

    def _get_table_simulator_dict(
        self,
        df_table,
        indicator_table,
        alt_behaviour_table,
        suffix_option_table,
        prefix_option_table,
        formatted_option_table,
        buttons_table,
        table_name,
        select_values,
    ):
        """
        Internal function to make table structure along with dropdowns, input
        boxes and actions icons etc., Also, formatting to table numbers,
        colors to cells, prefix and suffix options.

        Returns
        -------
        A dict object containing table structure for customized tables.
        """
        simulator_table_dict = {}
        simulator_table_dict["name"] = table_name
        simulator_table_dict["columns"] = list(df_table.keys())

        table_rows_list = []
        for index_name in list(df_table.index):
            row_list = []
            for col_name in list(df_table.keys()):
                cell_dict = {}
                value = df_table.at[index_name, col_name]
                cell_dict["value"] = (
                    value
                    if type(value)
                    in [
                        str,
                        pd._libs.tslibs.timestamps.Timestamp,
                        list,
                        float,
                        int,
                        bool,
                        tuple,
                        dict,
                    ]
                    else value.item()
                )
                cell_dict["indicator"] = (
                    str(indicator_table.at[index_name, col_name])
                    if isinstance(indicator_table, pd.DataFrame)
                    else str(indicator_table)
                )

                if cell_dict["indicator"] == "dropdown":
                    cell_dict["select_values"] = select_values[col_name]
                elif cell_dict["indicator"] == "input":
                    temp_val = 1
                elif cell_dict["indicator"] == "action-icon":
                    temp_val = cell_dict.pop("value", "No Value")
                    if temp_val == "y":
                        cell_dict["type"] = select_values[col_name]["type"] if temp_val == "y" else None
                        cell_dict["icon_color"] = select_values[col_name]["icon_color"] if temp_val == "y" else None
                        cell_dict["action_flag_type"] = (
                            select_values[col_name]["action_flag_type"] if temp_val == "y" else "None"
                        )
                    else:
                        cell_dict["value"] = ""
                        cell_dict["indicator"] = ""
                        cell_dict["alt_behaviour"] = False
                        cell_dict["suffix"] = ""
                        cell_dict["prefix"] = ""
                        cell_dict["formatted"] = False
                else:
                    cell_dict["alt_behaviour"] = (
                        bool(alt_behaviour_table.at[index_name, col_name])
                        if isinstance(alt_behaviour_table, pd.DataFrame)
                        else bool(alt_behaviour_table)
                    )
                    cell_dict["suffix"] = (
                        str(suffix_option_table.at[index_name, col_name])
                        if isinstance(suffix_option_table, pd.DataFrame)
                        else str(suffix_option_table)
                    )
                    cell_dict["prefix"] = (
                        str(prefix_option_table.at[index_name, col_name])
                        if isinstance(prefix_option_table, pd.DataFrame)
                        else str(prefix_option_table)
                    )
                    cell_dict["formatted"] = (
                        bool(formatted_option_table.at[index_name, col_name])
                        if isinstance(formatted_option_table, pd.DataFrame)
                        else bool(formatted_option_table)
                    )

                row_list.append(cell_dict)

            table_rows_list.append(row_list)

        simulator_table_dict["rows"] = table_rows_list

        table_buttons_list = []
        for index_name in list(buttons_table.index):
            table_buttons_list.append(buttons_table.loc[index_name].to_dict())

        simulator_table_dict["buttons"] = table_buttons_list

        return simulator_table_dict

    def get_simulator_option_default_input(self, simulator_options_table, simulator_buttons_table):
        """
        Description
        -----------
        The function helps to get the simulator options which is
        modified by the user in the UI.

        The returned dict Contains values of all headers and Id's.

        Parameters
        ----------
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

        Returns
        -------
        The dict object (simulator_dict)
            The returned dict contains keys as headers and value as a dict
            which has keys as id's and values as value modified by user.
        """
        simulator_dict = {}
        simulator_dict["simulator_options"] = self.__get_simulator_options_dict(
            simulator_df=simulator_options_table,
            simulator_buttons_df=simulator_buttons_table,
        )

        header_options_dict = self.get_simulator_option_user_input(screen_json=simulator_dict)
        return header_options_dict

    def get_simulator_option_user_input(self, screen_json):
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

    def get_main_table_user_input(self, screen_json):
        """
        Description
        -----------
        The function helps to get the main table which is
        modified by the user in the UI.

        Parameters
        ----------
        screen_json : dict, required
            The screen data that comes from UI.

        Returns
        -------
        The pandas dataframe (main_df)
            Contains values of all cells in main table as dataframe.
        """
        main_df_columns = screen_json["main_table"]["columns"]
        main_df = pd.DataFrame(columns=main_df_columns)
        for row_n in range(len(screen_json["main_table"]["rows"])):
            for col_n in range(len(main_df_columns)):
                main_df.at[row_n, main_df_columns[col_n]] = screen_json["main_table"]["rows"][row_n][col_n]["value"]

        return main_df
