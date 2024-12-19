# pylint: disable=line-too-long
"""
PowerPoint Connector Extraction Module

This module provides a class, ExtractChart, for extracting connectors information.
The ExtractConnector class extends the functionality of the ExtractBase class for handling connector-specific operations.
"""
from Loader_classes.ppt_preprocessing.ppt_extractor.extract_base import ExtractBase


class ExtractConnector(ExtractBase):
    """
    A class for extracting properties of connector shapes from a PowerPoint slide.

    This class extends ExtractBase and provides a method to extract various properties
    of a connector shape, such as coordinates and rotation.

    Attributes:
        shape_properties (dict): A dictionary to store the properties of the connector shape.

    Methods:
        extract(shape): Extracts the coordinates and rotation properties of the given connector shape.

    """

    def __init__(self):
        super().__init__()
        self.shape_properties["shape_type"] = "connector"

    def extract(self, shape):
        """
        Extracts the coordinates and rotation properties of a connector shape.

        Args:
            shape (PowerPoint shape object): The connector shape to extract properties from.

        Returns:
            dict: A dictionary containing the extracted properties of the connector shape,
                  including 'begin_x', 'begin_y', 'end_x', 'end_y', and 'rotation'.
        """
        self.shape_properties.update(self.extract_coordinates(shape))
        self.shape_properties["begin_x"] = int(shape.begin_x * ExtractBase.SCALING_FACTOR)
        self.shape_properties["begin_y"] = int(shape.begin_y * ExtractBase.SCALING_FACTOR)
        self.shape_properties["end_x"] = int(shape.end_x * ExtractBase.SCALING_FACTOR)
        self.shape_properties["end_y"] = int(shape.end_y * ExtractBase.SCALING_FACTOR)
        self.shape_properties["rotation"] = int(shape.rotation)
        return self.shape_properties
