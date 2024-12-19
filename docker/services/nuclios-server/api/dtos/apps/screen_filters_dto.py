import json


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


class ArchivedFilterUIACListDTO:
    """
    DTO to return archived filter UIAC list
    """

    def __init__(self, record, type):
        self.id = record.id
        self.filter_value = json.loads(record.screen_filters_value)
        self.screen_title = record.screen_name
        self.is_deleted_screen = True if record.deleted_at else False
        self.type = type
