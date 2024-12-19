from typing import Dict, List, Tuple

from api.schemas.apps.app_schema import ScreenLayoutSchema
from api.utils.app.app import execute_code_string
from fastapi import Request


def get_dynamic_widgets(
    app_id: int,
    widget_id: int,
    access_token: str,
    filters: Dict,
    widget_code: str,
    data_state_key: str = None,
    widget_event: Dict = None,
    request: Request = None,
    prev_screen_data: list = None,
) -> Tuple[Dict, str, int, None]:
    """Helper function to fetch the dynamic widgets using filters, code and state key

    Args:
        app_id,
        widget_id,
        access_token,
        filters (dictionary): [dictionary which gives the information of the selected filters]
        widget_code (string): [code string saved for the widget]
        data_state_key (string): [the data state information which will determine outputs of the code string]
        widget_event (dictionary) :[dictionary which gives information about an event that was triggerd in source widget]
        request: request object

    Returns:
        code_outputs: [the json in co.dx format which will be used in the UI to render the corresponding component]
        logs : code logs if any
        lineno: error line no. if any
    """
    inputs = {}
    selected_filters = filters
    code = (
        widget_code
        + """
code_outputs = dynamic_outputs
"""
    )
    file_prefix = f"widget_code_{app_id}_{widget_id}_{request.state.logged_in_email}_"
    code_string_response = execute_code_string(
        app_id=app_id,
        code_string=code,
        injected_vars={
            "simulator_inputs": inputs,
            "selected_filters": selected_filters,
            "user_info": request.state.user_info,
            "data_state_key": data_state_key,
            "crossfilter_event": widget_event,
            "prev_screen_data": prev_screen_data,
        },
        access_token=access_token,
        file_prefix=file_prefix,
    )
    return (
        code_string_response["code_string_output"]["code_outputs"],
        code_string_response["logs"],
        code_string_response.get("lineno", None),
    )


