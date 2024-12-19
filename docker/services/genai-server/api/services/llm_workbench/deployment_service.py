from api.constants.variables import ApprovalStatus, DeploymentType
from api.daos.llm_workbench.deployment_dao import LLMDeploymentDao
from api.daos.llm_workbench.experiment_dao import LLMExperimentDao
from api.daos.llm_workbench.model_registry_dao import ModelRegistryDao
from api.dtos.llm_workbench.deployment_dto import (
    LLMDeployedModelDetailDTO,
    LLMDeployedModelDTO,
)
from api.middlewares.error_middleware import (
    AlreadyExistException,
    DoesNotExistException,
    GeneralException,
)
from fastapi import status


class LLMDeploymentService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.llm_deployment_dao = LLMDeploymentDao()
        self.model_registry_dao = ModelRegistryDao()
        self.llm_experiment_dao = LLMExperimentDao()

    def validate_llm_deployment_type(self, user, request_data):
        if "deployment_type" in request_data:
            deployment_type = self.llm_deployment_dao.get_llm_deployment_type_by_name(
                request_data.pop("deployment_type")
            )
            if not deployment_type:
                raise DoesNotExistException(
                    message="The Deployment Type does not exist.",
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            checkpoint = None
            if deployment_type.name == DeploymentType.EXPERIMENT.value:
                experiment = self.llm_experiment_dao.get_llm_experiment_by_id(request_data["experiment_id"])
                if not experiment:
                    raise DoesNotExistException(
                        message="The Experiment yuou are trying to Deploy does not exists.",
                        status_code=status.HTTP_404_NOT_FOUND,
                    )
            elif deployment_type.name == DeploymentType.CHECKPOINT.value:
                checkpoint = self.llm_experiment_dao.get_llm_experiment_checkpoint_by_name(
                    request_data["experiment_id"], request_data.pop("checkpoint_name")
                )
                if not checkpoint:
                    raise DoesNotExistException(
                        message="The Checkpoint you are trying to Deploy does not exists.",
                        status_code=status.HTTP_404_NOT_FOUND,
                    )
            request_data["deployment_type_id"] = deployment_type.id
            if checkpoint is not None:
                request_data["checkpoint_id"] = checkpoint.id
        return user, request_data

    def validate_create_llm_deployed_model(self, user, request_data):
        llm_deployed_model = self.llm_deployment_dao.get_llm_deployed_model_by_name(request_data["name"])
        if llm_deployed_model:
            raise AlreadyExistException(
                message="Deployment with the same name already exists.",
                status_code=status.HTTP_409_CONFLICT,
            )
        base_model = self.model_registry_dao.get_model_registry_by_id(request_data["base_model_id"])
        if not base_model:
            raise DoesNotExistException(
                message="The Model trying to Deploy does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        user, request_data = self.validate_llm_deployment_type(user, request_data)
        request_data["model_id"] = request_data.pop("base_model_id")
        return user, request_data

    def validate_update_llm_deployed_model(self, user, request_data):
        llm_deployed_model = self.llm_deployment_dao.get_llm_deployed_model_by_id(request_data["id"])
        if not llm_deployed_model:
            raise DoesNotExistException(
                message="The Deployment does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if llm_deployed_model.name != request_data["name"]:
            raise GeneralException(
                message="Name is not matching with record.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        user, request_data = self.validate_llm_deployment_type(user, request_data)
        return user, request_data, llm_deployed_model

    def get_paginated_llm_deployed_models(
        self, user, page, page_size, search, approval_status, problem_type, base_model_name
    ):
        # Paginated Query and Total without pagination
        (
            llm_deployed_models,
            total_available_llm_deployed_models,
        ) = self.llm_deployment_dao.get_paginated_llm_deployed_models(
            user, page, page_size, search, approval_status, problem_type, base_model_name
        )
        # Converting into DTO objects
        transformed_llm_deployed_models = [
            LLMDeployedModelDTO(llm_deployed_model) for llm_deployed_model in llm_deployed_models
        ]
        return transformed_llm_deployed_models, total_available_llm_deployed_models

    def get_llm_deployed_models(self, user, search, approval_status, problem_type, base_model_name):
        llm_deployed_models = self.llm_deployment_dao.get_llm_deployed_models(
            user, search, approval_status, problem_type, base_model_name
        )
        # Converting into DTO objects

        transformed_llm_deployed_models = [
            LLMDeployedModelDTO(llm_deployed_model) for llm_deployed_model in llm_deployed_models
        ]
        return transformed_llm_deployed_models

    def get_llm_deployed_model_by_id(self, user, id):
        llm_deployed_model = self.llm_deployment_dao.get_llm_deployed_model_by_id(id)

        if not llm_deployed_model:
            raise DoesNotExistException(
                message="The Deployment does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        transformed_llm_deployed_models = LLMDeployedModelDTO(llm_deployed_model)

        # if serialize_data:
        #     return dict(llm_deployment_serializer.LLMExperimentSerializer(**transformed_llm_deployed_model.__dict__))
        return transformed_llm_deployed_models

    def get_llm_deployed_model_detail(self, user, id):
        llm_deployed_model = self.llm_deployment_dao.get_llm_deployed_model_detail_by_id(id)

        if not llm_deployed_model:
            raise DoesNotExistException(
                message="The Deployment does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        llm_experiment_checkpoint = self.llm_deployment_dao.get_llm_experiment_checkpoint_by_llm_deployed_model_id(id)

        llm_experiment = self.llm_deployment_dao.get_llm_experiment_by_llm_deployed_model_id(id)

        transformed_llm_deployed_models = LLMDeployedModelDetailDTO(
            llm_deployed_model, llm_experiment_checkpoint, llm_experiment
        )

        # if serialize_data:
        #     return dict(llm_deployment_serializer.LLMExperimentSerializer(**transformed_llm_deployed_model.__dict__))
        return transformed_llm_deployed_models

    # Create LLMDeployedModel
    def create_llm_deployed_model(self, user, request_data, serialize_data=False):
        # Validating request_data
        user, request_data = self.validate_create_llm_deployed_model(user, request_data)
        # Call to Dao for db entry
        created_llm_deployed_model = self.llm_deployment_dao.create_llm_deployed_model(user, request_data)
        transformed_llm_deployed_model = LLMDeployedModelDTO(created_llm_deployed_model)
        # if serialize_data:
        #     return dict(llm_deployment_serializer.LLMExperimentSerializer(**transformed_llm_deployed_model.__dict__))
        return transformed_llm_deployed_model

    def approve_llm_deployed_model(self, user, request_data):
        llm_deployed_model = self.get_llm_deployed_model_detail(user, request_data["id"])

        if llm_deployed_model.approval_status != ApprovalStatus.PENDING.value:
            raise GeneralException(
                message=f"The deployement job has been processed to {llm_deployed_model.approval_status}.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        self.update_llm_deployed_model(
            user,
            {
                "id": request_data["id"],
                "name": llm_deployed_model.name,
                "status": "Created",
                "approval_status": ApprovalStatus.APPROVED.value,
                "deployment_type": llm_deployed_model.deployment_type,
                "experiment_id": llm_deployed_model.experiment.id
                if llm_deployed_model.experiment is not None
                else None,
                "checkpoint_name": llm_deployed_model.checkpoint.name
                if llm_deployed_model.checkpoint is not None
                else None,
            },
        )

        return llm_deployed_model

    def reject_llm_deployed_model(self, user, request_data):
        llm_deployed_model = self.llm_deployment_dao.get_llm_deployed_model_by_id(request_data["id"])

        if not llm_deployed_model:
            raise DoesNotExistException(
                message="The Deployment does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if llm_deployed_model.approval_status != ApprovalStatus.PENDING.value:
            raise GeneralException(
                message=f"The deployement job has been processed to {llm_deployed_model.approval_status}.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Job Update
        self.llm_deployment_dao.update_llm_deployed_model(
            user,
            llm_deployed_model,
            {
                "status": "Canceled",
                "approval_status": ApprovalStatus.REJECTED.value,
                "deployment_type": llm_deployed_model.deployment_type,
            },
        )

        # Delete Deployed Model
        return {
            "message": "Deployment rejected succesfully.",
            "status_code": status.HTTP_200_OK,
        }

        # Update LLMDeployedModel

    def update_llm_deployed_model(self, user, request_data, serialize_data=False):
        # Validating request_data
        user, request_data, llm_deployed_model = self.validate_update_llm_deployed_model(user, request_data)
        # Call to Dao for db entry
        updated_llm_deployed_model = self.llm_deployment_dao.update_llm_deployed_model(
            user, llm_deployed_model, request_data
        )
        transformed_llm_deployed_model = LLMDeployedModelDTO(updated_llm_deployed_model)
        # if serialize_data:
        #     return dict(llm_deployment_serializer.LLMExperimentSerializer(**transformed_llm_deployed_model.__dict__))
        return transformed_llm_deployed_model
