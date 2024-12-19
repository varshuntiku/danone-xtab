from api.daos.apps.app_dao import AppDao
from api.utils.dsworkbench.dsstore_utils import list_artifacts, preview_artifact


class DsstoreJobService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.app_dao = AppDao()

    def list_artifacts(self, user, app_id):
        project_id = None
        if app_id:
            app_project_mapping = self.app_dao.get_app_project_mapping(app_id)
            if app_project_mapping:
                project_id = app_project_mapping.project_id
        if project_id:
            output = list_artifacts(project_id=str(project_id))
            return {
                "results": output,
                "message": "success",
            }
        return {
            "results": [],
            "message": "App might not be associated with any project",
        }

    def preview_artifact(self, user, app_id, artifact_type, artifact_name):
        project_id = None
        if artifact_type == "model":
            return {
                "results": {
                    "message": "Model preview is not supported yet, you can directly import the model and use it"
                },
                "message": "success",
            }
        if app_id:
            app_project_mapping = self.app_dao.get_app_project_mapping(app_id)
            if app_project_mapping:
                project_id = app_project_mapping.project_id
        if project_id:
            output = preview_artifact(
                project_id=str(project_id), artifact_type=artifact_type, artifact_name=artifact_name
            )
            return {
                "results": output,
                "message": "success",
            }
        return {
            "results": {},
            "message": "App might not be associated with any project",
        }
