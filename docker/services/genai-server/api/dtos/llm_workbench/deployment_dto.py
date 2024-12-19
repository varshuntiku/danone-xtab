from api.dtos.llm_workbench.experiment_dto import (
    LLMExperimentCheckpointDTO,
    LLMExperimentDTO,
)
from api.dtos.llm_workbench.model_registry_dto import ModelRegistryDTO


class LLMDeployedModelDTO:
    """
    Data Tranformation Object for the Deployed Model.
    """

    def __init__(self, llm_deployed_model):
        self.id = llm_deployed_model.id
        self.name = llm_deployed_model.name
        self.description = llm_deployed_model.description
        self.endpoint = llm_deployed_model.endpoint
        self.model_id = llm_deployed_model.model_id if llm_deployed_model.model_id else None
        self.model_type = llm_deployed_model.model.model_type if llm_deployed_model.model_id else None
        self.model_name = llm_deployed_model.model.name if llm_deployed_model.model_id else None
        self.source = llm_deployed_model.model.source if llm_deployed_model.model_id else None
        self.status = llm_deployed_model.status
        self.progress = llm_deployed_model.progress
        self.deployment_type = llm_deployed_model.deployment_type.name if llm_deployed_model.deployment_type else None
        self.approval_status = llm_deployed_model.approval_status
        self.is_active = llm_deployed_model.is_active
        self.created_by = str(llm_deployed_model.created_by_user.email_address)
        self.created_at = str(llm_deployed_model.created_at)


class LLMDeploymentTypeDTO:
    """
    Data Tranformation Object for the Deployment Type.
    """

    def __init__(self, llm_deployed_model_type):
        self.id = llm_deployed_model_type.id
        self.name = llm_deployed_model_type.name


class LLMDeployedModelDetailDTO:
    """
    Data Tranformation Object for the Deployed Model.
    """

    def __init__(self, llm_deployed_model, llm_experiment_checkpoint=None, llm_experiment=None):
        self.id = llm_deployed_model.id
        self.name = llm_deployed_model.name
        self.description = llm_deployed_model.description
        self.endpoint = llm_deployed_model.endpoint
        self.model_id = llm_deployed_model.model_id if llm_deployed_model.model_id else None
        self.model = ModelRegistryDTO(llm_deployed_model.model) if llm_deployed_model.model_id else None
        self.source = llm_deployed_model.model.source if llm_deployed_model.model_id else None
        self.status = llm_deployed_model.status if llm_deployed_model.status is not None else "not initialized"
        self.deployment_type = llm_deployed_model.deployment_type.name if llm_deployed_model.deployment_type else None
        self.approval_status = llm_deployed_model.approval_status
        self.progress = llm_deployed_model.progress
        self.checkpoint = (
            LLMExperimentCheckpointDTO(llm_experiment_checkpoint) if llm_experiment_checkpoint is not None else None
        )
        self.experiment = LLMExperimentDTO(llm_experiment) if llm_experiment is not None else None
        self.is_active = llm_deployed_model.is_active
        self.created_by = str(llm_deployed_model.created_by_user.email_address)
        self.created_at = str(llm_deployed_model.created_at)
