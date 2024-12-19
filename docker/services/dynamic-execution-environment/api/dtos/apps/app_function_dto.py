import json
import sys


class AppFunctionDTO:
    def __init__(self, key, app_function):
        self.key = key
        self.value = app_function["value"]
        self.test = app_function["test"]
        self.desc = app_function["desc"]


class TestAppFunctionDTO:
    def __init__(self, message, end_time, start_time, code_outputs, code_string_response):
        self.status = message
        self.timetaken = str(round((end_time - start_time), 2))
        self.size = str(sys.getsizeof(json.dumps(code_outputs)))
        self.output = code_outputs
        self.logs = code_string_response["logs"]
        self.lineno = code_string_response.get("lineno", None)
