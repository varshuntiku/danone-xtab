# Introduction
This is designed to analyze and update simulation data based on a scenario. Below example computes and updates unemployment plot based on inputs from a simulator component. If a specific action type ("Simulator Trigger") is detected, it recalculates and updates the values in data. If no valid action type is found, it defaults to a predefined set of data. Similarly any component can be used to analyze your model against any scenario.

## Linking Simulator to a widget
- `simulator_link`: Boolean indicating the presence of a simulator link. If this is made true - action type ("Simulator Trigger") is detected whenever user analyzes simulator changes

## Simulator initiation
- `sim`: An instance of the Simulator class, initialized with the following:
         * "app_id" - The identifier for the application, set to 7 in this instance.
         * "base_url" - The base URL for the API endpoint. This is where the simulator sends its requests. It should be set to,
            - `https://nuclios-fastapi-dev.azurewebsites.net/nuclios-product-api`: for development
            - `https://nuclios-fastapi-qa.azurewebsites.net/nuclios-product-api`: for QA
            - `https://nuclios-fastapi-uat.azurewebsites.net/nuclios-product-api` : for UAT
            - `https://nuclios-fastapi.azurewebsites.net/nuclios-product-api` : for Prod
            <br/>
          NOTE: When on client environment replace base url with client's base url.
         * "token" - A secure string used to authenticate and authorize API requests. This token should be generated from Generate PAT under platform utilis to ensure safe and proper access to the simulator's function.

## Analyzing simulator inputs

- Action type 'Simulator Trigger' is triggered when you click on the analyze button on simulator widget on the screen .Current Simulator data can be fetched through screen variables and analyzed on action trigger as shown below


```
def get_simulator_screen_variables():
    """
    The function helps to get the screen variables when using a
    simulator component.

    Returns
    -------
    A tuple containing - action_type, screen_data, selected_filters
    """
    selected_filters = None
    if "action_type" in globals().keys():
        action_type = globals()["action_type"]
        screen_data = globals()["screen_data"]
    else:
        action_type = None
        screen_data = None

    return action_type, screen_data

action_type, screen_data = get_simulator_screen_variables()

if action_type:
    # Component items are assigned with modified values according to user inputs
    if action_type=="Simulator Trigger":
        # screen_data['sim_data'] gives you modified simulator input values json . This data along with your existing model is used to recalculate the widget value-(in this case a plotly graph) as per the usecase
        simulator_data = screen_data['sim_data']

```

# Sample Code Attributes and Methods

- `get_json` : Retrieves and parses JSON data from a specified blob in Azure Blob Storage.
- `json_string` : An attribute of the component conversion object which returns a JSON string for the component, which is used to render the component on the UI. Kindly refer the sample codes for usage.
- `add_trace()` : It is used to add a new plot (also called a "trace") to an existing figure. A trace represents a single dataset or series that will be displayed on the graph, such as a line, scatter plot, bar chart, or other type of visualization.
        - `X-axis Data`: list of quarter labels
        - `Y-axis Data`: CCI values for the default scenario
        - `mode='lines+markers'`: The trace will be represented as a line plot with markers at the data points.
        - `name='CCI'`: This sets the name for the trace in the plot legend, so it will appear as "CCI" in the chart.
- `update_layout()` : It is used to modify the layout and styling of the entire figure. It allows one to customize attributes such as titles, axis labels and legends.
        - `title` : This sets the overall title of the figure.
        - `xaxis_title` : This sets the title for the x-axis (horizontal axis).
        - `yaxis_title` : This sets the title for the y-axis (vertical axis).
        - `template` : This specifies the visual template or theme for the plot. In this case, 'plotly' is the default theme, which uses a clean white background with grid lines and default styling.
- `codex_tags`: A dictionary containing metadata about the storage and retrieval of the simulator’s data:
        - "account" - Name of the account used in the file path.
        - "channel" - Channel name, part of the file path.
        - "product" - Product name, part of the file path.
        - "connection_url" - The connection string for the Azure Blob Storage.

## Sample Code

