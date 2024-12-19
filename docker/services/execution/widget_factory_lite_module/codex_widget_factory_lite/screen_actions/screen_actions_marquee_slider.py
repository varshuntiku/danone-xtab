#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging

from codex_widget_factory_lite.conversion_utils.base_screen_action import (
    BaseScreenAction,
)


class MarqueeSlider(BaseScreenAction):
    """
    The MarqueeSlider class has the required conversion function to translate inputs
    into a JSON structure that can be rendered as a Marquee Slider on the Co.dx UI.
    _________________________________________________________________________

    Args:
        `action_type` (string, required) :  Define a custom action type name here, **this will be used in action handler code section.**
        `position` (string, optional) : Used to define the position of the slider.
        `title` (string, optional) : Used to set the text to show as title.
        `height` (string, optional) : Used to define the height of the slider.
        `speed` (int, optional) : Used to define the speed of the movement of slider values.
        `direction` (string, optional) : Used to define the direction of the slider.
        `data` (list, required) : Used to define a list of data items with each item being a dictionary having mandatory key -id and rest of the details to be shown and customised.
    _________________________________________________________________________

    Attributes:
        json_string (str): This attribute generates a JSON string for the component
    _________________________________________________________________________

    Usage:
    -----
    - Sample code
    >>> import json
    >>> from codex_widget_factory_lite.screen_actions.screen_actions_marquee_slider import MarqueeSlider
    >>> dynamic_outputs = MarqueeSlider(
            action_type = 'generate_schedule',
            position = 'screen_top_left',
            height='10vh',
            speed= 50,
            direction = 'right',
            title="This is title",
            data=[
                {
                "id": 1,
                "value": "Sales performance during events in ahead of competitors",
                "sub_value": "$ 3.3M ",
                "sub_value_color": "green",
                "direction": "up",
                "direction_color": "green"
                },
                {
                "id": 2,
                "value": "Sales performance during events in ahead of competitors",
                "sub_value": "$ 3.3M ",
                "sub_value_color": "green",
                "direction": "up",
                "direction_color": "green"
                }
            ]
        ).json_string

    Returns:
    -------
    The `json_string` attribute returns a JSON string that is used to render the component on the UI
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
    {
        "action_type": "generate_schedule",
        "component_type": "marquee_slider",
        "params": {
            "inputs": {
                "title": "Key Insights",
                "direction": "left",
                "speed": 100,
                "itemData": [{
                        "id": 1,
                        "value": "Sales performance during events in ahead of competitors",
                        "sub_value": "$ 3.3M ",
                        "sub_value_color": "green",
                        "direction": "up",
                        "direction_color": "green"
                    },
                    {
                        "id": 2,
                        "value": "Sales performance during events in ahead of competitors",
                        "sub_value": "$ 3.3M ",
                        "sub_value_color": "green",
                        "direction": "up",
                        "direction_color": "green"
                    }
                ]
            }
        },
        "position": {
            "portal": "screen_top_left",
            "style": {
                "width": "100%",
                "height": "15vh"
            }
        }
    }
    ```
    """

    DEFAULT_CODE = """
    from codex_widget_factory_lite.screen_actions.screen_actions_marquee_slider import MarqueeSlider
    dynamic_outputs = MarqueeSlider(
    action_type = 'generate_schedule', # give a custom action type name here, this will be used in action handler code
    position = 'screen_top_left', # Define the position of the slider.
    height='10vh' , # Define the height of the slider.
    speed= 50,  # Define the speed of the movement of slider values.
    direction = 'right',  # Define the direction of the slider.
    title="This is title",  # Set the text to show as title.
    data=[  # Define a list of data items with each item being a dictionary
        {
        "id": 1,
        "value": "Sales performance during events in ahead of competitors",
        "sub_value": "$ 3.3M ",
        "sub_value_color": "green",
        "direction": "up",
        "direction_color": "green"
        },
        {
        "id": 2,
        "value": "Sales performance during events in ahead of competitors",
        "sub_value": "$ 3.3M ",
        "sub_value_color": "green",
        "direction": "up",
        "direction_color": "green"
        }
    ]
    ).json_string
"""

    def __init__(
        self,
        action_type,
        title,
        data,
        direction="left",
        speed=50,
        height="15vh",
        position="screen_top_left",
    ):
        super().__init__()
        self.__initialise_component_dict(action_type, position, height, title, direction, speed, data)

    def __initialise_component_dict(self, action_type, position, height, title, direction, speed, data):
        if action_type is None:
            logging.warning("No action type value provided")
            action_type = ""
        if data is None:
            logging.warning("You are not providing any data")
            data = []
        self.component_dict["actions"].append(
            {
                "action_type": action_type,
                "component_type": "marquee_slider",
                "params": {
                    "inputs": {
                        "title": title,
                        "direction": direction,
                        "speed": speed,
                        "itemData": data,
                    }
                },
                "position": {
                    "portal": position,
                    "style": {"width": "100%", "height": height},
                },
            }
        )
