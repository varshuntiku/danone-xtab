# pylint: disable=line-too-long
"""
PowerPoint Smartart Extraction Module

This module provides a class, ExtractTable, for extracting table information.
The ExtractTable class extends the functionality of the ExtractBase class for handling table specific operations.
"""
import logging

import pandas as pd
from Loader_classes.ppt_preprocessing.ppt_extractor.extract_base import ExtractBase


class ExtractTable(ExtractBase):
    """
    A class for extracting data from tables in PowerPoint slides.

    This class extends the functionality of the ExtractBase class to focus on tables in PowerPoint slides.

    Attributes:
    - shape_properties (dict): A dictionary containing properties specific to table extraction.

    Methods:
    - _get_dataframe(shape): Private method to extract a table from a PowerPoint shape and return it as a DataFrame.
    - extract(shape): Extract and format the table content, then store it in the shape_properties dictionary.

    """

    def __init__(self):
        super().__init__()
        self.shape_properties["shape_type"] = "table"

    def _get_dataframe(self, shape):
        """
        Extract the table data from a PowerPoint shape and return it as a DataFrame.

        Args:
        - shape: The PowerPoint shape containing the table.

        Returns:
        - pandas.DataFrame: The table data represented as a DataFrame.
        """
        try:
            table_data = []
            for _, row in enumerate(shape.table.rows):
                row_data = [cell.text for cell in row.cells]
                table_data.append(row_data)
            return (
                pd.DataFrame(table_data)
                if len(table_data) == 1
                else pd.DataFrame(table_data[1:], columns=table_data[0])
            )
        except Exception as e:
            logging.warning(e)
            return pd.DataFrame()

    def extract(self, shape, **kwargs):
        """
        Extract table content from a PowerPoint shape and store it in shape_properties.

        This method extracts the table content and formats it as Markdown or plain text, depending on the availability
        of a DataFrame.

        Args:
        - shape: The PowerPoint shape representing the table.
        - **kwargs: Additional keyword arguments for extraction.
            Keyword Args:
                table_number (int): The table's identification number.

        """
        self.shape_properties.update(self.extract_coordinates(shape))
        df = self._get_dataframe(shape)
        # TODO - handle all possibilities
        if isinstance(df.columns, pd.RangeIndex):
            if df.shape == (1, 1):
                self.shape_properties["text"] = f"{df[0][0]}"
                return self.shape_properties
        else:
            self.shape_properties["text"] = f"This is a placeholder for table_{kwargs['table_number']} provided below."
            try:
                self.shape_properties["additional_text"] = f"""table_{kwargs['table_number']}:\n{df.to_markdown()}\n"""
            except Exception as e:
                logging.warning(e)
                self.shape_properties["additional_text"] = f"""table_{kwargs['table_number']}:\n{df.to_string()}\n"""
        return self.shape_properties
