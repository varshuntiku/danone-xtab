# pylint: disable=line-too-long
"""
This module defines the abstract base class ExtractBase, which provides a structure for extracting
information from PowerPoint shapes. Subclasses should implement the abstract methods to perform
specific extraction tasks.
"""
from abc import ABC, abstractmethod


class ExtractBase(ABC):
    """
    An abstract base class for extracting information from PowerPoint shapes.

    This class defines the basic structure for extracting information from PowerPoint shapes.

    Attributes:
        SCALING_FACTOR (float): A scaling factor used to convert shape dimensions from PowerPoint units to another unit (e.g., pixels).

    Methods:
        __init__(): Initialize a new ExtractBase instance with an empty dictionary for storing shape properties.

        extract(shape): Abstract method to extract information from a specific shape. Must be implemented by subclasses.

        extract_coordinates(shape): Extract the coordinates (position and dimensions) of a shape.

    """

    SCALING_FACTOR = 0.00001

    def __init__(self):
        """
        Initialize a new ExtractBase instance.

        This constructor initializes an empty dictionary to store shape properties.

        """
        self.shape_properties = {}

    @abstractmethod
    def extract(self, shape):
        """
        Abstract method to extract information from a specific shape.

        This method should be implemented by subclasses to extract information from a specific shape.
        Args:
            shape: The PowerPoint shape to extract information from.

        Returns:
            None

        """

    def extract_coordinates(self, shape):
        """
        Extract the coordinates (position and dimensions) of a shape.

        This method calculates and returns the position (x, y) and dimensions (width, height) of a shape
        after applying a scaling factor.

        Args:
            shape: The PowerPoint shape to extract coordinates from.

        Returns:
            dict: A dictionary containing the coordinates:
                - "x": The x-coordinate of the shape's top-left corner.
                - "y": The y-coordinate of the shape's top-left corner.
                - "width": The width of the shape.
                - "height": The height of the shape.

        """

        coordinates = {}
        coordinates["x"] = int(shape.left * ExtractBase.SCALING_FACTOR)
        coordinates["y"] = int(shape.top * ExtractBase.SCALING_FACTOR)
        coordinates["width"] = int(shape.width * ExtractBase.SCALING_FACTOR)
        coordinates["height"] = int(shape.height * ExtractBase.SCALING_FACTOR)
        return coordinates
