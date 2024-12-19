from api.configs.settings import get_app_settings
from api.constants.variables import ApprovalStatus, JobStatus, ModelType
from api.daos.ml_model.base_model_dao import BaseModelDao
from api.daos.ml_model.finetuned_model_dao import FinetunedModelDao
from api.daos.ml_model.model_job_dao import ModelJobDao
from api.dtos.ml_model.finetuned_model_dto import FinetunedModelDTO
from api.middlewares.error_middleware import (
    AlreadyExistException,
    DoesNotExistException,
    GeneralException,
)
from api.orchestrators.handlers import finetuning_orchestrator
from api.serializers.ml_model import finetuned_model_serializer
from api.services.utils.azure.fileshare_service import (
    AzureFileShareService,
    create_local_file_reference_to_upload_file,
    delete_local_file_reference_to_upload_file,
)
from api.services.utils.ml_model.model_job_utility_service import ModelJobUtilityService
from fastapi import status

settings = get_app_settings()


class FinetunedModelUtilityService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.model_job_dao = ModelJobDao()
        self.base_model_dao = BaseModelDao()
        self.model_job_utility_service = ModelJobUtilityService()
        self.finetuned_model_dao = FinetunedModelDao()
        self.azure_file_share_service = AzureFileShareService()

    def validate_create_finetuned_model(self, user, request_data):
        finetuned_model = self.finetuned_model_dao.get_finetuned_model_by_name(
            request_data["name"], include_deleted=True
        )
        if finetuned_model:
            raise AlreadyExistException(
                message="The Finetuned Model with name already exist.",
                status_code=status.HTTP_409_CONFLICT,
            )
        parent_model = self.base_model_dao.get_base_model_by_id(request_data["parent_model_id"])
        if not parent_model:
            raise DoesNotExistException(
                message="The Parent model trying to finetune does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        if parent_model.is_finetunable is False:
            raise GeneralException(
                message="The Finetuning not available for this model.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        # if 'job_id' not in request_data or request_data['job_id'] is None:
        if request_data.get("job_id", None) is None:
            # Creating new Job in case it is not already available.
            model_job = self.model_job_utility_service.create_model_job(user, {"type": ModelType.FINETUNED.value})
        else:
            model_job = self.model_job_utility_service.get_model_job_detail(user, {"id": request_data["job_id"]})
            is_job_has_finetuned_model = self.finetuned_model_dao.get_finetuned_model_by_job_id(model_job.id)
            if is_job_has_finetuned_model:
                raise AlreadyExistException(
                    message="Given Job is already allocated to other Finetuned Model.",
                    status_code=status.HTTP_409_CONFLICT,
                )
        request_data["job_id"] = model_job.id
        parent_model = self.base_model_dao.get_base_model_by_id(request_data["parent_model_id"])
        if not parent_model:
            raise DoesNotExistException(
                message="Original Model does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return user, request_data

    # def validate_update_deployed_model(self, user, request_data):
    #     deployed_model = self.deployed_model_dao.get_deployed_model_by_id(
    #         request_data["id"]
    #     )
    #     if not deployed_model:
    #         raise DoesNotExistException(
    #             message="The Deployed Model does not exist.",
    #             status_code=status.HTTP_404_NOT_FOUND,
    #         )

    #     if deployed_model.name != request_data["name"]:
    #         raise GeneralException(
    #             message="Name can not be updated.",
    #             status_code=status.HTTP_400_BAD_REQUEST,
    #         )
    #     return user, request_data, deployed_model

    def create_directories_for_finetuned_model(self, transformed_finetuned_model):
        # Create Parent File Path
        parent_directory = self.azure_file_share_service.create_directory(
            settings.AZURE_FILE_SHARE_NAME,
            str(transformed_finetuned_model.id),
        )

        if parent_directory["status"] == "success":
            directories = [
                "repo",
                "deployments",
                "data",
                "data_backup",
                "logs",
                "adapter",
                "checkpoints",
            ]
            for folder in directories:
                # Create folder in Parent directory
                self.azure_file_share_service.create_sub_directory(
                    settings.AZURE_FILE_SHARE_NAME,
                    str(transformed_finetuned_model.id),
                    folder,
                )

    # Creat Finetuned Model
    def create_finetuned_model(self, user, request_data, serialize_data=False):
        # Validating request_data
        user, request_data = self.validate_create_finetuned_model(user, request_data)
        # Call to Dao for db entry
        created_finetuned_model = self.finetuned_model_dao.create_finetuned_model(user, request_data)
        transformed_finetuned_model = FinetunedModelDTO(created_finetuned_model)
        if serialize_data:
            return dict(finetuned_model_serializer.FinetunedModelSerializer(**transformed_finetuned_model.__dict__))

        # Create Fileshare Folders
        self.create_directories_for_finetuned_model(transformed_finetuned_model)
        return transformed_finetuned_model

    def upload_finetuned_data_set(self, user, file, request_data):
        directory_path = f"{str(request_data['finetuned_model_id'])}/data"

        file_location = f"./{file.filename}"
        # Creating Temporary File in Local.
        create_local_file_reference_to_upload_file(file, file_location)

        # Uploading File to File Share(File upload will override file on reuploading same file).
        upload_response = self.azure_file_share_service.upload_file_to_specific_path(
            settings.AZURE_FILE_SHARE_NAME,
            (
                directory_path + "/finetuning_training.csv"
                if request_data["is_validation_data"] is False
                else directory_path + "/finetuning_validation.csv"
            ),
            file_location,
        )

        # Deleting Temporary File
        delete_local_file_reference_to_upload_file(file_location)
        if upload_response["status"] == "success":
            return True
        return False

    def upload_finetuned_config(self, user, request_data):
        # Add Data to the Database
        finetune_model = self.finetuned_model_dao.get_finetuned_model_by_id(request_data["finetuned_model_id"])
        if finetune_model is None:
            raise DoesNotExistException(
                message="Finetuned Model does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        updated_finetuned_model = self.finetuned_model_dao.update_finetuned_model_config(
            user, finetune_model, request_data
        )

        # Model Job related to Finetune Model
        model_job = updated_finetuned_model.job

        # Creating Temporary File in Local.
        config_file = open("fintuning_config.json", "w", encoding="utf-8")
        config_file.write(model_job.config)
        config_file.close()

        directory_path = f"{str(updated_finetuned_model.id)}"
        file_location = "./fintuning_config.json"

        # Uploading File to File Share(File upload will override file on reuploading same file).
        upload_response = self.azure_file_share_service.upload_file_to_specific_path(
            settings.AZURE_FILE_SHARE_NAME,
            directory_path + "/finetuning_config.json",
            file_location,
        )

        # Deleting Temporary File
        delete_local_file_reference_to_upload_file(file_location)
        if upload_response["status"] == "success":
            return True
        return False

    def submit_finetuned_model(self, user, id):
        finetuned_model = self.finetuned_model_dao.get_finetuned_model_by_id(id)
        if not finetuned_model:
            raise DoesNotExistException(
                message="The Finetuned Model does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        self.finetuned_model_dao.submit_finetuned_model(user, finetuned_model)

    # Get Finetuned Model
    def get_finetuned_model_detail(self, user, id, serialize_data=False):
        finetuned_model = self.finetuned_model_dao.get_finetuned_model_by_id(id)
        if not finetuned_model:
            raise DoesNotExistException(
                message="The Finetuned Model does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        transformed_finetuned_model = FinetunedModelDTO(finetuned_model)
        if serialize_data:
            return dict(finetuned_model_serializer.FinetunedModelSerializer(**transformed_finetuned_model.__dict__))
        return transformed_finetuned_model

    def delete_finetuned_model(self, user, id, delete_from_orchestrator=False):
        finetuned_model = self.finetuned_model_dao.get_finetuned_model_by_id(id)
        job_id = finetuned_model.job.uuid
        if not finetuned_model:
            raise DoesNotExistException(
                message="The Finetuned Model does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        # Delete Finetuned Model using the Orchstrator Middleware
        if delete_from_orchestrator:
            if finetuned_model.job:
                finetuning_orchestrator.delete_finetuning_runtime(user, finetuned_model)
            else:
                raise GeneralException(
                    message="Deletion was unsuccessful.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
        # Delete finetuned Model(Database soft delete)
        self.finetuned_model_dao.delete_finetuned_model(user, finetuned_model)
        # Delete Model Job(Database soft delete)
        if delete_from_orchestrator:
            self.model_job_utility_service.delete_model_job(user, job_id)

    def reject_finetuned_model(self, user, request_data):
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
        finetuned_model = self.finetuned_model_dao.get_finetuned_model_by_id(request_data["id"])
        if finetuned_model.is_submitted is not True:
            raise GeneralException(
                message="The deployement job has not submitted properly.",
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
        self.delete_finetuned_model(user, request_data["id"])

        return {
            "message": "Deployment rejected succesfully.",
            "status_code": status.HTTP_200_OK,
            "job_id": updated_job_model.uuid,
            "deployed_model_id": request_data["job_id"],
        }
