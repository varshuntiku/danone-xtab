import pandas as pd
import requests
from dsstore.utils.dsstore_utils import DSStore_Utils


class ArtifactManager:
    def __init__(self):
        self.dsstore_utils = DSStore_Utils()

    def get_artifact_type(self, name):
        if name.endswith(".png"):
            return "figure"
        elif name.endswith(".csv"):
            return "dataframe"
        elif name.endswith(".py"):
            return "function"
        else:
            return "model"

    def list_all_artifacts(self):
        """
        Retrieves a list of all artifacts(Dataframes, Figures, Models).

        Returns:
            pd.DataFrame: A DataFrame with the names and types of all artifacts, or None if an error occurs.

        Raises:
            Exception: If there is an error while retrieving or processing the list of artifacts.
        """
        try:
            payload = {"project_id": self.dsstore_utils.project_id}
            response = requests.get(f"{self.dsstore_utils.dsstore_backend_uri}/list_artifacts", json=payload)
            response.raise_for_status()
            df = pd.DataFrame(response.json())
            df = df.explode("Name").reset_index(drop=True)
            df["Artifact Type"] = df["Name"].apply(self.get_artifact_type)
            df["Name"] = df["Name"].str.replace(r"\.\w+$", "", regex=True)
            return df
        except Exception as e:
            print("Error while listing artifacts: ", e)
            return False

    def list_dataframes(self):
        """
        Retrieves a list of all saved DataFrames

        Returns:
            pd.DataFrame: A DataFrame with the names of the saved DataFrames, or None if an error occurs.

        Raises:
            Exception: If there is an error while retrieving or processing the list of DataFrames.
        """
        try:
            payload = {
                "project_id": self.dsstore_utils.project_id,
                "artifact_type": "dataframe",
            }
            response = requests.get(f"{self.dsstore_utils.dsstore_backend_uri}/list_artifacts_by_type", json=payload)
            response.raise_for_status()
            df = pd.DataFrame(response.json())
            df = df.explode("Name").reset_index(drop=True).dropna()
            df["Name"] = df["Name"].str.replace(r"\.\w+$", "", regex=True)
            return df
        except Exception as e:
            print("Error while listing dataframe: ", e)
            return False

    def list_figures(self):
        """
        Retrieves a list of all saved Figures.

        Returns:
            pd.DataFrame: A DataFrame with the names of the saved Plotly Figures, or None if an error occurs.

        Raises:
            Exception: If there is an error while retrieving or processing the list of Plotly Figures.
        """
        try:
            payload = {
                "project_id": self.dsstore_utils.project_id,
                "artifact_type": "figure",
            }
            response = requests.get(f"{self.dsstore_utils.dsstore_backend_uri}/list_artifacts_by_type", json=payload)
            response.raise_for_status()
            df = pd.DataFrame(response.json())
            df = df.explode("Name").reset_index(drop=True).dropna()
            df["Name"] = df["Name"].str.replace(r"\.\w+$", "", regex=True)
            return df
        except Exception as e:
            print("Error while listing figures: ", e)
            return False

    def list_models(self):
        """
        Retrieves a list of all saved models.

        Returns:
            pd.DataFrame: A DataFrame with the names of the saved models, or None if an error occurs.

        Raises:
            Exception: If there is an error while retrieving or processing the list of models.
        """

        try:
            payload = {
                "project_id": self.dsstore_utils.project_id,
                "artifact_type": "model",
            }
            response = requests.get(f"{self.dsstore_utils.dsstore_backend_uri}/list_artifacts_by_type", json=payload)
            response.raise_for_status()
            df = pd.DataFrame(response.json())
            df = df.explode("Name").reset_index(drop=True).dropna()
            df["Name"] = df["Name"].str.replace(r"\.\w+$", "", regex=True)
            return df
        except Exception as e:
            print("Error while listing models: ", e)
            return False

    def list_functions(self):
        """
        Retrieves a list of all saved functions.

        Returns:
            pd.DataFrame: A DataFrame with the names of the saved funtions, or None if an error occurs.

        Raises:
            Exception: If there is an error while retrieving or processing the list of functions.
        """

        try:
            payload = {
                "project_id": self.dsstore_utils.project_id,
                "artifact_type": "function",
            }
            response = requests.get(f"{self.dsstore_utils.dsstore_backend_uri}/list_artifacts_by_type", json=payload)
            response.raise_for_status()
            df = pd.DataFrame(response.json())
            df = df.explode("Name").reset_index(drop=True).dropna()
            df["Name"] = df["Name"].str.replace(r"\.\w+$", "", regex=True)
            return df
        except Exception as e:
            print("Error while listing functions: ", e)
            return False
