import base64

import plotly.graph_objs as go
from dsstore.loggers.base_logger import BaseLogger


class FigureLogger(BaseLogger):
    def __init__(self):
        super().__init__()
        self.artifact_type = "figure"

    def save_figure(self, fig: go.Figure, figure_name=None):
        """
        Saves a plotly graph.

        Args:
            fig (go.Figure): The Figure to be saved.
            figure_name (str, optional): The name of the artifact. If not provided,
                                            a unique name will be generated.

        Returns:
            None

        Raises:
            Exception: If there is an error while saving the Figure.
        """
        try:
            if figure_name is None:
                figure_name = self.generate_artifact_name("figure")

            fig_json = fig.to_json()
            figure_serialised = base64.b64encode(fig_json.encode()).decode("utf-8")

            success = self.save_artifact(self.artifact_type, figure_name, figure_serialised)
            if success:
                print(f"Successfully saved figure: {figure_name}")

        except Exception as e:
            print("Error while saving figure: ", e)
