import asyncio
from datetime import datetime


class BaseEvent:
    def __init__(self):
        self.events = {}

    def do_event_exist(self, id):
        return self.events.get(id, None) is not None

    def get_event(self, id):
        return self.events.get(id, None)

    def get_event_detail(self, id):
        event = self.events.get(id, None)
        detail = event.get("detail", None)
        if event is not None:
            detail["is_set"] = event["event"].is_set()
        return detail

    def create_event(self, id, type=None):
        event = {
            "event": asyncio.Event(),
            "detail": {
                "status": None,
                "message": None,
                "type": type,
                "created_at": datetime.now().strftime("%Y-%m-%d, %H:%M:%S"),
            },
        }
        self.events[id] = event

    def destroy_event(self, id):
        del self.events[id]

    def update_status(self, id, status):
        event = self.events[id]
        event["detail"]["status"] = status

    def update_message(self, id, message):
        event = self.events[id]
        event["detail"]["message"] = message

    def set_event(self, id):
        event = self.events.get(id)
        if event is not None:
            event["event"].set()

    def wait_event(self, id):
        event = self.events.get(id)
        event["event"].wait()
        event["detail"]["status"] = "wait"
        return event["detail"]["message"]

    def is_set(self, id):
        return self.events[id]["event"].is_set()

    async def aclear_event(self, id):
        self.events[id]["event"].clear()

    def clear_event(self, id):
        self.events[id]["event"].clear()
