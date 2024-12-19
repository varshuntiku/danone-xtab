# Tabular simulator
# The Table Simulator is a dynamic component designed to enable users to configure a wide range of inputs in an intuitive tabular format. This allows users to simulate and test various scenarios efficiently, facilitating better decision-making and analysis.

# This component is organized into two main sections
# - top level section
# - simulator section

# Top level section
# In the Top Level Section, users have the ability to configure various input options in the order that's give below
# Dropdown Menus: Select single options from a list for streamlined decision-making.
# Radio Button Groups: Choose one option from a set of mutually exclusive choices, ensuring clarity in selection.
# Multi-Select Dropdowns: Allow users to select multiple options from a dropdown list

# simulator section
# In simulator section , user can configure dropdwon , toggle button , input of type number, ,min/max numeric input for sliders and sliders.

# Examples of Configuring Various Input Types
# First, import the Simulator from the Widget Factory module
```
import json
import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from azure.storage.blob import BlockBlobService
from io import StringIO
from pathlib import Path
from codex_widget_factory_lite.utils.simulator.simulator import Simulator
# Creates a simulator object for app id 7
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzIwODQ3NzUsImlhdCI6MTcyNDMwODc3NSwic3ViIjoiYWRpdHlhLmtyaXNobmFuQG1hdGhjby5jb20iLCJhY2Nlc3MiOnsidHJpZ2dlcl9ub3RpZmljYXRpb24iOnRydWUsInRyaWdnZXJfZW1haWxfbm90aWZpY2F0aW9uIjp0cnVlfX0.CKRqY2KQ0BJS-mR5NNvF3R2y3BqXltGbFn2RqU9hJQ4"
sim = Simulator(
    app_id=7, base_url="http://127.0.0.1:8005/nuclios-product-api", token=token
)
```


# Dropdown (single select)

# The `create_dropdown` method is used to create a single-select dropdown and accepts the following arguments
# - `label`(string) : This parameter specifies the label for the dropdown, providing context for users about what to select.
# - `value`(string) : This sets the default value displayed in the dropdown when it is first rendered.
# - `options`(list) : A list of objects that represent the selectable items in the dropdown.
# - `variant`(string, optional) Allows selection of different styles , such as "outlined" or "standard
```
        sim.create_dropdown(
            label="dropdown",
            value="option1",
            options=[
                {"label": "option1", "value": "option1"},
                {"label": "option2", "value": "option2"},
                {"label": "option3", "value": "option3"},
            ],
        )
```

# Radio button Group
# The `create_radio_button` method is used to create radio button group and accepts the following arguments
# - `label`(string) : This parameter specifies the label for the radio button group, providing context for users about what to select.
# - `value`(string) : This sets the default value displayed when it is first rendered.
# - `options`(list) : A list of objects that represent the selectable items.
```
        sim.create_radio_button(
            label="radio group",
            value="option1",
            options=[
                {"label": "option1", "value": "option1"},
                {"label": "option2", "value": "option2"},
                {"label": "option3", "value": "option3"},

            ],
        ),
```

# Multi Select dropdown
# The `create_multiselect_dropdown` method is used to create a multi-select dropdown and accepts the following arguments
# - `label`(string) : This parameter specifies the label for the dropdown, providing context for users about what to select.
# - `value`(string) : This sets the default value displayed in the dropdown when it is first rendered.
# - `options`(list) : A list of objects that represent the selectable items in the dropdown.
```
        sim.create_multiselect_dropdown(
            label="mutliselect",
            options=[
                {"label": "option1", "value": "option1"},
                {"label": "option2", "value": "option2"},
                {"label": "option3", "value": "option3"},
                {"label": "option4", "value": "option4"},
                {"label": "option5", "value": "option5"},
                {"label": "option6", "value": "option6"},

            ],
        ),
```

# Toggle Button
# The `create_multiselect_dropdown` method is used to create a toggle button and accepts the following arguments
# - `label`(string) : This parameter specifies the label for the toggle button.
# - `value`(Boolean) : This sets the default value displayed in the toggle button when it is first rendered.
# - `disbled`(Boolean) : If not provided, the value defaults to false. To disable the toggle button, pass the value as True
```
 sim.create_toggle(label="active", value=True),
```

# Number input
# The `create_number_input` method is used to create a number input and it accepts the following arguments
# - `label`(string) : This parameter specifies the label for the input.
# - `value`(Boolean) : This sets the default value displayed in the input when it is first rendered.
# - `min`(list) : minimum value that input can have
# - `max`(string) : maximum value that input can have.
# - `variant`(Boolean, optional) : Allows selection of different styles for the input, such as "outlined" or "standard.
# - `disbled`(Boolean) : If not provided, the value defaults to false. To disable the input, pass the value as True
# - `height`(list, optional) : Accepts values such as "small," "default," and "large" to adjust the height of the input field

# sliders
# The `create_slider` method is a tool  that allow users to select values within a specified range.This method can be effectively paired with mini and maxi input fields, enabling dynamic adjustments to the slider's range (use thee number input and pass label as min and max)so, that slider range can be changed dynamically through min and max input in ui

# Example of slider with min and max
********************** Add image here ************************************************


# Adding top level and simulator inputs
# The create_toplevel_inputs method accepts a list as an argument, where this list contains the input elements like dropdown and radio group and multislect dropdown created using the previously mentioned methods

