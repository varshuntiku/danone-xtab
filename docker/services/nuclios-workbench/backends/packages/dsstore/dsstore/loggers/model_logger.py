import base64
from io import BytesIO

import joblib
from dsstore.loggers.base_logger import BaseLogger


class ModelLogger(BaseLogger):
    def __init__(self):
        super().__init__()
        self.artifact_type = "model"

    def save_model(self, model, model_name=None):
        """
        Saves a machine learning model.

        Args:
            model: The machine learning model to be saved.
            model_name (str, optional): The name of the artifact. If not provided,
                                        a unique name will be generated.

        Returns:
            None

        Raises:
            Exception: If there is an error while saving the model.
        """
        try:
            if model_name is None:
                model_name = self.generate_artifact_name("model")

            model_buffer = BytesIO()
            joblib.dump(model, model_buffer)
            model_base64 = base64.b64encode(model_buffer.getvalue()).decode("utf-8")

            success = self.save_artifact(self.artifact_type, model_name, model_base64)

            if success:
                print(f"Successfully saved model: {model_name}")

        except Exception as e:
            print("Error while saving model: ", e)
