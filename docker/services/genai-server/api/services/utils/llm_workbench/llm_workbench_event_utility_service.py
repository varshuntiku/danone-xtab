import asyncio
import json
import logging

from api.utils.events.llm_workbench_event import llm_workbench_event


class LLMWorkbenchEventUtilityService:
    """
    LLM Workbench Event Utility Service
    """

    def __init__(self):
        self.llm_workbench_event = llm_workbench_event

    async def get_stream_llm_experiment_status(self, user, experiment_id):
        """
        Service to create streaming response for Experiment Status.
        Return type is "text/event-stream".
        Response format - "data: json string".
        Response data - status, progress and experiment.
        If Experiment related event is already exist and is_set then it will start streaming else it will stop streaming.
        Reference - https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#examples
        """
        response = {"status": "eoc", "message": "End of connection.", "logs": [], "checkpoints": []}
        if self.llm_workbench_event.do_event_exist(experiment_id) is False:
            yield f"data: {json.dumps(response)}\n\n"
        else:
            # If not inside while streaming will close but the connection can be persisted from client.
            while self.llm_workbench_event.is_set(experiment_id):
                experiment_event = self.llm_workbench_event.get_event_detail(experiment_id)
                if experiment_event is not None:
                    if experiment_event["status"] is not None:
                        response["status"] = experiment_event["status"]
                        response["message"] = experiment_event["message"]
                        response["logs"] = experiment_event["logs"] if "logs" in experiment_event else []
                        response["checkpoints"] = (
                            experiment_event["checkpoints"] if "checkpoints" in experiment_event else []
                        )
                        response["is_checkpoint_evaluation_enabled"] = experiment_event[
                            "is_checkpoint_evaluation_enabled"
                        ]
                yield f"data: {json.dumps(response)}\n\n"
                # Setting event to unset state(To stop infinite streaming).
                asyncio.create_task(self.llm_workbench_event.aclear_event(experiment_id))
                # Allowing service to have some time intervals to release load.
                await asyncio.sleep(1)
            # yield f"data: {"status": "paused", "progress": None, "experiment": None}"
            # Allowing service to have some time intervals to release load.
            await asyncio.sleep(1)

    async def get_llm_experiment_checkpoint_evaluation_status(self, user, experiment_id):
        """
        Service to create streaming response for Experiment Status.
        Return type is "text/event-stream".
        Response format - "data: json string".
        Response data - status, progress and experiment.
        If Experiment related event is already exist and is_set then it will start streaming else it will stop streaming.
        Reference - https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#examples
        """
        response = {"checkpoints": []}
        if self.llm_workbench_event.do_event_exist(experiment_id) is False:
            yield f"data: {json.dumps(response)}\n\n"
        else:
            # If not inside while streaming will close but the connection can be persisted from client.
            while self.llm_workbench_event.is_set(experiment_id):
                experiment_event = self.llm_workbench_event.get_event_detail(experiment_id)
                if experiment_event is not None:
                    if experiment_event["status"] is not None:
                        response["checkpoints"] = (
                            experiment_event["checkpoints"] if "checkpoints" in experiment_event else []
                        )
                yield f"data: {json.dumps(response)}\n\n"
                # Setting event to unset state(To stop infinite streaming).
                asyncio.create_task(self.llm_workbench_event.aclear_event(experiment_id))
                # Allowing service to have some time intervals to release load.
                await asyncio.sleep(1)
            # yield f"data: {"status": "paused", "progress": None, "experiment": None}"
            # Allowing service to have some time intervals to release load.
            await asyncio.sleep(1)

    async def get_stream_llm_deployed_model_status(self, user, id):
        """
        Service to create streaming response for Experiment Status.
        Return type is "text/event-stream".
        Response format - "data: json string".
        Response data - status, progress and experiment.
        If Experiment related event is already exist and is_set then it will start streaming else it will stop streaming.
        Reference - https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#examples
        """
        response = {"status": "eoc", "message": "End of connection.", "progress": []}
        if self.llm_workbench_event.do_event_exist(id) is False:
            yield f"data: {json.dumps(response)}\n\n"
        else:
            # If not inside while streaming will close but the connection can be persisted from client.
            while self.llm_workbench_event.is_set(id):
                experiment_event = self.llm_workbench_event.get_event_detail(id)
                if experiment_event is not None:
                    if experiment_event["status"] is not None:
                        response["status"] = experiment_event["status"]
                        response["message"] = experiment_event["message"]
                        response["progress"] = experiment_event["progress"]
                yield f"data: {json.dumps(response)}\n\n"
                # Setting event to unset state(To stop infinite streaming).
                asyncio.create_task(self.llm_workbench_event.aclear_event(id))
                # Allowing service to have some time intervals to release load.
                await asyncio.sleep(1)
            # yield f"data: {"status": "paused", "progress": None, "experiment": None}"
            # Allowing service to have some time intervals to release load.
            await asyncio.sleep(1)

    def get_event(self, user, id):
        """
        Service to get job related event.
        """
        if self.llm_workbench_event.do_event_exist(id) is False:
            return False
        return self.llm_workbench_event.get_event_detail(id)

    def create_event(self, user, id, detail={}, is_set=False):
        """
        Service to create job related event.
        It has option to set event.
        """
        if self.llm_workbench_event.do_event_exist(id) is False:
            try:
                # Creating Event
                self.llm_workbench_event.create_event(id, detail.get("type") if "type" in detail else None)
                # Adding Details
                if "message" in detail:
                    self.llm_workbench_event.update_message(id, detail["message"])
                if "status" in detail:
                    self.llm_workbench_event.update_status(id, detail["status"])
                if "progress" in detail:
                    self.llm_workbench_event.update_progress(id, detail["progress"])
                if "logs" in detail:
                    self.llm_workbench_event.update_logs(id, detail["logs"])
                if "checkpoints" in detail:
                    self.llm_workbench_event.update_checkpoints(id, detail["checkpoints"])
                if "is_checkpoint_evaluation_enabled" in detail:
                    self.llm_workbench_event.update_is_checkpoint_evaluation_enabled(
                        id, detail["is_checkpoint_evaluation_enabled"]
                    )
                # Setting event
                if is_set:
                    self.llm_workbench_event.set_event(id)
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
        if self.llm_workbench_event.do_event_exist(id) is True:
            try:
                # Updating Event
                if "message" in detail:
                    self.llm_workbench_event.update_message(id, detail["message"])
                if "status" in detail:
                    self.llm_workbench_event.update_status(id, detail["status"])
                if "progress" in detail:
                    self.llm_workbench_event.update_progress(id, detail["progress"])
                if "logs" in detail:
                    self.llm_workbench_event.update_logs(id, detail["logs"])
                if "checkpoints" in detail:
                    self.llm_workbench_event.update_checkpoints(id, detail["checkpoints"])
                if "is_checkpoint_evaluation_enabled" in detail:
                    self.llm_workbench_event.update_is_checkpoint_evaluation_enabled(
                        id, detail["is_checkpoint_evaluation_enabled"]
                    )
                # Setting event
                if is_set is not None:
                    if is_set:
                        self.llm_workbench_event.set_event(id)
                    else:
                        self.llm_workbench_event.clear_event(id)
                # Handle wait
                if make_wait is not None:
                    self.llm_workbench_event.wait_event(id)
                return True
            except Exception as e:
                logging.debug(e)
        return False

    def stop_event(self, user, id):
        """
        Service to stop job related event.
        """
        if self.llm_workbench_event.do_event_exist(id) is True:
            try:
                # Updating Event
                self.llm_workbench_event.clear_event(id)
                return True
            except Exception as e:
                logging.debug(e)
        return False

    def delete_event(self, user, id):
        """
        Service to delete job related event.
        """
        if self.llm_workbench_event.do_event_exist(id) is True:
            try:
                # Updating Event
                self.llm_workbench_event.destroy_event(id)
                return True
            except Exception as e:
                logging.debug(e)
        return False
