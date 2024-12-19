# pylint: disable=line-too-long
"""
PowerPoint Smartart Extraction Module

This module provides a class, ExtractSmartart, for extracting smartart information.
The ExtractSmartart class extends the functionality of the ExtractBase class for handling smartart specific operations.
"""
from Loader_classes.ppt_preprocessing.ppt_extractor.extract_base import ExtractBase


class ExtractSmartart(ExtractBase):
    """
    A class for extracting properties of SmartArt shapes from PowerPoint slides.

    This class inherits from ExtractBase, providing common functionality for shape extraction.

    Attributes:
        shape_properties (dict): A dictionary containing properties of the SmartArt shape.

    Methods:
        extract(shape, **kwargs):
            Extracts properties of the provided SmartArt shape.

    """

    def __init__(self):
        super().__init__()
        self.shape_properties["shape_type"] = "smartart"

    def extract(self, shape, **kwargs):
        """
        Extract properties of the SmartArt shape.

        Args:
            shape (pptx.shapes.graphfrm.GraphicalFrame): The SmartArt shape to extract properties from.
            **kwargs: Additional keyword arguments for extraction.

            Keyword Args:
                smartart_x (float): The distance of the SmartArt shape from the left edge of the slide.
                smartart_y (float): The distance of the SmartArt shape from the top edge of the slide.
                smartart_number (int): The SmartArt shape's identification number.

        Returns:
            dict: A dictionary containing properties of the SmartArt shape.
        """
        prst_geom = shape.find("a:prstGeom")
        if prst_geom:
            self.shape_properties["shape_type"] = prst_geom["prst"]
        self.shape_properties["x"] = kwargs["smartart_x"] + int(
            int(shape.find("a:xfrm").find("a:off")["x"]) * ExtractBase.SCALING_FACTOR
        )
        self.shape_properties["y"] = kwargs["smartart_y"] + int(
            int(shape.find("a:xfrm").find("a:off")["y"]) * ExtractBase.SCALING_FACTOR
        )
        self.shape_properties["width"] = int(int(shape.find("a:xfrm").find("a:ext")["cx"]) * ExtractBase.SCALING_FACTOR)
        self.shape_properties["height"] = int(
            int(shape.find("a:xfrm").find("a:ext")["cy"]) * ExtractBase.SCALING_FACTOR
        )
        self.shape_properties["smartart_number"] = kwargs["smartart_number"]
        text = ""
        text_elements = shape.find_all("a:t")
        for text_element in text_elements:
            text += text_element.get_text() + "\n"
        text = text.strip()
        self.shape_properties["text"] = text.strip()
        return self.shape_properties
