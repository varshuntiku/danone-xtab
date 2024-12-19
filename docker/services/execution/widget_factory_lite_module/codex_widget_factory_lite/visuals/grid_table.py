#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import logging
import traceback

import pandas as pd
import plotly.graph_objects as go
from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion
from plotly.io import to_json


class GridTable(BaseConversion):
    """
    The GridTable class has the required conversion function to translate inputs
    into a JSON structure that can be rendered as a table on the Co.dx UI.
    _________________________________________________________________________

    Args:
        `df` (df, required): The pandas dataframe to be displayed as a table on the UI
        `col_props` (dict, optional): A dictionary of columns with  required column properites must be passed.
        `grid_options` (dict, optional): A dictionary with  table properites must be passed.
        `group_headers` (list, optional): List of grouped column header must be passed.
        `popups` (dict, optional): Data (df/fig) with respect to column to be displayed in popup screen must be passed.
        `popup_col` (list, optional): A list of column names which acts as trigger to popup screen must be passed.
        `popup_col_props` (dict, optional): used to specify properties of a column present in popup screen table.
        `popup_grid_options` (dict, optional): used to specify the properties of the popup screen table. This applies only when popup screen has a table.
        `popup_group_headers` (dict, optional): used to group multiple column headers and specify property of popup screen table. This applies only when popup screen has a table.
    _________________________________________________________________________

    Attributes:
        json_string (str): This attribute generates a JSON string for the component
    _________________________________________________________________________

    Usage
    -----
    - Sample code
    >>> import pandas as pd
    >>> from codex_widget_factory_lite.visuals.grid_table import GridTable
    >>> sample_df = pd.DataFrame(data = [['tom', 10], ['nick', 15], ['juli', 14]], columns=['Name', 'Age'])
    >>> table_json = GridTable(df = sample_df).json_string

    Returns
    -------
    The `json_string` attribute returns a JSON string that is used to render the component on the UI
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
    {
        "is_grid_table": true,
        "tableProps": {
            "rowData": [
            {
                "Name": "tom",
                "Age": 10
            },
            {
                "Name": "nick",
                "Age": 15
            },
            {
                "Name": "juli",
                "Age": 14
            }
            ],
            "coldef": [
            {
                "headerName": "Name",
                "field": "Name",
                "cellParamsField": "Name_params"
            },
            {
                "headerName": "Age",
                "field": "Age",
                "cellParamsField": "Age_params"
            }
            ],
            "gridOptions": {
            "tableSize": "small",
            "tableMaxHeight": "80vh"
            }
        }
    }
    ```
    """

    DEFAULT_CODE = """
import pandas as pd
from codex_widget_factory_lite.visuals.grid_table import GridTable
# Hardcoding a sample dataframe here, please ingest you dataset or create
sample_df = pd.DataFrame(data = [['tom', 10], ['nick', 15], ['juli', 14]], columns=['Name', 'Age'])
dynamic_outputs = GridTable(df = sample_df).json_string
"""

    def __init__(
        self,
        df,
        col_props={},
        grid_options={"tableSize": "small", "tableMaxHeight": "80vh"},
        group_headers=[],
        popups={},
        popup_col=[],
        popup_col_props={},
        popup_grid_options={},
        popup_group_headers={},
    ):
        super().__init__()
        self.__initialise_component_dict(
            df,
            col_props,
            grid_options,
            group_headers,
            popups,
            popup_col,
            popup_col_props,
            popup_grid_options,
            popup_group_headers,
        )

    def __initialise_component_dict(
        self,
        df,
        col_props,
        grid_options,
        group_headers,
        popups,
        popup_col,
        popup_col_props,
        popup_grid_options,
        popup_group_headers,
    ):
        try:
            self.component_dict = {}
            self.component_dict["is_grid_table"] = True
            comp_props_dict = {}
            actual_columns = df.columns[~((df.columns.str.contains("_bgcolor")) | (df.columns.str.contains("_color")))]
            bg_color_columns = df.columns[df.columns.str.contains("_bgcolor")]
            color_columns = df.columns[df.columns.str.contains("_color")]

            values_dict = df[actual_columns].to_dict("records")

            row_props_list = []
            for index, row_values in enumerate(values_dict):
                row_props_dict = {}

                for col_name, row_value in row_values.items():
                    row_props_dict[col_name] = row_value

                    if (
                        (col_name in popup_col)
                        or (col_name + "_bgcolor" in bg_color_columns)
                        or (col_name + "_color" in color_columns)
                    ):
                        row_props_dict[col_name + "_params"] = {}
                        if col_name in popup_col:
                            if isinstance(popups[col_name][row_value], pd.DataFrame):
                                insights_grid_options = popup_grid_options.copy()
                                insights_grid_options.setdefault(col_name, {}).update({"tableTitle": row_value})
                                row_props_dict[col_name + "_params"].update(
                                    {
                                        "insights": {
                                            "data": GridTable(
                                                popups[col_name][row_value],
                                                col_props=popup_col_props.get(col_name, {}),
                                                grid_options=insights_grid_options[col_name].copy(),
                                                group_headers=popup_group_headers.get(col_name, {}),
                                            ).component_dict
                                        }
                                    }
                                )
                            elif isinstance(popups[col_name][row_value], go.Figure):
                                row_props_dict[col_name + "_params"].update(
                                    {"insights": {"data": json.loads(to_json(popups[col_name][row_value]))}}
                                )
                        if col_name + "_bgcolor" in bg_color_columns:
                            row_props_dict[col_name + "_params"].update(
                                {"bgColor": df.iloc[index].to_dict()[col_name + "_bgcolor"]}
                            )
                        if col_name + "_color" in color_columns:
                            row_props_dict[col_name + "_params"].update(
                                {"color": df.iloc[index].to_dict()[col_name + "_color"]}
                            )
                row_props_list.append(row_props_dict)

            col_props_list = []
            for col in actual_columns:
                col_props_dict = {}
                col_props_dict.update(
                    {
                        "headerName": col,
                        "field": col,
                        "cellParamsField": col + "_params",
                    }
                )
                if col in popup_col:
                    col_props_dict.update({"enableCellInsights": True})

                if col in col_props:
                    col_props_dict.update(col_props[col])
                col_props_list.append(col_props_dict)

            comp_props_dict["rowData"] = row_props_list
            comp_props_dict["coldef"] = col_props_list
            comp_props_dict["gridOptions"] = grid_options

            if group_headers:
                comp_props_dict["groupHeaders"] = group_headers

            self.component_dict.update({"tableProps": comp_props_dict})

        except Exception:
            logging.error(traceback.format_exc())
