# Introduction

Screen level action download help in adding a download buttons to the Co.dx application screen navigation bar. This button action can be customized bases on the business logic that needs to be performed when the button is clicked. In this documentation, we will focus on the former.

![Screen Action Download](./images/download_button_screen_action.png)

# Arguments


- `button_label` (string, required) : Define the name of your button using this argument.
- `action_type` (string, required) :  Define a custom action type name here, **this will be used in action handler code section.**
- `position` (string, optional, default='tab_nav_bar') : Used to define the position of the download button. Can take the following values - `tab_nav_bar`, `screen_top_left`, `screen_top_right`.


# Attributes and Methods

- `json_string` : An attribute of the component conversion object which returns a JSON string for the component, which is used to render the component on the UI. Kindly refer the sample codes for usage.
- `append_action` (ScreenActionObject) : A method that combines two screen actions. This is used when there is more than one screen action to be configured.


# Code Examples

## Single Screen Action
Simple example of a download action button added to the screen

```
from codex_widget_factory_lite.screen_actions.screen_actions_download_link_generator import ScreenActionDownload
dynamic_outputs = ScreenActionDownload(button_label = "Test button", # Give your button tooltip here
  action_type = "test_download_action", # give a custom action type name here, this will be used in action handler code
  position = 'tab_nav_bar' # button position, use one of the following - 'tab_nav_bar', 'screen_top_left', 'screen_top_right'
  ).json_string
```

## Multiple Screen Actions

It is possible to configure multiple screen actions using the `append_action` attribute. The example below illustrates how a download action can be combined with an action button

```
from codex_widget_factory_lite.screen_actions.screen_actions_button_generator import ScreenActionButton
from codex_widget_factory_lite.screen_actions.screen_actions_download_link_generator import ScreenActionDownload

# initialise download action
downloadObj = ScreenActionDownload(button_label = "Test button 2", # Give your button tooltip here
  action_type = "test_download_action", # give a custom action type name here, this will be used in action handler code
  file_name = 'file' #give a custom file name here
  position = 'tab_nav_bar',) # button position, use one of the following - 'tab_nav_bar', 'screen_top_left', 'screen_top_right'

# initialise download content
#contentdownloadObj = ScreenActionDownload(button_label = "Test button 3",  # Give your button tooltip here
  #action_type = "test_download_content", # give a custom action type name here, this will be used in action #handler code
  #position = 'tab_nav_bar')

# initialise download action and content
#filecontentdownloadObj = ScreenActionDownload(button_label = "Test button 4",  # Give your button tooltip here
 #action_type = "test_download_file_content", # give a custom action type name here, this will be used in #action handler code
 #file_name = 'file' #give a custom file name here
 #position = 'tab_nav_bar')

# combine actions
buttonObj = downloadObj
#buttonObj = contentdownloadObj
#buttonObj = filecontentdownloadObj

# generate dynamic actions
dynamic_outputs = buttonObj.json_string
```

# JSON Structure

The complete JSON structure of the component with sample data is captured below -

```
{
  "action_type": "download_latest_schedule",
  "component_type": "download_link",
  "params": {
    "is_icon": true,
    "text": "Download Schedule",
    "fetch_on_click": true
  },
  "position": {
    "portal": "tab_nav_bar"
  }
}
```
