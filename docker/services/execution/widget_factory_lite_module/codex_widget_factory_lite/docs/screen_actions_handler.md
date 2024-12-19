# Introduction

This section illustrates how to configure handler code for screen level actions.


# Arguments

* `message` (string,  optional) - Any message to be displayed on the application UI as a notification. Only required for screen action buttons (including download)
* `type`  (string,  optional, default="success") : The styling of the message notification. It can take the following values - `success`, `error` and `warning`.
* `url` (string,  optional) : Required only for download action. The
* `message_list`(string,  optional) : Required only when screen action is text list. This parameter contains a list of dictionaries. Each dictionary can have two properties:

  * `text` (string, mandatory): A string which needs to be sent to the UI
  * `style` (dict, optional): A react style compatible dictionary which can take keys such as `fontWeight`, `color`, `fontStyle`, etc.
  A sample `message_list` is shown below -

  ```
  [
    {
      "text": "Some heading :",
      "style": {
        "fontWeight": 600
      }
    },
    {
      "text": "test value",
      "style": {
        "color": "contrast"
      }
    }
  ]
  ```

A few guidelines for handling screen level action buttons can be described as -

* Kindly note to the `action_type` variable that is defined in the action generator section - that is handy while writing the action generator code
* Write any custom logic that needs to be handled here - calling a database, API, predicting from a model, etc. **Do not perform operations that require massive computation time and resources here**.
* Mandatorily use `url` property (along with `message` and `type`) when configuring handler for a screen action download button.
* Mandatorily use only the `message_list` parameter when configuring handler for a screen action text info component.

# Attributes and Methods

- `json_string` : An attribute of the component conversion object which returns a JSON string for the component, which is used to render the component on the UI. Kindly refer the sample codes for usage.


# Code Examples

For all examples, the `action_type` refers to the examples shown for the respective screen action generators.


## Screen action button

```
from codex_widget_factory_lite.screen_actions.screen_actions_handler import ScreenActionsHandler
if action_type == "test_button_action":
  ########
  # Add your custom business logic here
  ########
  dynamic_outputs = ScreenActionsHandler(message = "Some cool button this is!",
    type = "success").json_string
```

## Screen Action Download

```
from codex_widget_factory_lite.screen_actions.screen_actions_handler import ScreenActionsHandler
########
# Hardcode the action_type while testing code on the Co.dx app configurator, do not forget to comment this chunk while deploying
# action_type = "test_download_action"
########
if action_type == "test_download_action":
  ########
  # Add your custom business logic here to generate download links
  ########
  dynamic_outputs = ScreenActionsHandler(message = "Some cool button this is!",
    type = "success",
    download_url='https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data').json_string
```

## File Download

```
from codex_widget_factory_lite.screen_actions.screen_actions_handler import ScreenActionsHandler
########
# Hardcode the action_type while testing code on the Co.dx app configurator, do not forget to comment this chunk while deploying
# action_type = "test_download_file_content"
########
if action_type == "test_download_file_content":
  ########
  # Add your custom business logic here to generate download links
  ########
  dynamic_outputs = ScreenActionsHandler(message = "Some cool button this is!",
    type = "success",
    download_url='https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data').json_string
```

## Screen Action Text

```
from codex_widget_factory_lite.screen_actions.screen_actions_handler import ScreenActionsHandler
########
# Hardcode the action_type while testing code on the Co.dx app configurator, do not forget to comment this chunk while deploying
# action_type = "test_text_action"
########
if action_type == "test_text_action":
  ########
  # Add your custom business logic here to generate the text to be rendered
  ########
  dynamic_outputs = ScreenActionsHandler(message_list = [
    { "text": "Some heading :", "style": { "fontWeight": 600 } },
    { "text": "test value", "style": { "color": "contrast" } } ]).json_string
```

## Multiple Action Handlers

If your screen contains multiple screen actions, each of them can be handled separately as illustrated in this example

```
from codex_widget_factory_lite.screen_actions.screen_actions_handler import ScreenActionsHandler
########
# Hardcode the action_type while testing code on the Co.dx app configurator, do not forget to comment this chunk while deploying
# action_type = "test_text_action"
########
if action_type == "test_button_action":
  ########
  # Add your custom business logic here
  ########
  dynamic_outputs = ScreenActionsHandler(message = "Some cool button this is!",
    type = "success").json_string
elif action_type == "test_download_action":
  ########
  # Add your custom business logic here to generate download links
  ########
  dynamic_outputs = ScreenActionsHandler(message = "Some cool button this is!",
    type = "success",
    download_url='https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data').json_string
elif action_type == "test_download_file_content":
  ########
  # Add your custom business logic here to generate download links
  ########
  dynamic_outputs = ScreenActionsHandler(message = "Some cool button this is!",
    type = "success",
    download_url='https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data').json_string
```

# JSON Structure

## Action Buttons and Download Button

```
{
  "message" : "This is a test message",
  "type": "success",
  "url": "Applicable only for download screen action"
}
```

## Screen Action text

```
{
  "list": [
    {
      "text": "Some heading :",
      "style": {
        "fontWeight": 600
      }
    },
    {
      "text": "test value"
      "style": {
        "color": "contrast"
      }
    }
  ]
}
```
