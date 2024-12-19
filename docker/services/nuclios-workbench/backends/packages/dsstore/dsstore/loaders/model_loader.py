from io import BytesIO

import joblib
from dsstore.loaders.base_loader import BaseLoader


class ModelLoader(BaseLoader):
    def __init__(self):
        super().__init__()
        self.artifact_type = "model"

    def load_model(self, model_name):
        """
        Loads a machine learning model.

        Args:
            model_name (str): The name of the artifact to be loaded.

        Returns:
            object: The loaded machine learning model, or None if an error occurs.

        Raises:
            Exception: If there is an error while loading the model
        """
        try:
            response = self.load_artifact(self.artifact_type, model_name)
            if response.status_code == 200:
                model = joblib.load(BytesIO(response.content))
                return model
            else:
                print(f"Error while loading model {model_name}")
                return None

        except Exception as e:
            print(f"Error while loading model {model_name}: ", e)
            return None
