from api.configs.settings import get_app_settings
from api.constants.variables import ApprovalStatus, JobStatus, ModelType
from api.daos.ml_model.base_model_dao import BaseModelDao
from api.daos.ml_model.deployed_model_dao import DeployedModelDao
from api.daos.ml_model.model_job_dao import ModelJobDao
from api.dtos.ml_model.deployed_model_dto import DeployedModelDTO
from api.middlewares.error_middleware import (
    AlreadyExistException,
    DoesNotExistException,
    GeneralException,
)
from api.orchestrators.handlers import deployment_orchestrator
from api.schemas.ml_model import deployed_model_schema
from api.serializers.ml_model import deployed_model_serializer
from api.services.utils.azure.fileshare_service import (
    AzureFileShareService,
    delete_local_file_reference_to_upload_file,
)
from api.services.utils.ml_model.model_job_utility_service import ModelJobUtilityService
from fastapi import status

settings = get_app_settings()


class DeployedModelUtilityService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.deployed_model_dao = DeployedModelDao()
        self.base_model_dao = BaseModelDao()
        self.model_job_dao = ModelJobDao()
        self.model_job_utility_service = ModelJobUtilityService()
        self.azure_file_share_service = AzureFileShareService()

    # def get_deployed_models(self, user, search=None, serialize_data=False):
    #     deployed_models = self.deployed_model_dao.get_deployed_models(user, search)
    #     # Converting into DTO objects
    #     transformed_deployed_models = [DeployedModelDTO(deployed_model) for deployed_model in deployed_models]
    #     if serialize_data:
    #         return BaseController().get_serialized_data(deployed_model_serializer.DeployedModelSerializer, transformed_deployed_models)
    #     return transformed_deployed_models

    def validate_create_deployed_model(self, user, request_data):
        deployed_model = self.deployed_model_dao.get_deployed_model_by_name(request_data["name"], include_deleted=True)
        if deployed_model:
            raise AlreadyExistException(
                message="The Deployment with name already exist.",
                status_code=status.HTTP_409_CONFLICT,
            )
        # if 'job_id' not in request_data or request_data['job_id'] is None:
        if request_data.get("job_id", None) is None:
            # Creating new Job in case it is not already available.
            model_job = self.model_job_utility_service.create_model_job(user, {"type": ModelType.DEPLOYED.value})
        else:
            model_job = self.model_job_utility_service.get_model_job_detail(user, {"id": request_data["job_id"]})
            is_job_has_deployed_model = self.deployed_model_dao.get_deployed_model_by_job_id(model_job.id)
            if is_job_has_deployed_model:
                raise AlreadyExistException(
                    message="Given Job is already allocated to other Deployment.",
                    status_code=status.HTTP_409_CONFLICT,
                )
        request_data["job_id"] = model_job.id
        original_model = self.base_model_dao.get_base_model_by_id(request_data["original_model_id"])
        if not original_model:
            raise DoesNotExistException(
                message="Original Model does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return user, request_data

    def validate_update_deployed_model(self, user, request_data):
        deployed_model = self.deployed_model_dao.get_deployed_model_by_id(request_data["id"])
        if not deployed_model:
            raise DoesNotExistException(
                message="The Deployed Model does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if deployed_model.name != request_data["name"]:
            raise GeneralException(
                message="Name is not matching with record.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        return user, request_data, deployed_model

    # Creat Deployed Model
    def create_deployed_model(self, user, request_data, serialize_data=False):
        # Validating request_data
        user, request_data = self.validate_create_deployed_model(user, request_data)
        # Call to Dao for db entry
        created_deployed_model = self.deployed_model_dao.create_deployed_model(user, request_data)
        self.deployed_model_dao.update_task_type(user, created_deployed_model)
        self.upload_deployed_config(user, created_deployed_model)
        transformed_deployed_model = DeployedModelDTO(created_deployed_model)
        if serialize_data:
            return dict(deployed_model_serializer.DeployedModelSerializer(**transformed_deployed_model.__dict__))
        return transformed_deployed_model

    # Update Deployed Model
    def update_deployed_model(self, user, request_data, serialize_data=False, validate_schema=False):
        if validate_schema:
            request_data = dict(deployed_model_schema.DeployedModelUpdateSchema(**request_data))
        # Validating request_data
        user, request_data, deployed_model = self.validate_update_deployed_model(user, request_data)
        updated_deployed_model = self.deployed_model_dao.update_deployed_model(user, deployed_model, request_data)
        self.upload_deployed_config(user, updated_deployed_model)
        transformed_deployed_model = DeployedModelDTO(updated_deployed_model)
        if serialize_data:
            return dict(deployed_model_serializer.DeployedModelSerializer(**transformed_deployed_model.__dict__))
        return transformed_deployed_model

    def create_directories_for_deployed_model(self, deployed_model):
        # Create folder in Parent directory
        self.azure_file_share_service.create_sub_directory(
            settings.AZURE_FILE_SHARE_NAME,
            f"{str(deployed_model.original_model_id)}/deployments/",
            f"{str(deployed_model.id)}",
        )

    def upload_deployed_config(self, user, deployed_model):
        model_job = deployed_model.job
        # Creating Temporary File in Local.
        config_file = open("config.json", "w", encoding="utf-8")
        config_file.write(model_job.config)
        config_file.close()

        self.create_directories_for_deployed_model(deployed_model)

        directory_path = f"{str(deployed_model.original_model_id)}/deployments/{str(deployed_model.id)}/"
        file_location = "./config.json"

        # Uploading File to File Share(File upload will override file on reuploading same file).
        upload_response = self.azure_file_share_service.upload_file_to_specific_path(
            settings.AZURE_FILE_SHARE_NAME,
            directory_path + "deployed_model_config.json",
            file_location,
        )

        # Deleting Temporary File
        delete_local_file_reference_to_upload_file(file_location)
        if upload_response["status"] == "success":
            return True
        return False

    # Get Deployed Model
    def get_deployed_model_detail(self, user, id, serialize_data=False):
        deployed_model = self.deployed_model_dao.get_deployed_model_by_id(id)
        if not deployed_model:
            raise DoesNotExistException(
                message="The Deployement Model does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        transformed_deployed_model = DeployedModelDTO(deployed_model)
        if serialize_data:
            return dict(deployed_model_serializer.DeployedModelSerializer(**transformed_deployed_model.__dict__))
        return transformed_deployed_model

    def delete_deployed_model(self, user, id, delete_from_orchestrator=False):
        deployed_model = self.deployed_model_dao.get_deployed_model_by_id(id)
        job_id = deployed_model.job.uuid
        if not deployed_model:
            raise DoesNotExistException(
                message="The Deployement Model does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        # Delete Deployment using the Orchstrator Middleware
        if delete_from_orchestrator:
            if deployed_model.job:
                if deployed_model.job.status != JobStatus.INPROGRESS.value:
                    deployment_orchestrator.delete_deployment(user, deployed_model.__dict__)
                else:
                    raise GeneralException(
                        message="Job is in progress, we cannot delete it.",
                        status_code=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                raise GeneralException(
                    message="Deletion was unsuccessful.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
        # Delete Deployed Model
        self.deployed_model_dao.delete_deployed_model(user, deployed_model)
        # Delete Job
        if delete_from_orchestrator:
            self.model_job_utility_service.delete_model_job(user, job_id)

    def reject_deployed_model(self, user, request_data):
        # Check if the Job is pending
        model_job = self.model_job_dao.get_model_job_by_uuid(request_data["job_id"])
        if model_job is None:
            raise DoesNotExistException(
                message="The Model Job does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        if model_job.approval_status != ApprovalStatus.PENDING.value:
            raise GeneralException(
                message=f"The deployement job has been processed to {model_job.approval_status}.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Job Update
        updated_job_model = self.model_job_utility_service.update_model_job(
            user,
            {
                "id": request_data["job_id"],
                "status": JobStatus.CLOSED.value,
                "approval_status": ApprovalStatus.REJECTED.value,
            },
        )

        # Delete Deployed Model
        self.delete_deployed_model(user, request_data["id"])

        return {
            "message": "Deployment rejected succesfully.",
            "status_code": status.HTTP_200_OK,
            "job_id": updated_job_model.uuid,
            "deployed_model_id": request_data["job_id"],
        }
