import asyncio
from datetime import datetime

from api.utils.events import base_event


class LLMWorkbenchEvent(base_event.BaseEvent):
    def __init__(self):
        super().__init__()

    def create_event(self, id: str, model_type: str):
        if model_type is None:
            model_type = "Finetune"
        event = {
            "event": asyncio.Event(),
            "detail": {
                "status": None,
                "message": None,
                "type": model_type,
                "logs": None,
                "checkpoints": None,
                "is_checkpoint_evaluation_enabled": False,
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

    def update_progress(self, id: str, progress: int):
        event = self.events[id]
        event["detail"]["progress"] = progress

    def update_loss(self, id: str, loss: str):
        event = self.events[id]
        event["detail"]["loss"] = loss

    def update_elapsed_time(self, id: str, elapsed_time: str):
        event = self.events[id]
        event["detail"]["elapsed_time"] = elapsed_time

    def update_remaining_time(self, id: str, remaining_time: int):
        event = self.events[id]
        event["detail"]["remaining_time"] = remaining_time

    def update_logs(self, id: str, log: dict):
        event = self.events[id]
        event["detail"]["logs"] = log

    def update_checkpoints(self, id: str, checkpoint: dict):
        event = self.events[id]
        event["detail"]["checkpoints"] = checkpoint

    def update_is_checkpoint_evaluation_enabled(self, id: str, value: dict):
        event = self.events[id]
        event["detail"]["is_checkpoint_evaluation_enabled"] = value


llm_workbench_event = LLMWorkbenchEvent()
