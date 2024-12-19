#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


from itertools import chain

from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion


class Filter(BaseConversion):
    """
    The Filter class has the required conversion function to translate inputs
    into a JSON structure that can be rendered as an filter on the Co.dx UI.
    This can accommodate filters coming from ADS and extra filters.
    - Filters provided from ADS shall have a hierarchy from left to right.
      The possible options of a filter are based on the filter option
      selected on the preceding filters which are on the left.
    - Extra Filters have a predefined set of possible filter options.
      The possible options are fixed and doesn't change with
      filter option selected on the preceding filters which are on the left.
    - If a certain filter is updated with new selection and the filter option
      currently on the succeeding filter is not possible then, then first option
      of the possible options of that filter is applied.
    eg: Country, State, Year are the filters in below shown format.
        >>> Country and state filters are from ADS, have hierarchy and
            Year is extra filter, is independent
        >>> Country is selected as India. So, states are shown based on India.
            State is selected as Jammu & Kashmir and Year is selected as 1999.
            Country             State                   Year
        --> India               Andhra Pradesh          1998
                United States       Assam               --> 1999
            United Kingdom      Himachal Pradesh        .
            France          --> Jammu & Kashmir         2005
                                                                Karnataka               .
                                                                Kerala                  .
                                                                Maharashtra             2019
                                                                Orissa                  2020
                                                                Tamilnadu               .
                                                                Telangana               .
        >>> If we change country to United States, the possible options on
            succeeding filters which come from ADS such as State change but,
            Year remains same because it's an extra filter.
            Also, selection on state, Jammu & Kashmir has changed to
            Alaska which is first option on possible options for state.
            Country             State                   Year
                India           --> Alaska                  1998
        --> United States       Alabama             --> 1999
            United Kingdom      California              .
            France              Colorado                2005
                                                                Florida                 .
                                                                Illinois                .
                                                                Indiana                 2019
                                                                Michigan                2020
                                                                New Jersey              .
                                Ohio                    .
                                                                Washington              .
    _________________________________________________________________________

    Args:
        hirearchy_filter_df : pandas dataframe, required
            This dataframe should contain the all possible combinations of filters.
            Each row contains a combination of filter. Hierarchy of filters
            is applied left to right. Possible filter values are taken from the
            Columns and filter names are the column names.
            Filters in the UI appear in the same order of hirearchy_filter_df columns.
        default_values_selected : dict, required
            The default values of the filters that are applied when screen is
            refreshed or loads for the first time.
            The keys are the filter names and values are the filter values to
            be selected on the screen.
            For multi select filters provide the value(s) in a list. Other filters
            take single value, either a string or integer or date based on filter.
        multi_select_all_filters : list, required
            The names of the filters that contain "All" option.
            Provide the list of filter names that matches with column names in df
            or that matches with the keys in static_filters.
        multi_select_filters : list, required
            The names of the filters that contain multiple selection option.
            Provide the list of filter names that matches with column names in df
            or that matches with the keys in static_filters.
        static_filters : dict, optional (default={})
            The additional filters which are not present in df.
            The filters are independent of the filters in df and doesn't have hierarchy.
            These filters appear in the order after the filters present in df.
            The keys are the filter names and values are the list of possible options
            for the filter.
            By default, static_filters is empty.
        current_filter_params : dict, required
            current_filter_params is a request payload comes from UI.
            It contains two keys, "current_filter", "selected"
            It is empty dict when screen is loaded for the first time.
    _________________________________________________________________________

    Attributes:
        json_string (str): This attribute generates a JSON string for the component
    _________________________________________________________________________

    Usage
    -----
    >>> from codex_widget_factory_lite.visuals.filter import Filter
    >>> hirearchy_filter_df = pd.DataFrame(columns=[....])    # Optional operation
    >>> hirearchy_filter_df = final_ADS.groupby(......)       # Optional operation
    >>> default_values_selected = {}    # The default value to be selected for a filter, provide filter_name, filter_values
    >>> all_option_filters = []         # Filters with an All option
    >>> multi_select_filters = []       # Filters with an multi_select option
    >>> more_filters = {}               # Extra filters, provide filter_names, filter_options
    >>> filter_json = Filter(hirearchy_filter_df, default_values_selected, all_option_filters, multi_select_filters, more_filters, current_filter_params).json_string
    Returns
    -------
    A dict object containing the filters JSON structure
    The `json_string` attribute returns a JSON string that is used to render the component on the UI
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
    ---- TO BE FILLED ----
    ```

    """

    DEFAULT_CODE = """
from codex_widget_factory_lite.visuals.filter import Filter
import pandas as pd

# Example hardcoded hirearchy_filter_df below, please ingest data or create your own data
hirearchy_filter_df = pd.DataFrame(
    columns=['Region', 'Country', 'Category'],
    data=[
        ['North America', 'USA', 'Category 1'],
        ['North America', 'USA', 'Category 2'],
        ['North America', 'Canada', 'Category 1'],
        ['North America', 'Canada', 'Category 2'],
        ['Europe', 'UK', 'Category 1'],
        ['Europe', 'Germany', 'Category 2']
    ]
)
default_values_selected = {'Region': 'North America', 'Country': 'USA', 'Category': 'Category 1'}    # The default value to be selected for a filter, provide filter_name, filter_values
all_option_filters = ['Region', 'Category']         # Filters with an All option
multi_select_filters = ['Region', 'Category']       # Extra filters, provide filter_names, filter_options
more_filters = {}                                   # Extra filters, provide filter_names, filter_options

dynamic_outputs = Filter(hirearchy_filter_df, default_values_selected, all_option_filters, multi_select_filters, more_filters, current_filter_params).json_string
print(dynamic_outputs)
"""

    def __init__(
        self,
        hirearchy_filter_df,
        current_filter_params,
        default_values_selected={},
        multi_select_all_filters=[],
        multi_select_filters=[],
        static_filters={},
        date_filters={},
        filter_slice={},
    ):
        super().__init__()
        self.__initialise_component_dict(
            hirearchy_filter_df,
            default_values_selected,
            multi_select_all_filters,
            multi_select_filters,
            static_filters,
            date_filters,
            filter_slice,
            current_filter_params,
        )

    def __initialise_component_dict(
        self,
        hirearchy_filter_df,
        default_values_selected,
        multi_select_all_filters,
        multi_select_filters,
        static_filters,
        date_filters,
        filter_slice,
        current_filter_params,
    ):
        filters = list(hirearchy_filter_df.columns)
        if static_filters:
            filters.extend(list(static_filters.keys()))
        if date_filters:
            filters.extend(list(date_filters.keys()))
        select_df = hirearchy_filter_df.copy()
        if current_filter_params:
            selected_filters = current_filter_params["selected"]
            # current_filter = current_filter_params["current_filter"]
            # current_index = filters.index(current_filter)
        final_dict = {}
        iter_value = 0
        data_values = []
        default_values = {}
        for item in filters:
            filter_dict = {}
            filter_dict["widget_filter_index"] = int(iter_value)
            filter_dict["widget_filter_function"] = False
            filter_dict["widget_filter_function_parameter"] = False
            filter_dict["widget_filter_hierarchy_key"] = False
            filter_dict["widget_filter_isall"] = True if item in multi_select_all_filters else False
            filter_dict["widget_filter_multiselect"] = True if item in multi_select_filters else False
            filter_dict["widget_tag_key"] = str(item)
            filter_dict["widget_tag_label"] = str(item)
            filter_dict["widget_tag_input_type"] = "select" if item not in date_filters else "date_range"
            filter_dict["widget_filter_dynamic"] = True
            filter_dict["widget_filter_type"] = "date_range" if item in date_filters else ""

            if not current_filter_params:
                selected_filters = default_values_selected.copy()
            item_default_value = selected_filters[item]
            if item in hirearchy_filter_df.columns:
                possible_values = list(select_df[item].unique())
                if item in multi_select_all_filters:
                    possible_values = list(chain(["All"], possible_values))
                if item in multi_select_filters:
                    for value in selected_filters[item]:
                        if value not in possible_values:
                            if possible_values[0] == "All":
                                item_default_value = possible_values
                            else:
                                item_default_value = [possible_values[0]]
                else:
                    if selected_filters[item] not in possible_values:
                        item_default_value = possible_values[0]
                filter_dict["widget_tag_value"] = possible_values
                if item in multi_select_filters:
                    if "All" not in item_default_value and selected_filters[item]:
                        select_df = select_df[select_df[item].isin(item_default_value)]
                else:
                    if selected_filters[item] != "All":
                        select_df = select_df[select_df[item] == item_default_value]
            elif item in static_filters:
                filter_dict["widget_tag_value"] = static_filters[item]
            elif item in date_filters:
                filter_dict["widget_tag_value"] = []
                filter_dict["widget_filter_params"] = {
                    "start_date": {
                        "format": date_filters[item].get("format", "DD/MM/YYYY"),
                        "suppressUTC": date_filters[item].get("suppressUTC", False),
                    },
                    "end_date": {
                        "format": date_filters[item].get("format", "DD/MM/YYYY"),
                        "suppressUTC": date_filters[item].get("suppressUTC", False),
                    },
                }
            data_values.append(filter_dict)
            default_values[item] = item_default_value
            iter_value = iter_value + 1
        final_dict["dataValues"] = data_values
        final_dict["defaultValues"] = default_values
        final_dict["filterSlice"] = filter_slice if filter_slice else False

        self.component_dict = final_dict
