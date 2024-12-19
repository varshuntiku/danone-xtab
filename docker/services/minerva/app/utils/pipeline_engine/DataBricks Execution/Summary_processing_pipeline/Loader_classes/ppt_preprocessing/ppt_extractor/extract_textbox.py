# pylint: disable=line-too-long
"""
PowerPoint Textbox Extraction Module

This module provides a class, ExtractTextbox, for extracting textbox information.
The ExtractTextbox class extends the functionality of the ExtractBase class for handling textbox specific operations.
"""
from Loader_classes.ppt_preprocessing.ppt_extractor.extract_base import ExtractBase


class ExtractTextbox(ExtractBase):
    """
    This class is used for extracting text from PowerPoint textboxes.

    It inherits from ExtractBase, which provides common functionality for extracting
    information from different shapes in a PowerPoint slide.

    Attributes:
    - shape_properties (dict): A dictionary to store properties of the extracted shape.

    Methods:
    - extract(shape): Extracts text from the provided PowerPoint textbox shape.
    """

    def __init__(self):
        super().__init__()
        self.shape_properties["shape_type"] = "textbox"

    def extract(self, shape):
        """
        Extract text from a PowerPoint textbox shape.

        Args:
        - shape: A PowerPoint shape object representing a textbox.

        Returns:
        A dictionary containing properties of the extracted shape, including the extracted text.
        """

        self.shape_properties.update(self.extract_coordinates(shape))
        text = ""
        for paragraph in shape.text_frame.paragraphs:
            for run in paragraph.runs:
                text += run.text + " " + "\n"
        self.shape_properties["text"] = text.strip()
        return self.shape_properties
