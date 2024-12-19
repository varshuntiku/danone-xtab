import asyncio
import json
import logging

from api.utils.events.execution_environment_event import execution_environment_event


class ExecutionEnvironmentEventUtilityService:
    """
    Execution Environment Event Utility Service
    """

    def __init__(self):
        self.execution_environment_event = execution_environment_event

    async def get_stream_execution_environment_status(self, user, execution_model_id):
        """
        Service to create streaming response for Experiment Status.
        Return type is "text/event-stream".
        Response format - "data: json string".
        Response data - status, progress and experiment.
        If Experiment related event is already exist and is_set then it will start streaming else it will stop streaming.
        Reference - https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#examples
        """
        response = {"status": "eoc", "message": "End of connection.", "endpoint": None}
        if self.execution_environment_event.do_event_exist(execution_model_id) is False:
            yield f"data: {json.dumps(response)}\n\n"
        else:
            # If not inside while streaming will close but the connection can be persisted from client.
            while self.execution_environment_event.is_set(execution_model_id):
                experiment_event = self.execution_environment_event.get_event_detail(execution_model_id)
                if experiment_event is not None:
                    if experiment_event["status"] is not None:
                        response["status"] = experiment_event["status"]
                        response["message"] = experiment_event["message"]
                        response["endpoint"] = experiment_event["endpoint"]
                yield f"data: {json.dumps(response)}\n\n"
                # Setting event to unset state(To stop infinite streaming).
                asyncio.create_task(self.execution_environment_event.aclear_event(execution_model_id))
                # Allowing service to have some time intervals to release load.
                await asyncio.sleep(1)
            # yield f"data: {"status": "paused", "progress": None, "experiment": None}"
            # Allowing service to have some time intervals to release load.
            await asyncio.sleep(1)

    def get_event(self, user, id):
        """
        Service to get job related event.
        """
        if self.execution_environment_event.do_event_exist(id) is False:
            return False
        return self.execution_environment_event.get_event_detail(id)

    def create_event(self, user, id, detail={}, is_set=False):
        """
        Service to create job related event.
        It has option to set event.
        """
        if self.execution_environment_event.do_event_exist(id) is False:
            try:
                # Creating Event
                self.execution_environment_event.create_event(id, detail.get("type") if "type" in detail else None)
            except Exception as e:
                logging.debug(e)
                return False
        try:
            # Adding Details
            if "message" in detail:
                self.execution_environment_event.update_message(id, detail["message"])
            if "status" in detail:
                self.execution_environment_event.update_status(id, detail["status"])
            if "endpoint" in detail:
                self.execution_environment_event.update_endpoint(id, detail["endpoint"])
            # Setting event
            if is_set:
                self.execution_environment_event.set_event(id)
            return True
        except Exception as e:
            logging.debug(e)
            return False

    def update_event(self, user, id, detail=None, is_set=None, make_wait=None):
        """
        Service to update job related event.
        It has option to set event.
        It has option to wait event.
        """
        if self.execution_environment_event.do_event_exist(id) is True:
            try:
                # Updating Event
                if "message" in detail:
                    self.execution_environment_event.update_message(id, detail["message"])
                if "status" in detail:
                    self.execution_environment_event.update_status(id, detail["status"])
                if "endpoint" in detail:
                    self.execution_environment_event.update_endpoint(id, detail["endpoint"])
                # Setting event
                if is_set is not None:
                    if is_set:
                        self.execution_environment_event.set_event(id)
                    else:
                        self.execution_environment_event.clear_event(id)
                # Handle wait
                if make_wait is not None:
                    self.execution_environment_event.wait_event(id)
                return True
            except Exception as e:
                logging.debug(e)
        return False

    def stop_event(self, user, id):
        """
        Service to stop job related event.
        """
        if self.execution_environment_event.do_event_exist(id) is True:
            try:
                # Updating Event
                self.execution_environment_event.clear_event(id)
                return True
            except Exception as e:
                logging.debug(e)
        return False

    def delete_event(self, user, id):
        """
        Service to delete job related event.
        """
        if self.execution_environment_event.do_event_exist(id) is True:
            try:
                # Updating Event
                self.execution_environment_event.destroy_event(id)
                return True
            except Exception as e:
                logging.debug(e)
        return False