def generate_widget_code(component_type: str, code: str) -> str:
    """
    Generates complete widget uiac code string based on given component type

    Args:
        component_type: type of component
        code: given code string

    Returns:
        complete widget uiac code string
    """
    # The filter code string will be updated to a shorter one once the native Filter component integration works
    code_map = {
        "kpi": "\r\nfrom codex_widget_factory_lite.visuals.metric import Metric\r\nmetric_outputs = Metric(metric_value = value)\r\n\r\ndynamic_outputs = metric_outputs.json_string",
        "chart": "\r\nfrom codex_widget_factory_lite.visuals.plotly_graph import PlotlyGraph\r\n\r\ndynamic_outputs = PlotlyGraph(plot_object = fig).json_string",
        "table": '\r\nfrom codex_widget_factory_lite.visuals.grid_table import GridTable\r\n\r\ngrid_options = {\r\n "freezing":True,\r\n   "enablePagination": True,\r\n    "paginationSettings": {"rowsPerPage": 10},\r\n    "quickSearch": True\r\n}\r\n\r\ndynamic_outputs = GridTable(df=table, grid_options=grid_options).json_string',
        "filter": '\r\nimport json\r\nfrom plotly.io import to_json\r\nfrom itertools import chain\r\n\r\ndef get_response_filters(current_filter_params,\r\n                         df,\r\n                         default_values_selected,\r\n                         all_filters=[],\r\n                         multi_select_filters=[],\r\n                         date_range_filters={},\r\n                         extra_filters={},\r\n                         apply_two_way_heirarchy=False,\r\n                         filters_arrangement=[],\r\n                         enable_search=[],\r\n                         enable_pagination=[],\r\n                         legends_values=[],\r\n                         legends_cols=[]):\r\n    filters = list(df.columns)\r\n    date_filters = {}\r\n    def _apply_heirarchy(df, item, multi_select_filters, selected_filters, value):\r\n        if item in multi_select_filters:\r\n            if \'All\' not in value and selected_filters[item]:\r\n                df = df[df[item].isin(value)]\r\n        else:\r\n            if selected_filters[item] != \'All\':\r\n                df = df[df[item] == value]\r\n        return df\r\n    def _get_possible_values(df, item, all_filters):\r\n        possible_values = list(df[item].unique())\r\n        possible_values = list(chain([\'All\'], possible_values)) if item in all_filters else possible_values\r\n        possible_values = [value if type(value) in [str, pd._libs.tslibs.timestamps.Timestamp, list, float, int, bool, tuple, dict] else value.item() for value in possible_values]\r\n        return possible_values\r\n    def _get_filter_values_for_ui(item, multi_select_filters, possible_values, item_value, heirarchy="Succeeding"):\r\n        if item in multi_select_filters:\r\n            contains_all = True if "All" in item_value else False\r\n            new_item_value = [value for value in item_value if value in possible_values]\r\n            if heirarchy == "Preceeding" and contains_all and len(item_value) != len(new_item_value):\r\n                new_item_value.remove("All")\r\n            if heirarchy == "Succeeding" and not new_item_value and item_value:\r\n                new_item_value = possible_values if possible_values[0] == "All" else [possible_values[0]]\r\n            if heirarchy == "Succeeding" and contains_all and new_item_value:\r\n                new_item_value = possible_values\r\n        else:\r\n            new_item_value = possible_values[0] if item_value not in possible_values else item_value\r\n        return new_item_value\r\n    if date_range_filters:\r\n        filters.extend(list(date_range_filters.keys()))\r\n        for filter_name in date_range_filters:\r\n            date_filters[filter_name] = {"start_date": {}, "end_date": {}}\r\n            for key_v in ["start_date", "end_date"]:\r\n                default_values_selected[filter_name][key_v] = str(pd.to_datetime(default_values_selected[filter_name][key_v]))\r\n                date_filters[filter_name][key_v]["format"] = date_range_filters[filter_name].get("format", "DD/MM/YYYY")\r\n                date_filters[filter_name][key_v]["suppressUTC"] = date_range_filters[filter_name].get("suppressUTC", False)\r\n    if extra_filters:\r\n        filters.extend(list(extra_filters.keys()))\r\n    select_df = df.copy()\r\n    if current_filter_params:\r\n        current_df = df.copy()\r\n        selected_filters = current_filter_params["selected"]\r\n        if apply_two_way_heirarchy:\r\n            current_filter = current_filter_params["current_filter"]\r\n            current_index = filters.index(current_filter)\r\n            if current_filter in df.columns:\r\n                current_df = _apply_heirarchy(current_df, current_filter, multi_select_filters, selected_filters, selected_filters[current_filter])\r\n                preceeding_filters = filters[0:current_index]\r\n                preceeding_filters.reverse()\r\n                for item in preceeding_filters:\r\n                    item_value_ui = selected_filters[item]\r\n                    possible_values = _get_possible_values(current_df, item, all_filters)\r\n                    selected_filters[item] = _get_filter_values_for_ui(item, multi_select_filters, possible_values, item_value_ui, "Preceeding")\r\n                    current_df = _apply_heirarchy(current_df, item, multi_select_filters, selected_filters, item_value_ui)\r\n    final_dict = {}\r\n    data_values = []\r\n    default_values = {}\r\n    def arrangement_func(ordering):\r\n        return {filter_n: ordering.index(filter_n) for filter_n in filters}\r\n    filter_arrangement_indexes = arrangement_func(filters_arrangement) if len(filters) == len(filters_arrangement) else arrangement_func(filters)\r\n    for item in filters:\r\n        filter_dict = {}\r\n        filter_dict["widget_filter_index"] = filter_arrangement_indexes[item]\r\n        filter_dict["widget_filter_function"] = False\r\n        filter_dict["widget_filter_function_parameter"] = False\r\n        filter_dict["widget_filter_hierarchy_key"] = False\r\n        filter_dict["widget_filter_isall"] = True if item in all_filters else False\r\n        filter_dict["widget_filter_multiselect"] = True if item in multi_select_filters else False\r\n        filter_dict["widget_tag_key"] = str(item)\r\n        filter_dict["widget_tag_label"] = str(item)\r\n        filter_dict["widget_tag_input_type"] = "select" if item not in date_range_filters else "date_range"\r\n        filter_dict["widget_filter_dynamic"] = True\r\n        filter_dict["widget_filter_type"] = "" if item not in date_range_filters else "date_range"\r\n        filter_dict["widget_filter_params"] = None if item not in date_range_filters else date_filters.get(item)\r\n        if filter_dict[\'widget_filter_params\'] and item in enable_pagination:\r\n            filter_dict[\'widget_filter_params\'].update({\'pagination\': True})\r\n        elif item in enable_pagination:\r\n            filter_dict[\'widget_filter_params\'] = {\'pagination\': True}\r\n        if filter_dict[\'widget_filter_params\'] and item in legends_cols:\r\n            filter_dict[\'widget_filter_params\'].update({\'legends\': legends_values[item]})\r\n        elif item in legends_cols:\r\n            filter_dict[\'widget_filter_params\'] = {\'legends\': legends_values[item]}\r\n        filter_dict[\'widget_filter_search\'] = True if item in enable_search else False\r\n        if not current_filter_params:\r\n            selected_filters = default_values_selected.copy()\r\n        item_default_value = selected_filters[item]\r\n        if item in df.columns:\r\n            possible_values = _get_possible_values(select_df, item, all_filters)\r\n            # Applying first value of possible values, if selected filter on UI is not possible.\r\n            item_default_value = _get_filter_values_for_ui(item, multi_select_filters, possible_values, item_default_value)\r\n            filter_dict["widget_tag_value"] = possible_values\r\n            # Applying Heirarchy, for updating possible values of succeeding filters\r\n            select_df = _apply_heirarchy(select_df, item, multi_select_filters, selected_filters, item_default_value)\r\n        else:\r\n            filter_dict["widget_tag_value"] = extra_filters[item] if item in extra_filters else []\r\n        data_values.append(filter_dict)\r\n        default_values[item] = item_default_value\r\n        # iter_value = iter_value + 1\r\n    final_dict["dataValues"] = data_values\r\n    final_dict["defaultValues"] = default_values\r\n    return final_dict\r\n\r\ncontainer_dict = get_response_filters(current_filter_params,\r\n                                      df,\r\n                                      default_values_selected,\r\n                                      all_filters,\r\n                                      multi_select_filters,\r\n                                      enable_search=enable_search,\r\n                                      enable_pagination=enable_pagination)\r\n\r\ndynamic_outputs = json.dumps(container_dict)',  # noqa: E501
    }
    return code + code_map[component_type]


