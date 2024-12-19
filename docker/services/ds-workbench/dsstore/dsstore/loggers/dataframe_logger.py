import base64
from io import StringIO

import pandas as pd
from dsstore.loggers.base_logger import BaseLogger


class DataFrameLogger(BaseLogger):
    def __init__(self):
        super().__init__()
        self.artifact_type = "dataframe"

    def save_dataframe(self, dataframe: pd.DataFrame, dataframe_name=None):
        """
        Saves a pandas DataFrame
        Args:
            dataframe (pd.DataFrame): The DataFrame to be saved.
            dataframe_name (str, optional): The name of the artifact. If not provided,
                                            a unique name will be generated.

        Returns:
            None

        Raises:
            Exception: If there is an error while saving the DataFrame.
        """
        try:
            if dataframe_name is None:
                dataframe_name = self.generate_artifact_name("dataframe")

            csv_buffer = StringIO()
            dataframe.to_csv(csv_buffer, index=False)
            dataframe_serialised = base64.b64encode(csv_buffer.getvalue().encode("utf-8")).decode("utf-8")

            success = self.save_artifact(self.artifact_type, dataframe_name, dataframe_serialised)

            if success:
                print(f"Successfully saved dataframe: {dataframe_name}")
        except Exception as e:
            print("Error while saving dataframe: ", e)
