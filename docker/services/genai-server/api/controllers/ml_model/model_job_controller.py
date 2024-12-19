from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import (
    AlreadyExistException,
    DoesNotExistException,
    GeneralException,
)
from api.serializers.ml_model import model_job_serializer
from api.services.ml_model.model_job_service import ModelJobService
from api.services.utils.ml_model.model_job_utility_service import (
    ModelJobEventUtilityService,
    ModelJobUtilityService,
)
from fastapi import status
from fastapi.responses import StreamingResponse


class ModelJobController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.model_job_service = ModelJobService()
        self.model_job_utility_service = ModelJobUtilityService()
        self.model_job_event_utility_service = ModelJobEventUtilityService()

    def get_model_job_detail(self, user, request_data) -> dict:
        model_job = self.model_job_utility_service.get_model_job_detail(user, request_data)
        return self.get_serialized_data(model_job_serializer.ModelJobSerializer, model_job)

    def create_model_job(self, user, request_data) -> dict:
        model_job = self.model_job_utility_service.create_model_job(user, request_data)
        return self.get_serialized_data(model_job_serializer.ModelJobSerializer, model_job)

    def update_model_job(self, user, request_data) -> dict:
        model_job = self.model_job_utility_service.update_model_job(user, request_data)
        return self.get_serialized_data(model_job_serializer.ModelJobSerializer, model_job)

    async def get_live_model_job_status(self, user, job_id):
        return StreamingResponse(
            self.model_job_event_utility_service.get_stream_model_job_status(user, job_id),
            media_type="text/event-stream",
        )

    def get_model_job_event(self, user, job_id) -> dict:
        model_job_event = self.model_job_event_utility_service.get_model_job_event(user, job_id)
        if model_job_event is False:
            raise DoesNotExistException(
                message="Event for the given Job does not exist.", status_code=status.HTTP_404_NOT_FOUND
            )
        return model_job_serializer.ModelJobEventDetailSerializer(**model_job_event)

    def create_model_job_event(self, user, job_id, request_data) -> dict:
        is_event_exist = self.model_job_event_utility_service.get_model_job_event(user, job_id)
        if is_event_exist:
            raise AlreadyExistException(
                message="Event for the given Job is already exist.", status_code=status.HTTP_409_CONFLICT
            )
        model_job_event = self.model_job_event_utility_service.create_model_job_event(
            user, job_id, detail=request_data, is_set=request_data["is_set"]
        )
        if model_job_event is False:
            raise GeneralException(
                message="Failed to create new Event.", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return {"message": "Event is created successfully.", "status_code": status.HTTP_201_CREATED}

    def update_model_job_event(self, user, job_id, request_data) -> dict:
        is_event_exist = self.model_job_event_utility_service.get_model_job_event(user, job_id)
        if is_event_exist is False:
            raise DoesNotExistException(
                message="Event with given Job does not exist.", status_code=status.HTTP_404_NOT_FOUND
            )
        model_job_event = self.model_job_event_utility_service.update_model_job_event(
            user, job_id, detail=request_data, is_set=request_data["is_set"], make_wait=request_data["make_wait"]
        )
        if model_job_event is False:
            raise GeneralException(
                message="Failed to update existing Event.", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return {"message": "Event is updated successfully.", "status_code": status.HTTP_200_OK}

    def delete_model_job_event(self, user, job_id):
        is_event_exist = self.model_job_event_utility_service.get_model_job_event(user, job_id)
        if is_event_exist is False:
            raise DoesNotExistException(
                message="Event with given Job does not exist.", status_code=status.HTTP_404_NOT_FOUND
            )
        is_event_deleted = self.model_job_event_utility_service.delete_model_job_event(user, job_id)
        if is_event_deleted is False:
            raise GeneralException(
                message="Failed to delete existing Event.", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return {"message": "Event is deleted successfully.", "status_code": status.HTTP_204_NO_CONTENT}
