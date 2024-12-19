#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging
import traceback

import numpy as np
import pandas as pd
from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion


class ExpandableTable(BaseConversion):
    """
    The ExpandableTable class has the required conversion function to translate inputs
    into a JSON structure that can be rendered as an expandable table on the Co.dx UI.
    _________________________________________________________________________

    Args:

        expandable_df (df): A pandas dataframe, required.
            The dataframe can be passed in two ways.

            Firstly, the dataframe containing only the columns used in collapsible
            table. The names present in keys of arg - 'value_cols_aggfunc_dict' are
            traeted as value columns and the remaining columns are treated
            as index columns. The value columns are aggregated in each level and
            the index columns are used as identifier for level by level expansion.

            Alternatively, The dataframe containing n_rows and n_columns.
            This is the first level data when the table on UI is not expanded.
            If there needs to expandability, two Additional columns are to be
            present in this expandable_df namely,

            "collapse_df" - contains boolean value, True/False.
            "collapse_df_data" - contains a dictionary which can be converted to dataframe.
            The values provided in these columns as used to make table expandable.

            "collapse_df" -
            If a row needs to be expanded "collapse_df" is given as True.
            If a row doesn't need expansion "collapse_df" is given as False.

            Once, "collapse_df" is True, User has to mandatorily provide the value
            for the column "collapse_df_data".

            "collapse_df_data" -
            The table that needs to shown on the UI at the next level after
            user expands the row should be present as a dict which is provided
            under the column "collapse_df_data" of the corresponding row
            which needs expansion.

            The dict when converted to a dataframe contains n_rows and
            n_columns that needs to be shown on the next level after
            user expands the row.

            If here user needs one more level of expansion, give the additional
            columns "collapse_df", "collapse_df_data". The process can be
            repeated for as many rows and levels the expansion is required.

        If there is no column name "collapse_df" or if "collapse_df" is given
        as a False, in the expandable_df or in the dict inside collapse_df_data
        then it's dealt as no expansion for that row.

        value_cols_aggfunc_dict (dict): The dict containing the value columns as keys.
        The key is column name to aggregate and
        value is function or list of functions.
        The parameter is required if expandable_df is passed in first format.
    _________________________________________________________________________

    Attributes:
        json_string (str): This attribute generates a JSON string for the component
    _________________________________________________________________________

    Usage
    -----
    1) ADS approach with index cols and value cols that shall be aggregated
    >>> from codex_widget_factory_lite.visuals.metric import ExpandableTable
    >>> table = pd.DataFrame(......)            # Dataframe is created or read from file
    >>> expandable_json = ExpandableTable(expandable_table, {"Val_col_1": "mean", "Val_col_2": "sum", ..}).json_string

    2) Alternative approach
    >>> from codex_widget_factory_lite.visuals.metric import ExpandableTable
    >>> table = pd.DataFrame(......)            # Dataframe is created or read from file
    >>> expandable_table = pd.DataFrame(......) # Formatted Dataframe is created with collapse_df, collapse_df_data
    >>> expandable_table                        # Dataframe needs expansion conatains "collapse_df", "collapse_df_data"

            Country	  2020 YoY	2021 YoY	2021    	collapse_df	  collapse_df_data
        0	UK	      1.80%	    2.70%	    305,088M	True	      {'Channels': {1: 'Grocery', 2: 'Discounters',...
        5	Poland	  8.50%	    7.90%	    61,252M	 	True	      {'Channels': {6: 'Grocery', 7: 'Discounters',...
        8	TOTAL	  2.90%	    3.60%	    966,903M	False	      {'Channels': {}, '2020 YoY': {}, '20...

    >>> expandable_table["collapse_df_data"]    # Each row of the column "collaspe_df_data" contains {<key>: <value>} - dict

        0     {'Channels': {1: 'Grocery', 2: 'Discounters',...
        5     {'Channels': {6: 'Grocery', 7: 'Discounters',...
        8     {'Channels': {}, '2020 YoY': {}, '20...

    >>> expandable_table['collapse_df_data'][0]     # Select index '0' from the dataframe. A dict and it's key values.

        {
            'Channels': {1: 'Grocery', 2: 'Discounters', 3: 'SPT', 4: 'DCOM'},
            '2020 YoY': {1: '0.80%', 2: '0.70%', 3: '6.40%', 4: '2.90%'},
            '2021 YoY': {1: '1.10%', 2: '2.10%', 3: '9.90%', 4: '3.60%'},
            '2021': {1: '244,982M', 2: '205,240M', 3: '60,106M', 4: '222,863M'},
            '2022 YoY': {1: '0.90%', 2: '1.30%', 3: '4.70%', 4: '2.40%'},
            '2023 YoY': {1: '0.90%', 2: '1.30%', 3: '4.70%', 4: '2.40%'}
        }

    >>> pd.DataFrame(expandable_table['collapse_df_data'][0])    # Converting the dict to a dataframe

            Channels	    2020 YoY	2021 YoY	  2021	      2022 YoY (predicted)	2023 YoY (predicted)
        1	Grocery	    	0.80%	   	1.10%	      244,982M    0.90%	                0.90%
        2	Discounters	 	0.70%	   	2.10%	      205,240M	  1.30%	                1.30%
        3	SPT	       		6.40%	   	9.90%	      60,106M	  4.70%	                4.70%
        4	DCOM	       	2.90%	   	3.60%	      222,863M	  2.40%	                2.40%

    >>> expandable_json = ExpandableTable(expandable_table).json_string


    Returns
    -------
    The `json_string` attribute returns a JSON string that is used to render the component on the UI
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
    {
     "columns": [
        {
          "id": <Will be used internally to show the data>,
          "label": <Used as the Table Header>
        }, ...
      ],
      "rows": [
        {
          "collapse": <boolean, if true renders the nested table, else ignores the , One needs to pass the data of the nested table as rows,columns inside the "data" key(line 18) inside each row which should be expanded>,
          "data": {
            "collapse": <If true, you need to pass data propery inside this >,
            "title": <Title of the table/subtable>,
            "columns": [
              {
                "id": <column_id>,
                "label": <column label>
              },
            ],
            "rows": [
            ]
          }
      ]
      "isExpandable": <boolean>
    }
    ```

    """

    def __init__(
        self,
        expandable_df,
        expandable_rows_flag=[],
        expandable_rows_values=[],
        value_cols_aggfunc_dict={},
    ):
        super().__init__()
        self.__initialise_component_dict(
            expandable_df,
            expandable_rows_flag,
            expandable_rows_values,
            value_cols_aggfunc_dict,
        )

    def __initialise_component_dict(
        self,
        expandable_df,
        expandable_rows_flag,
        expandable_rows_values,
        value_cols_aggfunc_dict,
    ):
        try:
            self.component_dict = {}
            if len(expandable_rows_flag) == 0:
                if value_cols_aggfunc_dict:
                    expandable_df = self.__create_expandable_df(
                        df=expandable_df, value_cols_agg_dict=value_cols_aggfunc_dict
                    )
                else:
                    raise ValueError(
                        "value_cols_aggfunc_dict is empty dict. Expected valid dictionary input to perform aggregation."
                    )
            else:
                if (
                    len(expandable_rows_flag) > 0
                    and len(expandable_rows_flag) == len(expandable_rows_values)
                    and len(expandable_df.index) == len(expandable_rows_flag)
                ):
                    expandable_df["collapse_df"] = expandable_rows_flag
                    expandable_df["collapse_df_data"] = expandable_rows_values
                else:
                    raise ValueError("length of expandable_rows_flag, expandable_rows_flag and expandable_df")

            self.component_dict["columns"] = self.__get_columns_list(data_df=expandable_df)
            self.component_dict["isExpandable"] = True

            main_rows_list = []
            main_rows_index = list(expandable_df.index)

            for index_name in main_rows_index:
                main_row_dict = expandable_df.loc[index_name].to_dict()
                main_data = main_row_dict.pop("collapse_df_data", "No Value")
                collapse = main_row_dict.pop("collapse_df", "No Value")
                main_row_dict = {
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
                    for key, value in main_row_dict.items()
                }

                main_row_dict["collapse"] = True if collapse is True else False

                if collapse is True:
                    main_row_dict["data"] = self.__get_collapse_data_dict(level_data=main_data)

                main_rows_list.append(main_row_dict)

            self.component_dict["rows"] = main_rows_list
        except Exception:
            logging.error(traceback.format_exc())

    def __create_expandable_df(self, df, value_cols_agg_dict):
        """
        Internal function to convert given df to the format of
        collapsible/expandable df.

        Returns
        -------
        A pandas dataframe containing the expandable_df.
        """
        value_cols = value_cols_agg_dict.keys()
        index_cols = [col_n for col_n in df.columns if col_n not in value_cols]
        df.insert(
            len(index_cols),
            "Temp_Column",
            [np.nan if pd.isna(val) else "Value" for val in df[index_cols[-1]]],
        )
        index_cols.append("Temp_Column")
        index_col = index_cols[0]
        index_cols = index_cols[1:]
        col_name = index_cols[0]

        expandable_level_df = pd.pivot_table(df, aggfunc=value_cols_agg_dict, index=index_col)
        expandable_level_df = round(expandable_level_df, 2)  # Danone Change
        expandable_level_df.reset_index(inplace=True)
        expandable_level_df["collapse_df"] = True if len(index_cols) > 1 else False
        non_collapsible_rows = df[df[col_name].isnull()].drop(index_cols, axis=1)
        non_collapsible_rows["collapse_df"] = False
        expandable_level_df = expandable_level_df.append(non_collapsible_rows)
        expandable_level_df["collapse_df_data"] = "None"
        for row_n in expandable_level_df.index:
            if expandable_level_df.at[row_n, "collapse_df"]:
                select_df = df[df[index_col] == expandable_level_df.at[row_n, index_col]].copy()
                select_df.drop(index_col, axis=1, inplace=True)
                expandable_level_df.at[row_n, "collapse_df_data"] = self.__create_expandable_level_df(
                    select_df, index_cols, value_cols_agg_dict
                )

        return expandable_level_df

    def __create_expandable_level_df(self, df, index_cols, value_cols_agg_dict):
        """
        Internal function to compute level df dict of the
        collapsible/expandable df.

        Returns
        -------
        A dictionary format of level_df
        """
        index_col = index_cols[0]
        index_cols = index_cols[1:]
        col_name = index_cols[0]

        level_df = pd.pivot_table(df, aggfunc=value_cols_agg_dict, index=index_col)
        level_df = round(level_df, 2)  # Danone Change
        level_df.reset_index(inplace=True)
        level_df["collapse_df"] = True if len(index_cols) > 1 else False
        non_collapsible_rows = df[df[col_name].isnull()].drop(index_cols, axis=1)
        non_collapsible_rows["collapse_df"] = False
        level_df = level_df.append(non_collapsible_rows)
        level_df["collapse_df_data"] = "None"
        for row_n in level_df.index:
            if level_df.at[row_n, "collapse_df"]:
                select_df = df[df[index_col] == level_df.at[row_n, index_col]].copy()
                select_df.drop(index_col, axis=1, inplace=True)
                level_df.at[row_n, "collapse_df_data"] = self.__create_expandable_level_df(
                    select_df, index_cols, value_cols_agg_dict
                )

        return level_df.to_dict()

    def __get_columns_list(self, data_df):
        """
        Internal function to compute the columns component of the
        collapsible/expandable table on the UI.

        Returns
        -------
        A list of columns component
        """
        main_cols_list = []
        main_col_names = list(data_df.keys())
        main_col_dict = {}
        if "collapse_df" in main_col_names:
            main_col_dict["id"] = False
            main_col_dict["label"] = ""
            main_cols_list.append(main_col_dict)
            main_col_names.remove("collapse_df")

        for col_name in main_col_names:
            main_col_dict = {}
            main_col_dict["id"] = col_name
            main_col_dict["label"] = str(col_name)
            main_cols_list.append(main_col_dict)

        return main_cols_list

    def __get_collapse_data_dict(self, level_data):
        """
        Internal function to compute data component of the
        collapsible/expandable table on the UI.

        Returns
        -------
        A dictionary of data component
        """
        level_data_dict = {}
        level_df = pd.DataFrame(level_data)

        if level_df.get("collapse_df") is None:
            level_data_dict["collapse"] = False
        else:
            level_data_dict["collapse"] = bool(level_df["collapse_df"].any())

        level_data_dict["columns"] = self.__get_columns_list(data_df=level_df)

        rows_list = []
        rows_index = list(level_df.index)
        for name in rows_index:
            row_dict = level_df.loc[name].to_dict()
            new_data = row_dict.pop("collapse_df_data", "No Value")
            collapse = row_dict.pop("collapse_df", "No Value")
            row_dict = {
                key: value
                if type(value) in [str, pd._libs.tslibs.timestamps.Timestamp, list, float, int, bool]
                else value.item()
                for key, value in row_dict.items()
            }

            row_dict["collapse"] = True if collapse is True else False

            if collapse is True:
                row_dict["data"] = self.__get_collapse_data_dict(level_data=new_data)

            rows_list.append(row_dict)

        level_data_dict["rows"] = rows_list

        return level_data_dict
