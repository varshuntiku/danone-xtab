#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging
import traceback

from codex_widget_factory_lite.conversion_utils.base_conversion import BaseConversion


class Typography(BaseConversion):

    """
    The typography component helps to visualize and customize the typography to utilize the real estate available.
    to present all the required information to the end user for better consumption.
    ______________________________________________________________________

     Args:
        - `content` (string, required): List of markdown items with differnt styles are given inside the content parameter
    ______________________________________________________________________

    Attributes:
        - `json_string` : An attribute of the component conversion object which returns a JSON string for the component, which is used to render the component on the UI. Kindly refer the sample codes for usage.
        - `component_dict` : An attribute which returns the dictionary/JSON structure of the component. Unlike `json_string` attribute which returns a JSON string, this returns a python dictionary.

    ______________________________________________________________________

    Usage:
    -----
    - Sample code
    >>> import json
    >>> from codex_widget_factory_lite.visuals.typography import Typography

    >>> content = '''
    <h3 ystyle="background-color:#1E3E5F;font-size:4rem;padding:2rem;display:flex;align-items:center;font-family: Cursive;"><img src="https://cdn.pixabay.com/photo/2017/10/13/15/29/coffee-2847957_640.jpg" alt="img" style="heigh:150px;width:150px;margin-right:2rem"/> displaying some data in table</h3>

    | Syntax      | Description | Test Text     |
    | :---        |    :----:   |          ---: |
    | Header      | Title       | Here's this   |
    | Paragraph   | Text        | And more      |
    | Header      | Title       | Here's this   |
    | Paragraph   | Text        | And more      |


    <h1 style="font-family: Cursive">dispaly some other data</h1>

    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in\n

    1. First item
    2. Second item
    3. Third item
    4. Fourth item

    - First item
    - Second item
    - Third item

    # testing this
    **testing this** \n
    *italic statement*\n
    This text is ***really important***
    <p style="font-size:1.8rem">~~The world is flat.~~ We now know that the world is round.</p>
    I need to highlight these ==very important words==.
    <hr style="border-style:dashed"/>

    '''
    dynamic_outputs = Typography(
        content = content
    ).json_string

    Returns:
    -------
    The complete JSON structure of the component with basic sample data is captured below
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
    {
    "componentType": "custom:customTypography",
    "content": "\n<h3 style=\"background-color:#1E3E5F;font-size:4rem;padding:2rem;display:flex;align-items:center;font-family: Cursive;\"><img src=\"https://cdn.pixabay.com/photo/2017/10/13/15/29/coffee-2847957_640.jpg\" alt=\"img\" style=\"heigh:150px;width:150px;margin-right:2rem\"/> displaying some data in table</h3>\n\n| Syntax      | Description | Test Text     |\n| :---        |    :----:   |          ---: |\n| Header      | Title       | Here's this   |\n| Paragraph   | Text        | And more      |\n| Header      | Title       | Here's this   |\n| Paragraph   | Text        | And more      |\n\n\n <h1 style=\"font-family: Cursive\">dispaly some other data</h1>\n\n Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in\n\n\n1. First item\n2. Second item\n3. Third item\n4. Fourth item\n\n- First item\n- Second item\n- Third item\n\n\n\n# testing this\n**testing this** \n\n*italic statement*\n\nThis text is ***really important***\n<p style=\"font-size:1.8rem\">~~The world is flat.~~ We now know that the world is round.</p>\nI need to highlight these ==very important words==.\n<hr style=\"border-style:dashed\"/>\n\n"
    }

    ```
    """

    DEFAULT_CODE = """
import json
from codex_widget_factory_lite.visuals.typography import Typography

content = '''
<h3 style="background-color:#1E3E5F;font-size:4rem;padding:2rem;display:flex;align-items:center;font-family: Cursive;"><img src="https://cdn.pixabay.com/photo/2017/10/13/15/29/coffee-2847957_640.jpg" alt="img" style="heigh:150px;width:150px;margin-right:2rem"/> displaying some data in table</h3>

| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |


 <h1 style="font-family: Cursive">dispaly some other data</h1>

 Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in\n

1. First item
2. Second item
3. Third item
4. Fourth item

- First item
- Second item
- Third item



# testing this
**testing this** \n
*italic statement*\n
This text is ***really important***
<p style="font-size:1.8rem">~~The world is flat.~~ We now know that the world is round.</p>
I need to highlight these ==very important words==.
<hr style="border-style:dashed"/>

'''
dynamic_outputs = Typography(
    content = content
).json_string
code_outputs = dynamic_outputs
"""

    def __init__(self, content):
        super().__init__()
        self.__initialise_component_dict(content)

    def __initialise_component_dict(self, content):
        try:
            if not content:
                logging.warn("Please provide proper content")
                self.component_dict = {}
            else:
                self.component_dict = {"componentType": "custom:customTypography", "content": content}
        except Exception as ex:
            logging.error(f"Exception raised in Typography data constructor: {ex}")
            logging.error(traceback.format_exc())
