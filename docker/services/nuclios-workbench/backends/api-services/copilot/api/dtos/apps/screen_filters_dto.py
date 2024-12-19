class GetScreenFiltersDTO:
    def __init__(self, code):
        self.code = code


class TestScreenFiltersDTO:
    def __init__(self, response: dict):
        self.status = "success"
        self.timetaken = response["timetaken"]
        self.size = response["size"]
        self.output = response["output"]
        self.logs = response["logs"]
        self.lineno = response["lineno"]