```
toplevel_inputs = sim.create_toplevel_inputs(
    [
        sim.create_dropdown(
            label="dropdown",
            value="option1",
            options=[
                {"label": "option1", "value": "option1"},
                {"label": "option2", "value": "option2"},
                {"label": "option3", "value": "option3"},
            ],
        ),
        sim.create_radio_button(
            label="radio group",
            value="option1",
            options=[
                {"label": "option1", "value": "option1"},
                {"label": "option2", "value": "option2"},
                {"label": "option3", "value": "option3"},

            ],
        ),
        sim.create_multiselect_dropdown(
            label="mutliselect",
            value=["option1","option2","option3"],
            options=[
                {"label": "option1", "value": "option1"},
                {"label": "option2", "value": "option2"},
                {"label": "option3", "value": "option3"},

            ],
        ),
    ]
)
```

# The `create_simulator_inputs` method accepts a list as an argument, where each element is itself a list representing a row, this list contains the input elements created using the previously mentioned methods

```
simulator_inputs = sim.create_simulator_inputs(
    [
        [
            sim.create_dropdown(
                label="dropdown",
                value="option1",
                options=[
                    {"label": "option1", "value": "option1"},
                    {"label": "option2", "value": "option2"},
                    {"label": "option3", "value": "option3"},
                ],
            ),
            sim.create_toggle(label="active", value=True),
            sim.create_toggle(label="passive", value=True),
            sim.create_number_input(label="budget", value=100,height='large'),
            sim.create_number_input(label="min", value=80, min=0, max=100),
            sim.create_slider(label="slider", value=150, steps=2),
            sim.create_number_input(label="max", value=120, min=101, max=200),
        ],
        [
            sim.create_dropdown(
                label="dropdown1",
                value="option1",
                options=[
                    {"label": "option1", "value": "option1"},
                    {"label": "option2", "value": "option2"},
                ],
            ),
            sim.create_toggle(label="active", value=True),
             sim.create_toggle(label="passive", value=True),
            sim.create_number_input(label="budget", value=100),
            sim.create_number_input(label="min", value=80, min=0, max=100),
            sim.create_slider(label="slider", value=150, steps=2),
            sim.create_number_input(label="max", value=120, min=101, max=200),
        ]
    ]
)
```
# create_table_simulator
The `create_table_simulator` is a main method which accepts top level and simulator inputs and also action buttons as arguments, this method retrun the final json combining all the inputs that are created using previous methods
```
dynamic_outputs =  json.dumps(sim.create_table_simulator(toplevel_inputs, simulator_inputs, actions))
```

- ![progress bar component](./images/table_simulator.png)


# sample code

```
import json
import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from azure.storage.blob import BlockBlobService
from io import StringIO
from pathlib import Path
from codex_widget_factory_lite.utils.simulator.simulator import Simulator
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzIwODQ3NzUsImlhdCI6MTcyNDMwODc3NSwic3ViIjoiYWRpdHlhLmtyaXNobmFuQG1hdGhjby5jb20iLCJhY2Nlc3MiOnsidHJpZ2dlcl9ub3RpZmljYXRpb24iOnRydWUsInRyaWdnZXJfZW1haWxfbm90aWZpY2F0aW9uIjp0cnVlfX0.CKRqY2KQ0BJS-mR5NNvF3R2y3BqXltGbFn2RqU9hJQ4"
sim = Simulator(
    app_id=7, base_url="http://127.0.0.1:8005/nuclios-product-api", token=token
)
toplevel_inputs = sim.create_toplevel_inputs(
    [
        sim.create_dropdown(
            label="dropdown",
            value="option1",
            options=[
                {"label": "option1", "value": "option1"},
                {"label": "option2", "value": "option2"},
                {"label": "option3", "value": "option3"},
            ],
        ),
        sim.create_radio_button(
            label="radio group",
            value="option1",
            options=[
                {"label": "option1", "value": "option1"},
                {"label": "option2", "value": "option2"},
                {"label": "option3", "value": "option3"},

            ],
        ),
        sim.create_multiselect_dropdown(
            label="mutliselect",
            value=["option1","option2","option3"],
            options=[
                {"label": "option1", "value": "option1"},
                {"label": "option2", "value": "option2"},
                {"label": "option3", "value": "option3"},
                {"label": "option4", "value": "option4"},
                {"label": "option5", "value": "option5"},
                {"label": "option6", "value": "option6"},

            ],
        ),
    ]
)

simulator_inputs = sim.create_simulator_inputs(
    [
        [
            sim.create_dropdown(
                label="dropdown",
                value="option1",
                options=[
                    {"label": "option1", "value": "option1"},
                    {"label": "option2", "value": "option2"},
                    {"label": "option3", "value": "option3"},
                ],
            ),
            sim.create_toggle(label="active", value=True),
            sim.create_toggle(label="passive", value=True),
            sim.create_number_input(label="budget", value=100,height='large'),
            sim.create_number_input(label="min", value=80, min=0, max=100),
            sim.create_slider(label="slider", value=150, steps=2),
            sim.create_number_input(label="max", value=120, min=101, max=200),
        ],
        [
            sim.create_dropdown(
                label="dropdown1",
                value="option1",
                options=[
                    {"label": "option1", "value": "option1"},
                    {"label": "option2", "value": "option2"},
                ],
            ),
            sim.create_toggle(label="active", value=True),
             sim.create_toggle(label="passive", value=True),
            sim.create_number_input(label="budget", value=100),
            sim.create_number_input(label="min", value=80, min=0, max=100),
            sim.create_slider(label="slider", value=150, steps=2),
            sim.create_number_input(label="max", value=120, min=101, max=200),
        ]
    ]
)
actions=[
#Generate action button through simulator object . Arguments required (name,variant,type,action,action_flag_type)
sim.action("Reset","outlined","Primary","reset",False),
sim.action("Apply","contained","Primary","change"," Apply"),
      ]
dynamic_outputs =  json.dumps(sim.create_table_simulator(toplevel_inputs, simulator_inputs, actions))

```