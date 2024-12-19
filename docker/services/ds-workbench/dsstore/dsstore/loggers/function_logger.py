import base64
import inspect

from dsstore.loggers.base_logger import BaseLogger


class FunctionLogger(BaseLogger):
    def __init__(self):
        super().__init__()
        self.artifact_type = "function"

    def save_function(self, func):
        """
        Saves a Python function's source code if it has a docstring.

        Args:
            func (function): The function to be saved,name of the function will be used as the artifact name. The function must have a docstring.

        Returns:
            None

        Raises:
            ValueError: If the function does not have a docstring.
            Exception: If there is an error while saving the function.
        """
        try:
            if func.__doc__ is None:
                raise ValueError(f"The function '{func.__name__}' does not have a docstring, please add docstring")

            function_name = func.__name__

            source_code = inspect.getsource(func)
            source_code_serialised = base64.b64encode(source_code.encode("utf-8")).decode("utf-8")

            success = self.save_artifact(self.artifact_type, function_name, source_code_serialised)

            if success:
                print(f"Successfully saved function: {function_name}")
        except ValueError as ve:
            print(ve)
        except Exception as e:
            print("Error while saving function: ", e)
