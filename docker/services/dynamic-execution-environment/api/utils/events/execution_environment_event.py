import asyncio
from datetime import datetime

from api.utils.events import base_event


class ExecutionEnvironmentEvent(base_event.BaseEvent):
    def __init__(self):
        super().__init__()

    def create_event(self, id, type=None):
        event = {
            "event": asyncio.Event(),
            "detail": {
                "status": None,
                "message": None,
                "type": type,
                "endpoint": None,
                "created_at": datetime.now().strftime("%Y-%m-%d, %H:%M:%S"),
            },
        }
        self.events[id] = event

    def update_message(self, id: str, message: str):
        event = self.events[id]
        event["detail"]["message"] = message

    def update_status(self, id: str, status: str):
        event = self.events[id]
        event["detail"]["status"] = status

    def update_endpoint(self, id: str, endpoint: int):
        event = self.events[id]
        event["detail"]["endpoint"] = endpoint


execution_environment_event = ExecutionEnvironmentEvent()
