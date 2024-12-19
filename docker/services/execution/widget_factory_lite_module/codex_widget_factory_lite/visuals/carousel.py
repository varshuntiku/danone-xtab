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


class Carousel(BaseConversion):
    """
      The Carousel class has the required conversion function to translate inputs
      into a JSON structure that can be rendered as a white space detector on the Co.dx UI.
      _________________________________________________________________________

      Args:
          `item_data` (list, required) : The list of objects to be used to
          get details of each element to be shown in Carousel.
          `options` (dict, required): Options is the confuguration for the Carousel.
      _________________________________________________________________________

      Attributes:
          json_string (str): This attribute generates a JSON string for the component
      _________________________________________________________________________

      Usage:
      -----
      - Sample code
      >>> import json
      >>> from codex_widget_factory_lite.visuals.carousel import Carousel
      >>> item_data = [
      {
          "sku_id": 1,
          "img": "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
          "video": "https://willbedeletedsoon.blob.core.windows.net/test-user-guides/Retail-Media-Landing-Page-Animation.mp4",
          "title": "Breakfast", "height": "400px", "width": "400px",
          "contentType": "video"
      },
      {
          "sku_id": 2,
          "img": "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
          "title": "Camera", "height": "200px", "width": "200px",
          "contentType": "image"
      },
      {
          "sku_id": 3,
          "video": "https://willbedeletedsoon.blob.core.windows.net/test-user-guides/webm_sample.webm",
          "title": "Burger", "height": "800px", "width": "500px",
          "contentType": "video"
      },
      {
          "sku_id": 4,
          "img": "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
          "title": "Coffee",
          "contentType": "image"
      },
      {
          "sku_id": 5,
          "img": "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
          "title": "Hats",
          "contentType": "image"
      },
      {
          "sku_id": 6,
          "img": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
          "title": "Honey",
          "contentType": "image"
      },
      {
          "sku_id": 7,
          "img": "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
          "title": "Basketball",
          "contentType": "image"
      },
      {
          "sku_id": 8,
          "img": "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
          "title": "Fern",
          "contentType": "image"
      },
      {
          "sku_id": 9,
          "img": "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
          "title": "Mushrooms",
          "contentType": "image"
      },
      {
          "sku_id": 10,
          "img": "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
          "title": "Tomato basil",
          "contentType": "image"
      },
      {
          "sku_id": 11,
          "img": "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
          "title": "Sea star",
          "contentType": "image"
      },
      {
          "sku_id": 12,
          "img": "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
          "title": "Bike",
          "contentType": "image"
      },
      {
          "sku_id": 13,
          "img": "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
          "title": "Basketball",
          "contentType": "image"
      },
      {
          "sku_id": 14,
          "img": "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
          "title": "Fern",
          "contentType": "image"
      },
      {
          "sku_id": 15,
          "img": "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
          "title": "Mushrooms",
          "contentType": "image"
      },
      ]
      >>> options = {
      "show": 3,
      "data_per_page": 3,
      "selection_type": "single",
      "interval": 2000,
      "direction": "column",
      "sliderMode": "horizontal",
      "viewerHeight": "80%",
      "sliderHeight": "15%",
      "viewerWidth": "100%",
      "sliderWidth": "100%",
      }

      >>> select_options = [
          {
            "id": 1,
            "label": "one",
            "value": "one"
          },
          {
            "id": 1,
            "label": "two",
            "value": "two"
          },
          {
            "id": 1,
            "label": "three",
            "value": "three"
          }
      ]

      >>> zoom_options = {
      "enable_zoom": True
      }
      >>> dynamic_outputs = Carousel(
          item_data = item_data,
          options = options
      ).json_string
      Returns:
      -------
      The `json_string` attribute returns a JSON string that is used to render the component on the UI
      _________________________________________________________________________

      The JSON structure for the component is -
      ```{
      "componentType": "custom:codxComponentCarousel",
      "inputs": {
        "itemData": [
          {
            "sku_id": 1,
            "img": "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
            "video": "https://willbedeletedsoon.blob.core.windows.net/test-user-guides/Retail-Media-Landing-Page-Animation.mp4",
            "title": "Breakfast", "height": "400px", "width": "400px",
            "contentType": "video"
          },
          {
            "sku_id": 2,
            "img": "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
            "title": "Camera", "height": "200px", "width": "200px",
            "contentType": "image"
          },
          {
            "sku_id": 3,
            "video": "https://willbedeletedsoon.blob.core.windows.net/test-user-guides/webm_sample.webm",
            "title": "Burger", "height": "800px", "width": "500px",
            "contentType": "video"
          },
          {
            "sku_id": 4,
            "img": "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
            "title": "Coffee",
             "contentType": "image"
          },
          {
            "sku_id": 5,
            "img": "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
            "title": "Hats",
             "contentType": "image"
          },
          {
            "sku_id": 6,
            "img": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
            "title": "Honey",
             "contentType": "image"
          },
          {
            "sku_id": 7,
            "img": "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
            "title": "Basketball",
             "contentType": "image"
          },
          {
            "sku_id": 8,
            "img": "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
            "title": "Fern",
             "contentType": "image"
          },
          {
            "sku_id": 9,
            "img": "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
            "title": "Mushrooms",
             "contentType": "image"
          },
          {
            "sku_id": 10,
            "img": "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
            "title": "Tomato basil",
             "contentType": "image"
          },
          {
            "sku_id": 11,
            "img": "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
            "title": "Sea star",
             "contentType": "image"
          },
          {
            "sku_id": 12,
            "img": "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
            "title": "Bike",
             "contentType": "image"
          },
          {
            "sku_id": 13,
            "img": "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
            "title": "Basketball",
             "contentType": "image"
          },
          {
            "sku_id": 14,
            "img": "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
            "title": "Fern",
             "contentType": "image"
          },
          {
            "sku_id": 15,
            "img": "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
            "title": "Mushrooms",
             "contentType": "image"
          },
        ],
        "options": {
          "show": 3,
          "data_per_page": 3,
          "selection_type": "single",
          "interval": 2000,
          "direction": "column",
          "sliderMode": "horizontal",
          "viewerHeight": "80%",
          "sliderHeight": "15%",
          "viewerWidth": "100%",
          "sliderWidth": "100%",
        },
        "selectOptions": [
          {
              "id": 1,
              "label": "one",
              "value": "one"
          },
          {
              "id": 1,
              "label": "two",
              "value": "two"
          },
          {
              "id": 1,
              "label": "three",
              "value": "three"
          }
        ],
        "enable_zoom": true
      }
    }
    ```
    """

    def __init__(self, item_data, options, select_options=None, zoom_options=None):
        super().__init__()
        self.__initialise_component_dict(item_data, options, select_options, zoom_options)

    def validate(self, item_data, options, select_options):
        validated_data = {"itemData": item_data}
        # Handling Nested Required Parameters
        if all(
            key in options
            for key in (
                "show",
                "data_per_page",
                "direction",
                "sliderMode",
                "viewerHeight",
                "viewerWidth",
                "sliderHeight",
                "sliderWidth",
            )
        ):
            validated_data["options"] = options
        else:
            logging.warn("Please provide required data in options")
            return {}

        # Handling Optional Parameters
        if select_options and len(select_options) > 0:
            validated_data["selectOptions"] = select_options

        return validated_data

    def __initialise_component_dict(self, item_data, options, select_options, zoom_options):
        try:
            validated_data = self.validate(item_data, options, select_options)

            if validated_data:
                self.component_dict = {
                    "componentType": "custom:codxComponentCarousel",
                    "inputs": validated_data,
                }

                if zoom_options and type(zoom_options) is dict:
                    for key, value in zoom_options.items():
                        self.component_dict[key] = value

        except Exception as e:
            logging.error(f"Exception raised in Carousel data constructor: {e}")
            logging.error(traceback.format_exc())
