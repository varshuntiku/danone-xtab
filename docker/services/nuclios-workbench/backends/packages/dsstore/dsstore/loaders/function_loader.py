import base64

from dsstore.loaders.base_loader import BaseLoader


class FunctionLoader(BaseLoader):
    def __init__(self):
        super().__init__()
        self.artifact_type = "function"

    def load_function(self, function_name):
        """
        Loads a Python function.

        Args:
            function_name (str): The name of the artifact to be loaded.

        Returns:
            function: The loaded Python function, or None if an error occurs.

        Raises:
            Exception: If there is an error while loading the function.
        """
        try:
            response = self.load_artifact(self.artifact_type, function_name + ".py")
            if response:
                artifact_data = base64.b64decode(response.json()["artifact_base64"]).decode("utf-8")
                exec(artifact_data, globals())
                func = globals().get(function_name)

                if func is None:
                    raise ValueError(f"Function '{function_name}' not found in the loaded artifact.")

                print(f"Successfully loaded function: {function_name}")
                return func
        except Exception as e:
            print(f"Error while loading function {function_name}: ", e)
            return None
