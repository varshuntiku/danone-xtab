#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json

from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion
from plotly.io import to_json


class DynamicForm(BaseConversion):
    """
    The DynamicForm class has the required conversion function to translate a object or a dynamic form
    into a JSON structure that can be rendered configurable form and other widgets on the Co.dx UI.

    """

    def __init__(self):
        self.fields = []
        super().__init__()
        form_config = {}
        form_config["fields"] = self.fields
        self.component_dict["form_config"] = form_config

    def append(self, data):
        self.fields.append(data)

    def add_simulator(self, simulator_values_df, simulator_actions_df, label="Simulator", size="small"):
        self.append(self.get_simulator(simulator_values_df, simulator_actions_df, label, size))

    def get_simulator(self, simulator_values_df, simulator_actions_df, label="Simulator", size="small"):
        """A dynamic form widget component, to get a simulator
        Args:
            simulator_values_df (pandas dataframe): The simulator options table is a dataframe that contains the properties for the simulator section.
                                                    The table contains columns such as :"header", "input_type", "label", "id", "value", "options", "max", "min", "steps", "control".
                                                    simulator_df = pd.DataFrame({
                                                    'header': ['TRX Range','NBRX Range', 'Caliper',"Enter Month"],
                                                    'input_type': ['slider','slider','slider','dropdown'],
                                                    'id': ['a','b','c','d'],
                                                    'label': ['TRX Range','NBRX Range', 'Caliper','Enter Month'],
                                                    'value': [10, 10, 10,'Jan-20'],
                                                    'options':[' ',' ',' ',['Jan-20','Feb-20','March-20','Apr-20']],
                                                    'max': [10,10,10,10],
                                                    'min': [0,0,0,0],
                                                    'steps': [2,2,1,2],
                                                    'control': [0,0,0,2]
                                                    })

            simulator_actions_df (pandas dataframe): simulator_buttons_df = pd.DataFrame({
                                                    'name':['Analyse Changes'],
                                                    'action_flag_type':['Simulator_section_analyse_changes'],
                                                    'variant': ['outlined'],
                                                    })

            label (str, optional): display name of the button, defaults to 'Simulator'.
            size (str, optional): size of the button, defaults to 'small'.
        Returns:
            dict: a simulator dictionary
        """

        comp_dict = {}
        sections_list = []
        for head in simulator_values_df["header"].unique():
            header_dict = {}
            header_df = simulator_values_df[simulator_values_df["header"] == head]
            header_dict["header"] = head
            header_dict["inputs"] = header_df.loc[:, header_df.columns != "header"].to_dict("records")
            sections_list.append(header_dict)
        comp_dict["sections"] = sections_list
        comp_dict["actions"] = simulator_actions_df.to_dict("records")
        comp_dict["trigger"] = {"text": label, "size": size}

        return comp_dict

    def add_download_button(self, label, url, grid="auto", name=None, **kwargs):
        self.append(self.get_download_button(label, url, grid, name, **kwargs))

    def get_download_button(self, label, url, grid="auto", name=None, **kwargs):
        """A dynamic form widget component, used to download a file using a button

        Args:
            label (string): label of the button
            url (string): url of the file
            grid (str, int, bool, optional): used to define how space should element"s container should consume.
                                    Defaults to "auto". possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", True, False.

        Returns:
            dictionary : download button dictionary
        """
        comp_dict = {}
        comp_dict["type"] = "downloadLink"
        comp_dict["is_button"] = True
        comp_dict["fullWidth"] = True
        comp_dict["grid"] = grid
        comp_dict["label"] = label
        comp_dict["value"] = url
        comp_dict["variant"] = "outlined"
        comp_dict["name"] = name

        for key, value in kwargs.items():
            comp_dict[key] = value

        return comp_dict

    def add_upload_button(self, label, properties, grid="auto", name=None, **kwargs):
        self.append(self.get_upload_button(label, properties, grid, name, **kwargs))

    def get_upload_button(self, label, properties, grid="auto", name=None, **kwargs):
        """A dynamic form widget component, used to upload a file using a button

        Args:
            label (string): label of the button
            properties (dictionary): used to specify the extension of the uploading file and other properties. usage for csv file, {'accept': '*.csv, .xlsx'}
            grid (str, int, bool, optional): used to define how space should element"s container should consume.
                                    Defaults to "auto". possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", true, False.
        Returns:
            dictionary: upload button dictionary
        """
        comp_dict = {}
        comp_dict["type"] = "upload"
        comp_dict["label"] = label
        comp_dict["name"] = name
        comp_dict["is_button"] = True
        comp_dict["inputprops"] = properties
        comp_dict["validator"] = "upload"
        comp_dict["variant"] = "outlined"
        comp_dict["grid"] = grid

        for key, value in kwargs.items():
            comp_dict[key] = value

        return comp_dict

    def add_header_text(
        self, value, properties=[{"variant": "h4", "align": "center"}], grid="auto", name=None, **kwargs
    ):
        self.append(self.get_header_text(value=value, properties=properties, grid=grid, name=name, **kwargs))

    def get_header_text(self, value, properties={"variant": "h4", "align": "center"}, grid="auto", name=None, **kwargs):
        """A dynamic form widget component, used to get the header of a component (insights and graphs)

        Args:
            value (string): header of the component
            properties (list, optional): used to specify the properties of the value. Defaults to [{"variant": "h4", "align": "center"}].
            grid (str, int, bool, optional): used to define how space should element"s container should consume.
                                    Defaults to "auto". possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", true, False.

        Returns:
            dictionary: header dictionary
        """

        comp_dict = {}
        comp_dict["type"] = "label"
        comp_dict["noGutterBottom"] = True
        comp_dict["value"] = value
        comp_dict["InputLabelProps"] = properties
        comp_dict["grid"] = grid
        comp_dict["name"] = name

        for key, value in kwargs.items():
            comp_dict[key] = value

        return comp_dict 

    def add_insights_values(self, df, grid=3, **kwargs):
        self.append(self.get_insights_values(df, grid, **kwargs))

    def get_insights_values(self, df, grid=3, **kwargs):
        """A dynamic form widget component, used to get insights

        Args:
            df (pandas dataframe): dataframe with only two columns named label and value, where label column
                                has title of insights in list and value column has values for insights

                                df = pd.DataFrame([{"label": "["PERCENTAGE OF ITEMS"]", "value": "43%"},
                                                        {"label": "["$ SALES SHARE"]", "value": "11.0%"},
                                                        {"label": "["ACV RANGE"]", "value": "3.692-41.55"},
                                                        {"label": "["AVG $/MM ACV"]", "value": "23.0"},
                                                        {"label": "["IGM RANGE"]", "value": "25.95-70.99"}])
            grid (str, int, bool, optional): used to define how much space element's container should consume.
                                    Defaults to "auto". possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", True, False.

        Returns:
            dictionary: insights values dictionary
        """
        comp_dict = {}
        comp_dict["grid"] = grid
        comp_dict["type"] = "widget"
        comp_dict["value"] = {
            "insight_data": df.to_dict("records"),
            "insight_label": "Alerts",
        }
        for val in comp_dict["value"]["insight_data"]:
            val["label"] = [val["label"]]

        for key, value in kwargs.items():
            comp_dict[key] = value
        return comp_dict

    def add_dynamic_table(
        self,
        df,
        col_props={},
        grid_options={"tableSize": "small", "tableMaxHeight": "80vh"},
        group_headers=[],
        row_params=None,
        cell_params=None,
        grid="auto",
        table_name="table",
        **kwargs
    ):
        self.append(
            self.generate_dynamic_table(
                df, col_props, grid_options, group_headers, row_params, cell_params, grid, table_name, **kwargs
            )
        )

    def generate_dynamic_table(
        self,
        df,
        col_props={},
        grid_options={"tableSize": "small", "tableMaxHeight": "80vh"},
        group_headers=[],
        row_params=None,
        cell_params=None,
        grid="auto",
        table_name="table",
        **kwargs
    ):
        """A dynamic form widget component, to create a customized table


        Args:
            df (pandas dataframe): input data
            col_props (dict, optional): used to specify properties of a column. Defaults to {}.
                                        { 'country': {"sticky": True}, 'population': {'sortable': True, 'width' : '200px'}}
            grid_options (dict, optional): used to specify the properties of the table. Defaults to {"tableSize": "small", "tableMaxHeight": "20vh"}.
            group_headers (list, optional): used to merge columns. Defaults to [].
            row_params (dict, optional): used to define properties for individual rows of the table
                                        make sure to pass 'rowParamsField' in grid_options ex: grid_options['rowParamsField']='row_properties' before using this argument
                                        sample: {0:{'highlight':True}, 2:{'error':True}}
            cell_params (dict, optional): used to define properties for cells of the table.
                                        sample: {('column_name', 0):{'highlight':True}, ('column_2', 2):{'highlight':True}}
                                        key must be tuple with column_name and index as first and second element respectively
            grid (str, int, bool, optional): used to define how space should element's container should consume.
                                    Defaults to "auto". possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", True, False.
            table_name (str, optional): name of the table to be stored in screen_data
        Returns:
            dict: a customized table dictionary
        """
        table_dict = {}
        table_props = {}
        table_dict.update({"grid": grid, "type": "tabularForm"})
        values_dict = df.dropna(axis=1).to_dict("records")
        row_params_list = [] if row_params is None else list(row_params.keys())
        row_props_list = []
        for index, row_values in enumerate(values_dict):
            row_props_dict = {}
            if "rowParamsField" in grid_options:
                if index in row_params_list:
                    row_props_dict[grid_options["rowParamsField"]] = row_params[index].copy()
            for col_name, row_value in row_values.items():
                row_props_dict[col_name] = row_value
                cell_params_dict = {} if cell_params is None else cell_params.copy()
                if (col_name, index) in cell_params_dict:
                    row_props_dict[col_name + "_params"] = {}
                    row_props_dict[col_name + "_params"].update(cell_params_dict[(col_name, index)])
            row_props_list.append(row_props_dict)
        table_dict.update({"value": row_props_list})
        col_props_list = []
        for col in df.columns:
            col_props_dict = {}
            col_props_dict.update({"headerName": col, "field": col, "cellParamsField": col + "_params"})
            if col in col_props:
                col_props_dict.update(col_props[col])
            col_props_list.append(col_props_dict)
        table_props["groupHeaders"] = group_headers
        table_props["coldef"] = col_props_list
        table_props["gridOptions"] = grid_options
        table_dict.update({"tableprops": table_props})
        table_dict["name"] = table_name

        for key, value in kwargs.items():
            table_dict[key] = value

        return table_dict

    def add_action_button(self, df, grid="12", name=None, **kwargs):
        self.append(self.generate_action_button(df, grid, name, **kwargs))

    def generate_action_button(self, df, grid="12", name=None, **kwargs):
        """A dynamic form widget component, to create action buttons

        Args:
            df (pandas dataframe): df with columns ['name', 'size', 'variant', 'action_type']
            grid (str, int, bool, optional): used to define how much space element's container should consume.
                                    Defaults to "auto", possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", True, False.

        Returns:
            dict: a action button dictionary
        """

        comp_dict = {}
        comp_dict["type"] = "actionButtons"
        comp_dict["variant"] = "outlined"
        comp_dict["value"] = df.to_dict("records")
        comp_dict["grid"] = grid
        comp_dict["name"] = name

        for key, value in kwargs.items():
            comp_dict[key] = value

        return comp_dict

    def add_graph(self, figure_obj, height="250px", grid="auto", name=None, **kwargs):
        self.append(self.get_graph(figure_obj, height, grid, name, **kwargs))

    def get_graph(self, figure_obj, height="250px", grid="auto", name=None, **kwargs):
        """A dynamic form widget component, to create plots

        Args:
            figure_obj (figure object/ figure, required): plotly figure object of the required plot
            height (str,optional): used to define the height of the plot, defaults to '250px'
            grid (str, int, bool, optional): used to define how much space this plot should use
                                    Defaults to "auto". Possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", True, False.

        Returns:
            dict: a graph dictionary
        """

        comp_dict = {}
        comp_dict["type"] = "widget"
        comp_dict["gridHeight"] = height
        comp_dict["value"] = json.loads(to_json(figure_obj))
        comp_dict["grid"] = grid
        comp_dict["name"] = name

        for key, value in kwargs.items():
            comp_dict[key] = value

        return comp_dict

    def add_download_data(self, df, name=None, **kwargs):
        self.append(self.get_download_data(df, name, **kwargs))

    def get_download_data(self, df, name=None, **kwargs):
        """used to download the dataframe of the table using a button (download icon)

        Args:
            df (pandas dataframe, required): dataframe of the component that needs to be downloaded

        Returns:
            dictionary : download data dictionary
        """

        download_list = []
        download_data = {}
        download_data["table_data"] = df.to_json(orient="records")
        download_data["table_headers"] = [{"id": col, "label": col} for col in df.columns]
        download_list.append(download_data)
        download_data["name"] = name

        for key, value in kwargs.items():
            download_data[key] = value

        return download_list

    def add_input(
        self,
        label,
        name,
        input_type="text",
        grid="auto",
        placeholder="",
        value="",
        margin="none",
        variant="outlined",
        error=False,
        helpertext="Field is Mandatory",
        **kwargs
    ):
        self.append(
            self.get_input(
                label, name, input_type, grid, placeholder, value, margin, variant, error, helpertext, **kwargs
            )
        )

    def get_input(
        self,
        label,
        name,
        input_type="text",
        grid="auto",
        placeholder="",
        value="",
        margin="none",
        variant="outlined",
        error=False,
        helpertext="Field is Mandatory",
        **kwargs
    ):
        """a dynamic form widget, to get input box for text and number

        Args:
            label (str): Name of the input field
            name (str): Name attribute of the input element
            input_type (str, optional): type of the input. Defaults to 'text'. ('text', 'number')
            grid (str, int, bool, optional): used to define how space should element"s container should consume.
                            Defaults to "auto". possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", true, False.
            placeholder (str): The short hint displayed in the input before the user enters a value.
            value (str, optional): The value of the input element, required for a controlled component. Defaults to ''.
            margin (str, optional): If dense, will adjust vertical spacing. Defaults to 'none'.
            variant (str): variant of input outlined, contained etc.
            error (str, optional): If true, the input will indicate an error.
            helpertext (str, optional): message that need to be shown when there is error

        Returns:
            dict: a input box dictionary
        """
        comp_dict = {}
        comp_dict["name"] = name
        comp_dict["placeholder"] = placeholder
        comp_dict["type"] = input_type
        comp_dict["label"] = label
        comp_dict["value"] = value
        comp_dict["margin"] = margin
        comp_dict["variant"] = variant
        comp_dict["fullWidth"] = True
        comp_dict["grid"] = grid
        comp_dict["error"] = error
        comp_dict["helperText"] = helpertext if error else None
        for key, value in kwargs.items():
            comp_dict[key] = value

        return comp_dict

    def add_date_input(
        self,
        label,
        name,
        default_time,
        variant="outlined",
        date_format="DD/MM/yyyy",
        placeholder="Enter Date",
        grid=6,
        **kwargs
    ):
        self.append(self.get_date_input(label, name, default_time, variant, date_format, placeholder, grid, **kwargs))

    def get_date_input(
        self,
        label,
        name,
        default_time,
        variant="outlined",
        date_format="DD/MM/yyyy",
        placeholder="Enter Date",
        grid=6,
        **kwargs
    ):
        """a dynamic form widget, to get date input box

        Args:
            label (str): label attribute of the input element (label of the input box)
            name (str): Name attribute of the input element (this name will be stored in screen data)
            default_time (str): Default date when the screen is loaded. example: "2022-12-08T00:00:00"
            variant (str): variant of input outlined, contained etc.
            date_format (str): Date format default 'DD/MM/yyyy'
            placeholder (str): The short hint displayed in the input before the user enters a value.
            grid (str, int, bool, optional): used to define how space should element"s container should consume.
                                    Defaults to "auto". possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", true, False.

        Returns:
            dict: a input box dictionary
        """
        comp_dict = {}
        comp_dict["name"] = name
        comp_dict["suppressUTC"] = True
        comp_dict["label"] = label
        comp_dict["type"] = "datepicker"
        comp_dict["variant"] = variant
        comp_dict["value"] = default_time
        comp_dict["inputprops"] = {
            "format": date_format,
        }
        comp_dict["placeholder"] = placeholder
        comp_dict["fullWidth"] = True
        comp_dict["grid"] = grid

        for key, value in kwargs.items():
            comp_dict[key] = value

        return comp_dict

    def add_dropdown_input(
        self,
        label,
        name,
        options,
        value="",
        grid="auto",
        variant="outlined",
        multi_select=False,
        error=False,
        helpertext="Field is Mandatory",
        **kwargs
    ):
        self.append(
            self.get_dropdown_input(
                label, name, options, value, grid, variant, multi_select, error, helpertext, **kwargs
            )
        )

    def get_dropdown_input(
        self,
        label,
        name,
        options,
        value="",
        grid="auto",
        variant="outlined",
        multi_select=False,
        error=False,
        helpertext="Field is Mandatory",
        **kwargs
    ):
        """a dynamic form widget, to get input box

        Args:
            label (str): label attribute of the input element (label of the input box)
            name (str): Name attribute of the input element (this name will be stored in screen data)
            options (list): Pass the list of options to be shown in dropdown menu
            grid (str, int, bool, optional): used to define how space should element"s container should consume.
                            Defaults to "auto". possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", true, False.
            error (str, optional): If true, the input will indicate an error.
            helpertext (str, optional): message that need to be shown when there is error

        Returns:
            dict: a input box dictionary
        """
        comp_dict = {}
        comp_dict["name"] = name
        comp_dict["type"] = "select"
        comp_dict["value"] = value
        comp_dict["label"] = label
        comp_dict["options"] = [{"value": value, "label": value} for value in options]
        comp_dict["optionValueKey"] = "value"
        comp_dict["optionLabelKey"] = "label"
        comp_dict["fullWidth"] = True
        comp_dict["grid"] = grid
        comp_dict["variant"] = variant
        comp_dict["error"] = error
        comp_dict["helperText"] = helpertext if error else None
        comp_dict["multiple"] = multi_select

        for key, value in kwargs.items():
            comp_dict[key] = value

        return comp_dict

    def add_markdown(self, markdown_data, header_text="", grid="auto", height="60rem", **kwargs):
        self.append(self.get_markdown(markdown_data, header_text, grid, height, **kwargs))

    def get_markdown(self, markdown_data, header_text="", grid="auto", height="60rem", **kwargs):
        """A dynamic form widget component, used to create a markdown

        Args:
            markdown_data (str, required): a markdown string
            header_text (str, optional): the text header for the markdown component
            grid (str, int, bool, optional): used to define how much space element's container should consume.
                                    Defaults to "auto", possible values = 1,2,3,4,5,6,7,8,9,10,11,12, "auto", True, False.
            height (str, optional): used to define the height of the markdown, defaults to '60rem'

        Returns:
            dict: markdown dictionary
        """

        comp_dict = {}
        comp_dict["type"] = "markdown"
        comp_dict["headerText"] = header_text
        comp_dict["markdownData"] = markdown_data
        comp_dict["grid"] = grid
        comp_dict["gridHeight"] = height

        for key, value in kwargs.items():
            comp_dict[key] = value

        return comp_dict
