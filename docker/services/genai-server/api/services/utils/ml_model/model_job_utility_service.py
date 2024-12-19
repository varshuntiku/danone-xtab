import asyncio
import json
import logging

from api.constants.variables import JobStatus
from api.daos.ml_model.model_job_dao import ModelJobDao
from api.dtos.ml_model.model_job_dto import ModelJobDTO
from api.middlewares.error_middleware import DoesNotExistException
from api.serializers.ml_model import model_job_serializer
from api.utils.events.model_job_event import model_job_status_event
from fastapi import status


class ModelJobUtilityService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.model_job_dao = ModelJobDao()

    def get_model_job_detail(self, user, request_data, serialize_data=False):
        model_job = self.model_job_dao.get_model_job_by_uuid(request_data["id"])
        if not model_job:
            raise DoesNotExistException(
                message="The Model Job does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        transformed_model_job = ModelJobDTO(model_job)
        if serialize_data:
            return dict(model_job_serializer.ModelJobSerializer(**transformed_model_job.__dict__))
        return transformed_model_job

    def create_model_job(self, user, request_data, serialize_data=False):
        created_model_job = self.model_job_dao.create_model_job(user, request_data)
        transformed_model_job = ModelJobDTO(created_model_job)
        if serialize_data:
            return dict(model_job_serializer.ModelJobSerializer(**transformed_model_job.__dict__))
        return transformed_model_job

    def update_model_job(self, user, request_data, serialize_data=False):
        model_job = self.model_job_dao.get_model_job_by_uuid(request_data["id"])
        if not model_job:
            raise DoesNotExistException(
                message="The Model Job does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        updated_model_job = self.model_job_dao.update_model_job(model_job, user, request_data)
        transformed_model_job = ModelJobDTO(updated_model_job)
        if serialize_data:
            return dict(model_job_serializer.ModelJobSerializer(**transformed_model_job.__dict__))
        return transformed_model_job

    def delete_model_job(self, user, job_id):
        model_job = self.model_job_dao.get_model_job_by_uuid(job_id)
        if not model_job:
            raise DoesNotExistException(
                message="The Model Job does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        self.model_job_dao.delete_model_job(user, model_job)
        return True


class ModelJobEventUtilityService:
    """
    Model Job Event Utility Service
    """

    def __init__(self):
        self.model_job_status_event = model_job_status_event

    async def get_stream_model_job_status(self, user, job_id):
        """
        Service to create streaming response for Job Status.
        Return type is "text/event-stream".
        Response format - "data: json string".
        Response data - status, progress and job_id.
        If job related event is already exist and is_set then it will start streaming else it will stop streaming.
        """
        response = {"status": "eoc", "progress": None, "job_id": None}
        if model_job_status_event.do_event_exist(job_id) is False:
            yield f"data: {json.dumps(response)}\n\n"
        else:
            # If not inside while streaming will close but the connection can be persisted from client.
            while model_job_status_event.is_set(job_id):
                job_status = model_job_status_event.get_event_detail(job_id)
                if job_status is not None:
                    if job_status["status"] is not None and job_status["status"] not in [
                        JobStatus.SUCCESS,
                        JobStatus.FAILED,
                    ]:
                        response["status"] = job_status["status"]
                        response["progress"] = job_status["progress"]
                        response["job_id"] = job_id
                yield f"data: {json.dumps(response)}\n\n"
                # Allowing service to have some time intervals to release load.
                await asyncio.sleep(1)
                # Setting event to unset state(To stop infinite streaming).
                asyncio.create_task(model_job_status_event.aclear_event(job_id))
            # Allowing service to have some time intervals to release load.
            await asyncio.sleep(1)

    def get_model_job_event(self, user, job_id):
        """
        Service to get job related event.
        """
        if model_job_status_event.do_event_exist(job_id) is False:
            return False
        return model_job_status_event.get_event_detail(job_id)

    def create_model_job_event(self, user, job_id, detail=None, is_set=False):
        """
        Service to create job related event.
        It has option to set event.
        """
        if model_job_status_event.do_event_exist(job_id) is False:
            try:
                # Creating Event
                model_job_status_event.create_event(job_id, detail.get("type"))
                # Adding Details
                if "message" in detail:
                    model_job_status_event.update_message(job_id, detail["message"])
                if "status" in detail:
                    model_job_status_event.update_status(job_id, detail["status"])
                if "progress" in detail:
                    model_job_status_event.update_progress(job_id, detail["progress"])
                # Setting event
                if is_set:
                    model_job_status_event.set_event(job_id)
                return True
            except Exception as e:
                logging.debug(e)
        return False

    def update_model_job_event(self, user, job_id, detail=None, is_set=None, make_wait=None):
        """
        Service to update job related event.
        It has option to set event.
        It has option to wait event.
        """
        if model_job_status_event.do_event_exist(job_id) is True:
            try:
                # Updating Event
                if "message" in detail:
                    model_job_status_event.update_message(job_id, detail["message"])
                if "status" in detail:
                    model_job_status_event.update_status(job_id, detail["status"])
                if "progress" in detail:
                    model_job_status_event.update_progress(job_id, detail["progress"])
                # Setting event
                if is_set is not None:
                    if is_set:
                        model_job_status_event.set_event(job_id)
                    else:
                        model_job_status_event.clear_event(job_id)
                # Handle wait
                if make_wait is not None:
                    model_job_status_event.wait_event(job_id)
                return True
            except Exception as e:
                logging.debug(e)
        return False

    def stop_model_job_event(self, user, job_id):
        """
        Service to stop job related event.
        """
        if model_job_status_event.do_event_exist(job_id) is True:
            try:
                # Updating Event
                model_job_status_event.clear_event(job_id)
                return True
            except Exception as e:
                logging.debug(e)
        return False

    def delete_model_job_event(self, user, job_id):
        """
        Service to delete job related event.
        """
        if model_job_status_event.do_event_exist(job_id) is True:
            try:
                # Updating Event
                model_job_status_event.destroy_event(job_id)
                return True
            except Exception as e:
                logging.debug(e)
        return False
