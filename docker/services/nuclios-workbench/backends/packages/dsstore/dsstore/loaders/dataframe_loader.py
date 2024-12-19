import base64
from io import StringIO

import pandas as pd
from dsstore.loaders.base_loader import BaseLoader


class DataFrameLoader(BaseLoader):
    def __init__(self):
        super().__init__()
        self.artifact_type = "dataframe"

    def load_dataframe(self, dataframe_name):
        """
        Loads a pandas DataFrame.

        Args:
            dataframe_name (str): The name of the artifact to be loaded.

        Returns:
            pd.DataFrame: The loaded DataFrame, or None if an error occurs.

        Raises:
            Exception: If there is an error while loading the DataFrame.
        """
        try:
            response = self.load_artifact(self.artifact_type, dataframe_name + ".csv")
            if response:
                artifact_data = base64.b64decode(response.json()["artifact_base64"])
                df = pd.read_csv(StringIO(artifact_data.decode("utf-8")))
                print(f"Successfully loaded dataframe: {dataframe_name}")
                return df
        except Exception as e:
            print(f"Error while loading dataframe {dataframe_name}: ", e)
            return None
