import json
import logging

import httpx
from fastapi import HTTPException, status


class Simulator:
    def __init__(self, app_id, base_url, token) -> None:
        super().__init__()
        self.app_id = app_id
        self.baseurl = base_url
        self.token = token

    def get_scenario_data(self, name):
        try:
            url = "{}/scenario/{}/{}/scenariodata".format(self.baseurl, self.app_id, name)
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}",
            }
            response = httpx.get(url=url, headers=headers, timeout=20.0)
            return json.loads(response.content)
        except Exception as ex:
            logging.exception(ex)

    def app_scenario_list(self):
        try:
            url = "{}/scenario/{}/appscenarioslist".format(self.baseurl, self.app_id)
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}",
            }
            response = httpx.get(url=url, headers=headers, timeout=20.0)
            return [row["name"] for row in json.loads(response.content)]
        except Exception as ex:
            logging.exception(ex)

    def slider(self, id, label, value, min, max, steps):
        slider_dict = {
            "input_type": "slider",
            "id": id,
            "label": label,
            "value": value,
            "min": min,
            "max": max,
            "steps": steps,
        }
        return slider_dict

    def inputBox(self, id, label, value, min, max, steps):
        input_dict = {
            "input_type": "input",
            "id": id,
            "label": label,
            "value": value,
            "min": min,
            "max": max,
            "steps": steps,
        }
        return input_dict

    def radio(self, id, label, options):
        radio_dict = {
            "input_type": "radio",
            "id": id,
            "label": label,
            "options": options,
        }
        return radio_dict

    def text(self, id, label, value):
        text_dict = {
            "input_type": "text",
            "id": id,
            "label": label,
            "value": value,
        }
        return text_dict

    def number(self, id, label, value):
        number_dict = {
            "input_type": "number",
            "id": id,
            "label": label,
            "value": value,
        }
        return number_dict

    def action(self, name, variant, type, action, action_flag_type):
        action_dict = {
            "name": name,
            "variant": variant,
            "type": type,
            "action": action,
            "action_flag_type": action_flag_type,
        }
        return action_dict

    def create_simulator(self, data, actions=[]):
        try:
            sim_dict = {}
            sim_dict["isRevampedSim"] = True
            sim_dict["simulator_options"] = {}
            sim_dict["simulator_options"]["sections"] = data
            sim_dict["simulator_options"]["section_orientation"] = "Horizontal"
            sim_dict["simulator_options"]["actions"] = actions
            return sim_dict
        except Exception as ex:
            logging.exception(ex)
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": "Error while fetching scenarios"},
            )

    def create_toplevel_inputs(self, toplevel_input_list):
        """Create toplevel input structures."""
        return toplevel_input_list

    def create_simulator_inputs(self, simulator_inputs):
        """Create simulator input structures."""
        return simulator_inputs

    def create_dropdown(self, label="", value="", variant="outlined", options=[]):
        """Create a dropdown structure."""
        return {"label": label, "type": "dropdown", "value": value, "options": options, "variant": variant}

    def create_radio_button(self, label="", value="", options=[]):
        """Create a radio button structure."""
        return {"label": label, "type": "radio_btn", "value": value, "options": options}

    def create_multiselect_dropdown(self, label="", value=[], options=[]):
        """Create a multiselect dropdown structure."""
        return {"label": label, "type": "multiselect_dropdown", "value": value, "options": options}

    def create_toggle(self, label="", value=False, disabled=False):
        """Create a toggle structure."""
        return {"label": label, "type": "toggle", "value": value, "disabled": disabled}

    def create_number_input(
        self, label="", value=0, min=None, max=None, variant="outlined", height="default", disabled=False
    ):
        """Create a number input structure."""
        number_input = {"label": label, "type": "number", "value": value, "height": height, "disabled": disabled}

        # Add min and max to the dictionary only if they are provided
        if min is not None:
            number_input["min"] = min
        if max is not None:
            number_input["max"] = max
        if variant is not None:
            number_input["variant"] = variant

        return number_input

    def create_slider(self, label="", value=0, steps=0.1):
        """Create a slider structure."""
        return {"label": label, "type": "slider", "value": value, "steps": steps}

    def create_table_simulator(self, toplevel_inputs, simulator_inputs, actions=[]):
        try:
            sim_dict = {}
            sim_dict["isRevampedSim"] = True
            sim_dict["simulator_options"] = {}
            sim_dict["simulator_options"]["isRevampedTableSim"] = True
            sim_dict["simulator_options"]["toplevel_inputs"] = toplevel_inputs
            sim_dict["simulator_options"]["simulator_inputs"] = simulator_inputs
            sim_dict["simulator_options"]["actions"] = actions
            return sim_dict
        except Exception as ex:
            logging.exception(ex)
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": "Error while fetching scenarios"},
            )
