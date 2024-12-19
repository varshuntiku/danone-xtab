#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging
import traceback

from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion


class SimpleTable(BaseConversion):
    """
    The SimpleTable class has the required conversion function to translate inputs
    into a JSON structure that can be rendered as a table on the Co.dx UI.
    _________________________________________________________________________

    Args:
        df (df): dataframe to be displayed as a table on the UI
        show_searchbar (boolean): boolean to display searchbar
    _________________________________________________________________________

    Attributes:
        json_string (str): This attribute generates a JSON string for the component
    _________________________________________________________________________

    Usage
    -----
    - Sample code
    >>> import pandas as pd
    >>> from codex_widget_factory_lite.visuals.simple_table import SimpleTable
    >>> sample_df = pd.DataFrame(data = [['tom', 10], ['nick', 15], ['juli', 14]], columns=['Name', 'Age'])
    >>> table_json = SimpleTable(df = sample_df).json_string


    Returns
    -------
    The `json_string` attribute returns a JSON string that is used to render the component on the UI
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
    {
    table_headers: [
            "0" : "col1",
            "1" : "col2"
        ]
    widget_value_id: "widget id"
    table_data: [
        "0": [1 2]
        "1": [3 4]
        ]
    }
    ```

    """

    DEFAULT_CODE = """
# Hardcoding a sample dataframe here, please ingest you dataset or create
import pandas as pd
from codex_widget_factory_lite.visuals.simple_table import SimpleTable
sample_df = pd.DataFrame(data = [['tom', 10], ['nick', 15], ['juli', 14]], columns=['Name', 'Age'])
dynamic_outputs = SimpleTable(df = sample_df).json_string
"""

    def __init__(self, df, color_df=[], show_searchbar=False, tableOptions={},freezing=False):
        super().__init__()
        self.__initialise_component_dict(df, color_df, show_searchbar, tableOptions, freezing)

    def __initialise_component_dict(self, df, color_df, show_searchbar, tableOptions,freezing):
        try:
            if len(color_df) > 0:
                temp_list = []
                for index, row in df.iterrows():
                    row_list = []
                    for col, value in row.items():
                        if col in list(color_df.columns):
                            row_dict = {}
                            row_dict["value"] = value
                            row_dict["bgColor"] = color_df[col].iloc[index]
                            row_list.append(row_dict)
                        else:
                            row_list.append(value)
                    temp_list.append(row_list)
                self.component_dict["table_headers"] = list(df.columns)
                self.component_dict["table_data"] = temp_list
                self.component_dict["show_searchbar"] = show_searchbar
                self.component_dict["tableOptions"] = tableOptions
                self.component_dict["freezing"]= freezing
            else:
                self.component_dict = {
                    "table_headers": list(df.columns),
                    "table_data": df.values.tolist(),
                    "show_searchbar": show_searchbar,
                    "tableOptions": tableOptions,
                    "freezing":freezing,
                }

        except Exception:
            logging.error(traceback.format_exc())
