from api.controllers.base_controller import BaseController
from api.services.dsstore.dsstore_service import DsstoreJobService


class DsstoreJobController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.executor_job_service = DsstoreJobService()

    def list_artifacts(self, user, app_id: int) -> dict:
        response = self.executor_job_service.list_artifacts(user, app_id)
        return response

    def preview_artifact(self, user, app_id: int, request_data) -> dict:
        artifact_type = request_data.get("artifact_type")
        artifact_name = request_data.get("artifact_name")
        response = self.executor_job_service.preview_artifact(user, app_id, artifact_type, artifact_name)
        return response
