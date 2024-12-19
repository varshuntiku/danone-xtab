import json
import sys


class ExecJobGenericDTO:
    """
    Data Tranformation Object for the Job Model.
    """

    def __init__(self, executor_response, only_value=True):
        response = executor_response["results"][0]
        total_time_taken = executor_response["time_taken"]
        stdout = response["stdout_output"]
        stderr = response["stderr_output"]
        injected_lines_count = executor_response.get("injected_lines_count", 0)
        if injected_lines_count and "line_number" in response and response["line_number"]:
            line_number = response["line_number"]
            stderr = f"In line {line_number - injected_lines_count}: \n\n{stderr}"
        if isinstance(response["value"], str):
            value = json.loads(response["value"])
        else:
            value = response["value"] if response["value"] else {}
        if only_value:
            self.response = value
        else:
            logs = ""
            if stderr:
                logs += f"""Errors:
                {stderr}"""
            if stdout:
                logs += f"""Logs:
                {stdout}"""
            self.response = {
                "timetaken": total_time_taken,
                "logs": logs,
                "size": str(sys.getsizeof(json.dumps(value))),
                "status": "success" if not stderr else "failed",
                "output": value,
            }

    def __getitem__(self, key):
        "We will update this to return dict format."
        pass


class ExecJobDTO:
    """
    Data Tranformation Object for the Job Model.
    """

    def __init__(self, executor_response: dict, widget_id: int = 0, only_value=True):
        response = executor_response["results"][0]
        total_time_taken = executor_response["time_taken"]
        if isinstance(response["value"], str):
            value = json.loads(response["value"])
        else:
            value = response["value"] if response["value"] else {}
        stdout = response["stdout_output"]
        stderr = response["stderr_output"]
        # time_taken = response["time_taken"]
        injected_lines_count = executor_response.get("injected_lines_count", 0)
        if injected_lines_count and "line_number" in response and response["line_number"]:
            line_number = response["line_number"]
            stderr = f"In line {line_number - injected_lines_count}: \n\n{stderr}"

        data = {
            # "timetaken": total_time_taken,
            "value": value,
            # "logs": stdout if stdout else stderr,
            # "stderr": stderr,
            # "timetaken": time_taken,
        }
        if "filter_value" in executor_response and executor_response["filter_value"] == True:
            try:
                filter_response = executor_response["results"][1]
                if isinstance(filter_response["value"], str):
                    filter_value = json.loads(filter_response["value"])
                else:
                    filter_value = filter_response["value"] if filter_response["value"] else {}
                data["filter_value"] = filter_value
            except Exception as e:
                print(f"Error in filter value: {e}")
        if widget_id:
            data["widget_value_id"] = widget_id
        if only_value:
            self.response = {
                "data": data,
            }
        else:
            logs = ""
            if stderr:
                logs += f"""Errors:
                {stderr}"""
            if stdout:
                logs += f"""Logs:
                {stdout}"""
            self.response = {
                "timetaken": total_time_taken,
                "logs": logs,
                "size": str(sys.getsizeof(json.dumps(value))),
                "status": "success" if not stderr else "failed",
                "output": value,
            }

    def __getitem__(self, key):
        "We will update this to return dict format."
        pass
