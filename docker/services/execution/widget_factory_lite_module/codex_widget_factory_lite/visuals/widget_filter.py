import json
from datetime import datetime
from itertools import chain

from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion


class WidgetFilter(BaseConversion):
    def __init__(self, display_type="filter_icon", dropdown_type="detailed", filter_type="non-hierarchical"):
        """
        Initialize the UIAC class with default display and dropdown types.

        Args:
            display_type (str): The type of display (e.g., filter icon).
            dropdown_type (str): The type of dropdown (e.g., detailed).
            filter_type (str): The type of filtering (e.g., hierarchical or non-hierarchical).
        """
        self.uiac_config = {
            "displayType": display_type,
            "dropdownType": dropdown_type,
            "filterType": filter_type,
            "dataValues": [],
        }
        self.hierarchy_filters = []
        self.hierarchy_data = {}

    def add_filter(self, label="", values=[], select_type="single", is_hierarchical=False):
        if select_type == "date_range":
            current_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
            if len(values) == 2:
                start_date, end_date = values
            elif len(values) == 1:
                start_date, end_date = values[0], current_date
            else:
                start_date, end_date = current_date, current_date
            widget_tag_value = [{"start_date": start_date, "end_date": end_date}]
        elif select_type == "number_range":
            min, max, step, enableInputBox, rangeSelector = values
            widget_tag_value = [
                rangeSelector,
                {"title": label, "min": min, "max": max, "step": step, "enableInputBox": enableInputBox},
            ]
        else:
            widget_tag_value = values

        filter_dict = {
            "widget_tag_label": label,
            "widget_tag_value": widget_tag_value,
            "widget_select_type": select_type,
            "is_hierarchical": is_hierarchical,
        }

        if is_hierarchical:
            self.hierarchy_filters.append(label)

        self.uiac_config["dataValues"].append(filter_dict)

    def add_hierarchy_data(self, parent_label, child_label, data):
        if parent_label not in self.hierarchy_data:
            self.hierarchy_data[parent_label] = {}
        self.hierarchy_data[parent_label][child_label] = data

    def update_hierarchical_filters(self, current_filter_params=None):
        if not current_filter_params:
            return

        selected_filters = current_filter_params.get("selected", {})
        current_filter = current_filter_params.get("current_filter")

        for filter_dict in self.uiac_config["dataValues"]:
            label = filter_dict["widget_tag_label"]

            if label in self.hierarchy_filters:
                previous_filters = self.get_previous_filters(label)

                if label != current_filter:
                    for prev_filter in previous_filters:
                        prev_value = selected_filters.get(prev_filter)

                        if prev_filter in self.hierarchy_data:
                            child_data = self.hierarchy_data[prev_filter].get(label)

                            if child_data:
                                if prev_value:
                                    if isinstance(prev_value, list):
                                        possible_values = list(chain(*[child_data.get(pv, []) for pv in prev_value]))
                                    else:
                                        possible_values = child_data.get(prev_value, [])
                                    if possible_values:
                                        filter_dict["widget_tag_value"] = possible_values

        if current_filter in self.hierarchy_filters:
            current_selected_values = selected_filters.get(current_filter, [])
            for filter_dict in self.uiac_config["dataValues"]:
                if filter_dict["widget_tag_label"] == current_filter:
                    existing_values = set(filter_dict["widget_tag_value"])
                    updated_values = existing_values.union(current_selected_values)
                    filter_dict["widget_tag_value"] = list(updated_values)

    def get_previous_filters(self, current_filter):
        if current_filter in self.hierarchy_filters:
            idx = self.hierarchy_filters.index(current_filter)
            return self.hierarchy_filters[:idx]
        return []

    def get_json(self):
        return json.dumps(self.uiac_config, indent=4)