```
def import_app_func(key):
    import imp
    return imp.load_source("module_name", "app_func_widget_action_7_936_gokul_rayankula_mathco_com_1724308461_1601737/"  + key.replace("/", "_") + ".py")

import json
import numpy as np
import pandas as pd
from azure.storage.blob import BlockBlobService

def get_json(datasource_type='azure_blob_storage', connection_uri=None, container_name=None, blob_name=None):
    block_blob_service = BlockBlobService(connection_string=connection_uri)
    blob_item = block_blob_service.get_blob_to_bytes(container_name, blob_name)
    data = blob_item.content
    return json.loads(data)

codex_tags = {
    "account": "mars-petcare",
    "channel": "SPT",
    "product": 'SPT DRY FOOD',
    "connection_url": "DefaultEndpointsProtocol=https;AccountName=willbedeletedsoon;AccountKey=qa5A74pLx0IQxOJk4MGoQChO8kJW6u9rjUBQj8gOeL3bPADodK27ExoEMY/Gq1BIY1tDk9hEWQT+JcnhDO79SQ==;EndpointSuffix=core.windows.net"
}
# 1. Create the file path to retrieve data from blob storage
file_path = codex_tags['account'] + '/' + codex_tags['channel'] + '/' + codex_tags['product']

# 3. Get default simulator inputs
default_simulator_inputs = get_json(datasource_type='azure_blob_storage', connection_uri=codex_tags['connection_url'], container_name=file_path, blob_name='default_simulator_inputs.json')

from codex_widget_factory_lite.visuals.plotly_graph import PlotlyGraph
import plotly.graph_objects as go
data = default_simulator_inputs
df = pd.DataFrame(data)

#This calculation function is problem specific and changes depending on the usecase . This is used specifically for this example .
# Calculate the correlation coefficient
correlation = df['Covid Waves'].corr(df['Unemployment'])
slope_coeff=1
intercept_coeff=0
def calculate_coeff():
    from sklearn.linear_model import LinearRegression
    #Reshape the data for the model
    X = df['Covid Waves'].values.reshape(-1, 1)
    y = df['Unemployment'].values
    # Create and fit the model
    model = LinearRegression()
    model.fit(X, y)

    # Get the slope (m) and intercept (b)
    slope_coeff = 1/model.coef_[0]
    intercept_coeff = model.intercept_
    return slope_coeff,intercept_coeff
slope_coeff,intercept_coeff =  calculate_coeff()

#calculate unemployment value
def calculate_unemployment(covid_val):
    return slope_coeff*covid_val + intercept_coeff

#get simulator data
def get_simulator_screen_variables():
    """
    The function helps to get the screen variables when using a
    simulator component.

    Returns
    -------
    A tuple containing - action_type, screen_data, selected_filters
    """
    selected_filters = None
    if "action_type" in globals().keys():
        action_type = globals()["action_type"]
        screen_data = globals()["screen_data"]
    else:
        action_type = None
        screen_data = None

    return action_type, screen_data

action_type, screen_data = get_simulator_screen_variables()

def convert_data(input_data):
  converted_data = {}
  for item in input_data:
    header = item['header']
    converted_data[header] = {}
    for input_item in item['inputs']:
        quarter = input_item['id']
        value = input_item['value']
        converted_data[header][quarter] = value
  return converted_data

# This condition is triggered on analyze button click
if action_type:
    # Component items are assigned with modified values according to user inputs
    if action_type=="Simulator Trigger":
        covid_data = convert_data(screen_data['sim_data'])
        covid_data=covid_data['Covid Waves']
        for quarter_name in list(data['Unemployment'].keys()):
              data['Unemployment'][quarter_name] = calculate_unemployment(covid_data[quarter_name])

# Data
quarters = list(data['Unemployment'].keys())
Unemployment_values = list(data['Unemployment'].values())

# Create traces
fig = go.Figure()

# Add Unemployment trace
fig.add_trace(go.Scatter(
    x=quarters,
    y=Unemployment_values,
    mode='lines+markers',
    name='Unemployment',
    line=dict(color='blue')
))
# Update layout
fig.update_layout(
    title='Unemployment Across 2020',
    xaxis_title='Quarter',
    yaxis_title='Unemployment Value',
    template='plotly'
)

output=PlotlyGraph(plot_object = fig)
data=output.json_string
data=json.loads(data)
data["simulator_link"] = True
dynamic_outputs = json.dumps(data)

code_outputs = dynamic_outputs

```