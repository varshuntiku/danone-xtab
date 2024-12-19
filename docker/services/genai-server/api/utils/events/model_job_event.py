from api.constants.variables import ModelType
from api.utils.events import base_event


class ModelJobStatusEvent(base_event.BaseEvent):
    def __init__(self):
        super().__init__()

    def create_event(self, id: str, model_type: str):
        if model_type is None:
            model_type = ModelType.DEPLOYED.value
        super().create_event(id, model_type)

    def update_message(self, id: str, message: str):
        event = self.events[id]
        event["detail"]["message"] = message

    def update_status(self, id: str, status: str):
        event = self.events[id]
        event["detail"]["status"] = status

    def update_progress(self, id: str, progress: int):
        event = self.events[id]
        event["detail"]["progress"] = progress


model_job_status_event = ModelJobStatusEvent()
