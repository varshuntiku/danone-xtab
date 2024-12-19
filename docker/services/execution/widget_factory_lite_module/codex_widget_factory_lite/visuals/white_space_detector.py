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


class WhiteSpaceDetector(BaseConversion):
    """
    The WhiteSpaceDetector class has the required conversion function to translate inputs
    into a JSON structure that can be rendered as a white space detector on the Co.dx UI.
    _________________________________________________________________________

    Args:
        `column_head_data` (list, required): List of columns head content with each column head dictionary containing id and head as mandatory keys
        `row_head_data` (list, required): List of rows head content with each row head dictionary containing id, head as mandatory and subhead as optional keys
        `cells_data` (dict, required): Dictionary of rows with each key as row head id and value as dictionary of columns with each key as column head id
        `legends` (list, optional): List of legends with each legend dictionary having mandatory id and name
        `axis_headers` (dict, optional): Dictionary of x and y axis headers text
        `icons_list` (list, optional): List of icons to be shown in cell dropdown having text and url for each icon
        `actions` (list, optional): List of action buttons to be added with text, name and variant
        `style_options` (dict, optional): Dictionary of custom styles to be applied
        `settings` (dict, optional): Dictionary of custom settings to be applied
    _________________________________________________________________________

    Attributes:
        json_string (str): This attribute generates a JSON string for the component
    _________________________________________________________________________

    Usage:
    -----
    - Sample code
    >>> import json
    >>> from codex_widget_factory_lite.visuals.white_space_detector import WhiteSpaceDetector
    >>> column_head_data = [
            {
                "id": "columnHead1",
                "head": "<6RMB"
            },
            {
                "id": "columnHead2",
                "head": "6-8RMB"
            }
        ]
    >>> row_head_data = [
            {
                "id": "rowHead1",
                "head": "<6RMB",
                "subhead": [
                    "Mkt Size: HL",
                    "Mkt Growth: %",
                    "CB Share: %"
                ]
            },
            {
                "id": "rowHead2",
                "head": "6-8RMB",
                "subhead": [
                    "Mkt Size: HL",
                    "Mkt Growth: %",
                    "CB Share: %"
                ]
            }
        ]
    >>> cells_data = {
            "rowHead1": {
                "columnHead1": {
                    "content": [
                        "20,112",
                        "-3%"
                    ],
                    "icons": [
                        "https://willbedeletedsoon.blob.core.windows.net/test-uploads/tuborg-can.png"
                    ]
                }
            },
            "rowHead2": {
                "columnHead1": {
                    "content": [
                        "60,112",
                        "23%"
                    ],
                    "icons": []
                },
                "columnHead2": {
                    "content": [
                        "60,112",
                        "23%"
                    ],
                    "icons": [
                        "https://willbedeletedsoon.blob.core.windows.net/test-uploads/sprite-can.png",
                        "https://willbedeletedsoon.blob.core.windows.net/test-uploads/tuborg-can.png"
                    ]
                }
            }
        }
    >>> dynamic_outputs = WhiteSpaceDetector(
            column_head_data = column_head_data,
            row_head_data = row_head_data,
            cells_data = cells_data
        ).json_string

    Returns:
    -------
    The `json_string` attribute returns a JSON string that is used to render the component on the UI
    _________________________________________________________________________

    The JSON structure for the component is -
    ```
    {
        "is_white_space_detector": true,
        "columnHeadData": [
            {
            "id": "columnHead1",
            "head": "<6RMB"
            },
            {
            "id": "columnHead2",
            "head": "6-8RMB"
            }
        ],
        "rowHeadData": [
            {
            "id": "rowHead1",
            "head": "<6RMB",
            "subhead": [
                "Mkt Size: HL",
                "Mkt Growth: %",
                "CB Share: %"
            ]
            },
            {
            "id": "rowHead2",
            "head": "6-8RMB",
            "subhead": [
                "Mkt Size: HL",
                "Mkt Growth: %",
                "CB Share: %"
            ]
            }
        ],
        "cellsData": {
            "rowHead1": {
            "columnHead1": {
                "content": [
                "20,112",
                "-3%"
                ],
                "icons": [
                "https://willbedeletedsoon.blob.core.windows.net/test-uploads/tuborg-can.png"
                ]
            }
            },
            "rowHead2": {
            "columnHead1": {
                "content": [
                "60,112",
                "23%"
                ],
                "icons": []
            },
            "columnHead2": {
                "content": [
                "60,112",
                "23%"
                ],
                "icons": [
                "https://willbedeletedsoon.blob.core.windows.net/test-uploads/sprite-can.png",
                "https://willbedeletedsoon.blob.core.windows.net/test-uploads/tuborg-can.png"
                ]
            }
            }
        },
        "legends": [],
        "axisHeaders": {},
        "iconsList": [],
        "actions": [],
        "styleOptions": {},
        "settings": {}
    }
    ```
    """

    DEFAULT_CODE = """
import json
from codex_widget_factory_lite.visuals.white_space_detector import WhiteSpaceDetector
column_head_data = [
    {
        "id": "columnHead1",
        "head": "<6RMB"
    },
    {
        "id": "columnHead2",
        "head": "6-8RMB"
    }
]
row_head_data = [
    {
        "id": "rowHead1",
        "head": "<6RMB",
        "subhead": [
            "Mkt Size: HL",
            "Mkt Growth: %",
            "CB Share: %"
        ]
    },
    {
        "id": "rowHead2",
        "head": "6-8RMB",
        "subhead": [
            "Mkt Size: HL",
            "Mkt Growth: %",
            "CB Share: %"
        ]
    }
]
cells_data = {
    "rowHead1": {
        "columnHead1": {
            "content": [
                "20,112",
                "-3%"
            ],
            "icons": [
                "https://willbedeletedsoon.blob.core.windows.net/test-uploads/tuborg-can.png"
            ]
        }
    },
    "rowHead2": {
        "columnHead1": {
            "content": [
                "60,112",
                "23%"
            ],
            "icons": []
        },
        "columnHead2": {
            "content": [
                "60,112",
                "23%"
            ],
            "icons": [
                "https://willbedeletedsoon.blob.core.windows.net/test-uploads/sprite-can.png",
                "https://willbedeletedsoon.blob.core.windows.net/test-uploads/tuborg-can.png"
            ]
        }
    }
}
dynamic_outputs = WhiteSpaceDetector(
    column_head_data = column_head_data,
    row_head_data = row_head_data,
    cells_data = cells_data
).json_string
"""

    def __init__(
        self,
        column_head_data=[],
        row_head_data=[],
        cells_data={},
        legends=[],
        axis_headers={},
        icons_list=[],
        actions=[],
        style_options={},
        settings={},
    ):
        super().__init__()
        self.__initialise_component_dict(
            column_head_data,
            row_head_data,
            cells_data,
            legends,
            axis_headers,
            icons_list,
            actions,
            style_options,
            settings,
        )

    def __initialise_component_dict(
        self,
        column_head_data,
        row_head_data,
        cells_data,
        legends,
        axis_headers,
        icons_list,
        actions,
        style_options,
        settings,
    ):
        try:
            if not column_head_data or not row_head_data or not cells_data:
                logging.warn("Please provide column_head_data, row_head_data and cells_data")
                self.component_dict = {}
            else:
                self.component_dict = {
                    "is_white_space_detector": True,
                    "columnHeadData": column_head_data,
                    "rowHeadData": row_head_data,
                    "cellsData": cells_data,
                    "legends": legends,
                    "axisHeaders": axis_headers,
                    "iconsList": icons_list,
                    "actions": actions,
                    "styleOptions": style_options,
                    "settings": settings,
                }
        except Exception as e:
            logging.error(f"Exception raised in WhiteSpaceDetector data constructor: {e}")
            logging.error(traceback.format_exc())
