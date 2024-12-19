# pylint: disable=line-too-long
"""
PowerPoint Smartart Boundary Extraction Module

This module provides a class, ExtractSmartartBoundary, for extracting smartart boundary information.
The ExtractSmartartBoundary class extends the functionality of the ExtractBase class for handling smartart boundary specific operations.
"""
from Loader_classes.ppt_preprocessing.ppt_extractor.extract_base import ExtractBase


class ExtractSmartartBoundary(ExtractBase):
    """
    Extracts information about SmartArt boundaries from a PowerPoint slide.

    This class inherits from ExtractBase and provides specific methods for extracting
    SmartArt boundary properties.

    Attributes:
        shape_properties (dict): A dictionary containing properties of the SmartArt boundary.

    Methods:
        extract(shape):
        Extracts the coordinates of the SmartArt boundary shape.

    """

    def __init__(self):
        super().__init__()
        self.shape_properties["shape_type"] = "smartart_boundary"

    def extract(self, shape):
        """
        Extracts the coordinates and properties of a SmartArt boundary shape.

        Args:
            shape (pptx.shapes.base.BaseShape): The SmartArt boundary shape to extract.

        Returns:
            dict: A dictionary containing the extracted properties of the SmartArt boundary.
        """
        self.shape_properties.update(self.extract_coordinates(shape))
        return self.shape_properties
