# Introduction
 This function retrieves scenario data based on a list of scenario names and compares a selected scenario against another. It then organizes the data into a format suitable for visualization. If the user wishes to compare scenarios through graphs or tables, the UI components should be adjusted accordingly. The list of scenarios and the corresponding data will be available through the Simulator Widget Factory Lite module.
 <br/>
 NOTE: You need to save atleast two scenarios for this widget to work. The compare table is only configurable for lever data.


## Arguments

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
- `compare_data`: The scenario data to be used as a benchmark for comparison should be assigned to this attribute.
- `data`: This attribute should hold the information about the current or primary scenario being analyzed.
- `List[0]`: The first scenario name from the list of available scenarios.Serves as the base scenario for comparison
- `List[1]`: The second scenario name from the list of available scenarios.Serves as the comparison scenario.
- `widget_filters`: List of scenario names , pass this for widget level filters on insights
- `selected_filter_index`: Index of default scenario selected from list of filters

# Attributes and Methods

- `json_string` : An attribute of the component conversion object which returns a JSON string for the component, which is used to render the component on the UI. Kindly refer the sample codes for usage.
- `sim.app_scenario_list()` : Fetches a list of available scenario names from the simulator.
- `sim.get_scenario_data(scenario_name)`: Retrieves scenario data for a given scenario name.
            - `scenario_name`: Name of the scenario to retrieve data for.

## Sample Code

```
from codex_widget_factory_lite.utils.simulator.simulator import Simulator
#pat_token - generated from platform utils.
#base_url -  The base URL for the API endpoint of current environment. Replace it with client API endpoint if you are client environment
token=pat_token
sim = Simulator(app_id=7031,base_url=base_url,token=token)

List = sim.app_scenario_list()
data = sim.get_scenario_data(List[0])
compare_data = sim.get_scenario_data(List[List.index('Optimized Scenario')])
compare_data = compare_data['scenarios_json']
data = data['scenarios_json']
table_data=data
import json
from codex_widget_factory_lite.visuals.insights import Insights
data = Insights(insights_values = [{
      "label": data['sections'][0]['inputs'][0]["label"],
      "value": data['sections'][0]['inputs'][0]["value"]
    },
    {
      "label": data['sections'][1]['inputs'][0]["label"],
      "value": data['sections'][1]['inputs'][0]["value"]
    },
    {
      "label": data['sections'][1]['inputs'][1]["label"],
      "value": data['sections'][1]['inputs'][1]["value"]
    }]).json_string
data = json.loads(data)
data['insight_label'] = List[0]

#widget_filters and selected_filter_index are required to get filter dropdown and it's default value.
data['widget_filters'] = List
data['selected_filter_index'] = 0

#present_scenario and compare_scenario arguments are required to visualize the comparision table.
data['present_scenario']=table_data['sections']
data['compare_scenario']=compare_data['sections']
data['table_header'] =  List[0]
dynamic_outputs = json.dumps(data)

```
## Applying Filter changes to Compare Table on Insights

Whenever a filter is changed, the Widget Filter Trigger action is invoked

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
    if action_type=="Widget Filter Trigger":
        data = sim.get_scenario_data(screen_data['selected_filter'])
        data = data['scenarios_json']
table_data=data
import json
from codex_widget_factory_lite.visuals.insights import Insights
data = Insights(insights_values = [{
      "label": data['sections'][0]['inputs'][0]["label"],
      "value": data['sections'][0]['inputs'][0]["value"]
    },
    {
      "label": data['sections'][0]['inputs'][1]["label"],
      "value": data['sections'][0]['inputs'][1]["value"]
    },
    {
      "label": data['sections'][0]['inputs'][2]["label"],
      "value": data['sections'][0]['inputs'][2]["value"]
    },
      {
      "label": data['sections'][0]['inputs'][3]["label"],
      "value": data['sections'][0]['inputs'][3]["value"]
    }]).json_string
data = json.loads(data)
data['insight_label'] = List[0]
data['widget_filters'] = List
data['selected_filter_index'] = 0
data['present_scenario']=table_data['sections']
data['compare_scenario']=compare_data['sections']
if screen_data:
  data['table_header'] =screen_data['selected_filter']
else:
      data['table_header'] =List[0]
dynamic_outputs = json.dumps(data)
```