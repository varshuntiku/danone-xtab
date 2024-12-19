import json


class ListScenarioDTO:
    def __init__(self, data):
        self.id = data.id
        self.name = data.name
        self.comment = data.description
        self.app_id = data.app_id
        self.scenarios_json = json.loads(data.scenarios_json) if data.scenarios_json else False
        self.createdAt = data.created_at.strftime("%d %B, %Y %H:%M")
        self.version = data.version
