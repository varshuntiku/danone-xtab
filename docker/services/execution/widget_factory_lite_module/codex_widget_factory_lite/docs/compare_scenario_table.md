# Introduction
 This function retrieves scenario data based on a list of scenario names and compares a selected scenario against another. It then organizes the data into a table format.Supports plotly renders in table columns . The list of scenarios and the corresponding data will be available through the Simulator Widget Factory Lite module. 
 <br/>
 NOTE: You need to save atleast three scenarios for this widget to work. The compare table is only configurable for lever data.


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

# Attributes and Methods

- `sim.app_scenario_list()` : Fetches a list of available scenario names from the simulator.
- `sim.get_scenario_data(scenario_name)`: Retrieves scenario data for a given scenario name.
            - `scenario_name`: Name of the scenario to retrieve data for.

## Sample Code

```
from codex_widget_factory_lite.utils.simulator.simulator import Simulator
#pat_token - generated from platform utils.
#base_url -  The base URL for the API endpoint of current environment. Replace it with client API endpoint if you are client environment 
token=pat_token      
sim = Simulator(app_id=app_id,base_url=base_url,token=token)

# Fetch scenario list and data dynamically
scenario_list = sim.app_scenario_list()
scenario_data = [sim.get_scenario_data(scenario) for scenario in scenario_list[0:3]]
# Prepare the dynamic data dictionary based on fetched data
data = {
    "scenarios": [],
    "plot_header": "Total Spends Vs Marketing ROI",
    "include_plotly": True
}

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
    if action_type=="Compare Filter Trigger":
        scenario_data=screen_data['scenarios']


# Function to format large numbers with M suffix
def format_large_number(value):
    return f"${value / 1_000:.2f} M"

    

# Loop through each scenario fetched from the API and dynamically create the structure
for scenario in scenario_data:
    scenario_json = scenario['scenarios_json']
    
    # Ensure that the sections are correctly ordered and contain the expected inputs
    try:
        scenario_obj = {
            "name": scenario['name'],
            "total_sales": format_large_number(scenario_json['sections'][0]['inputs'][0]['value']),
            "incremental_sales": format_large_number(scenario_json['sections'][1]['inputs'][0]['value']),
            "media_spends": format_large_number(scenario_json['sections'][2]['inputs'][0]['value']),
            "marketing_roi": str(scenario_json['sections'][3]['inputs'][0]['value']),
            "total_spends": format_large_number(scenario_json['sections'][4]['inputs'][0]['value'])
        }
        
        # Calculate pie chart values for Total Spends and Marketing ROI
        total_spends = scenario_json['sections'][4]['inputs'][0]['value']
        marketing_roi = float(scenario_json['sections'][3]['inputs'][0]['value'])

        # Calculate percentages for the pie chart
        total_roi_value = total_spends * marketing_roi
        remaining_spends = total_spends - total_roi_value

        values = [total_roi_value, remaining_spends]
        labels = ['Marketing ROI', 'Remaining Spends']

        # Pie chart plot_data using custom logic
        plot_data = [{
            "values": values,
            "labels": labels,
            "type": "pie",
            "hole": 0.9,  # Donut chart
            "marker": {
                "colors": ["#220047", "#F08080"]  # Custom colors for ROI and Remaining
            }
        }]

        # Custom layout for the pie chart
        plot_layout = {
            "showlegend": True,
            "legend": {
                "orientation": 'h',
                "y": -0.2,
                "x": 0
            },
            "annotations": [
                {
                    "font": {
                        "size": 18
                    },
                    "showarrow": False,
                    "text": f"Total: ${total_spends} M",  # Total spends annotation
                    "x": 0.5,
                    "y": 0.5
                }
            ],
            "margin": {"t": 0}
        }

        # Add plot_data and plot_layout dynamically
        scenario_obj['plot_data'] = plot_data
        scenario_obj['plot_layout'] = plot_layout

        # Append scenario to the main data structure
        data['scenarios'].append(scenario_obj)

    except (KeyError, IndexError) as e:
        print(f"Error processing scenario: {scenario['name']}. Error: {e}")

# Add 'isCompareTable' key dynamically
# To render compare scenario table
data['isCompareTable'] = True

# Convert the updated dictionary to a JSON string
dynamic_outputs = json.dumps(data, indent=4)
```

## JSON Structure
    {
     "scenarios": [
    {
      "name": "Recommended scenario",
      "total_sales": "$9.69 M",
      "incremental_sales": "$1.94 M",
      "media_spends": "$0.73 M",
      "marketing_roi": "2.81",
      "total_spends": "$0.75 M",
      "plot_data": [
        {
          "values": [2113.12, -1361.12],
          "labels": ["Marketing ROI", "Remaining Spends"],
          "type": "pie",
          "hole": 0.9,
          "marker": {
            "colors": ["#220047", "#F08080"]
          }
        }
      ],
      "plot_layout": {
        "showlegend": true,
        "legend": {
          "orientation": "h",
          "y": -0.2,
          "x": 0
        },
        "annotations": [
          {
            "font": {
              "size": 18
            },
            "showarrow": false,
            "text": "Total: $752 M",
            "x": 0.5,
            "y": 0.5
          }
        ],
        "margin": {
          "t": 0
        }
      }
    },
    {
      "name": "Scenario 2",
      "total_sales": "$9.69 M",
      "incremental_sales": "$2.13 M",
      "media_spends": "$0.73 M",
      "marketing_roi": "2.81",
      "total_spends": "$0.83 M",
      "plot_data": [
        {
          "values": [2323.87, -1496.87],
          "labels": ["Marketing ROI", "Remaining Spends"],
          "type": "pie",
          "hole": 0.9,
          "marker": {
            "colors": ["#220047", "#F08080"]
          }
        }
      ],
      "plot_layout": {
        "showlegend": true,
        "legend": {
          "orientation": "h",
          "y": -0.2,
          "x": 0
        },
        "annotations": [
          {
            "font": {
              "size": 18
            },
            "showarrow": false,
            "text": "Total: $827 M",
            "x": 0.5,
            "y": 0.5
          }
        ],
        "margin": {
          "t": 0
        }
      }
    },
    {
      "name": "Scenario 1",
      "total_sales": "$9.69 M",
      "incremental_sales": "$2.13 M",
      "media_spends": "$0.73 M",
      "marketing_roi": "2.81",
      "total_spends": "$1.58 M",
      "plot_data": [
        {
          "values": [4436.99, -2857.99],
          "labels": ["Marketing ROI", "Remaining Spends"],
          "type": "pie",
          "hole": 0.9,
          "marker": {
            "colors": ["#220047", "#F08080"]
          }
        }
      ],
      "plot_layout": {
        "showlegend": true,
        "legend": {
          "orientation": "h",
          "y": -0.2,
          "x": 0
        },
        "annotations": [
          {
            "font": {
              "size": 18
            },
            "showarrow": false,
            "text": "Total: $1579 M",
            "x": 0.5,
            "y": 0.5
          }
        ],
        "margin": {
          "t": 0
        }
      }
    }
      ],
      "plot_header": "Total Spends Vs Marketing ROI",
      "include_plotly": true,
      "isCompareTable": true
     }
