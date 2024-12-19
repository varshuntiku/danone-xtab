import base64
import json

import plotly.graph_objects as go
from dsstore.loaders.base_loader import BaseLoader


class FigureLoader(BaseLoader):
    def __init__(self):
        super().__init__()
        self.artifact_type = "figure"

    def load_figure(self, figure_name):
        """
        Loads a Plotly figure from a base64-encoded PNG artifact.

        Args:
            figure_name (str): The name of the artifact to be loaded.

        Returns:
            go.Figure: The loaded Plotly figure, or None if an error occurs.

        Raises:
            Exception: If there is an error while loading the figure.
        """
        try:
            response = self.load_artifact(self.artifact_type, figure_name + ".png")
            if response:
                artifact_data = base64.b64decode(response.json()["artifact_base64"])
                fig = go.Figure(json.loads(artifact_data))
                print(f"Successfully loaded figure: {figure_name}")
                return fig
        except Exception as e:
            print(f"Error while loading figure: {figure_name}: ", e)
            return None