def generate_widgets(all_widgets: List[Dict]) -> List[Dict]:
    """
    Generated the list of final widgets after performing some calculations

    Args:
        all_widgets: widgets list

    Returns:
        final widgets list
    """
    kpis = list(filter(lambda widget: widget.get("component_type") == "kpi", all_widgets))
    widgets = list(
        filter(
            lambda widget: widget.get("component_type") == "chart" or widget.get("component_type") == "table",
            all_widgets,
        )
    )
    default_kpi = {"component_type": "kpi", "title": "", "full_code": None}
    default_widget = {"component_type": "chart", "title": "", "full_code": None}
    kpis = kpis + [default_kpi for _ in range(4 - len(kpis))]
    widgets = widgets + [default_widget for _ in range(4 - len(widgets))]
    return kpis + widgets


def generate_layout_details(layout: ScreenLayoutSchema | None = None) -> Tuple:
    horizontal = None
    graph_type = None
    graph_width = None
    graph_height = None
    if layout:
        horizontal = layout.screen_orientation == "horizontal"
        graph_type = "-".join(str(n) for n in layout.section_cells)
        if horizontal:
            graph_height = "-".join(["5"] * layout.sections)
            graph_width = ",".join(["-".join([str(int(12 / n))] * n) for n in layout.section_cells])
        else:
            graph_width = "-".join([str(int(12 / layout.sections))] * layout.sections)
            graph_height = ",".join(["-".join([str(int(10 / n))] * n) for n in layout.section_cells])
    return (horizontal, graph_type, graph_width, graph_height)
