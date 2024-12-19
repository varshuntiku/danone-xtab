from api.constants.ml_model.table_configuration import get_form_configuration
from api.constants.variables import ModelType
from api.daos.ml_model.deployed_model_dao import DeployedModelDao
from api.dtos.ml_model.deployed_model_dto import DeployedModelDTO
from api.middlewares.error_middleware import AlreadyExistException
from fastapi import status


class DeployedModelService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.deployed_model_dao = DeployedModelDao()

    def get_deployed_models_form_configurations(self, user):
        form_configuration = get_form_configuration(ModelType.DEPLOYED.value)
        return form_configuration

    def get_paginated_deployed_models(self, user, page, page_size, search, is_pending):
        # Paginated Query and Total without pagination
        (
            ml_models,
            total_available_ml_models,
        ) = self.deployed_model_dao.get_paginated_deployed_models(user, page, page_size, search, is_pending)
        # Converting into DTO objects
        transformed_ml_models = [DeployedModelDTO(ml_model) for ml_model in ml_models]
        return transformed_ml_models, total_available_ml_models

    def get_deployed_models(self, user, search, is_pending):
        ml_models = self.deployed_model_dao.get_deployed_models(user, search, is_pending)
        # Converting into DTO objects
        transformed_ml_models = [DeployedModelDTO(ml_model) for ml_model in ml_models]
        return transformed_ml_models

    def validate_deployed_model_form(self, user, request_data):
        deployed_model = self.deployed_model_dao.get_deployed_model_by_name(request_data["name"])
        if deployed_model:
            raise AlreadyExistException(
                message="The Deployment with name already exist.", status_code=status.HTTP_409_CONFLICT
            )
        return True

    # def create_deployed_model(self, user, request_data):
    #     deployed_model = self.deployed_model_dao.get_deployed_model_by_name(request_data['name'])
    #     if deployed_model:
    #         raise AlreadyExistException(message="The Deployment with name already exist.", status_code=status.HTTP_409_CONFLICT)
    #     if 'job_id' not in request_data or request_data['job_id'] is None:
    #         # Creating new Job in case it is not already available.
    #         request_data['job_id'] = self.create_model_job(user, {'type': ModelType.DEPLOYED.value})
    #     created_deployed_model = self.deployed_model_dao.create_deployed_model(user, request_data)
    #     transformed_deployed_model = DeployedModelDTO(created_deployed_model)
    #     return transformed_deployed_model

    # def update_deployed_model(self, user, request_data):
    #     deployed_model = self.deployed_model_dao.get_deployed_model_by_id(request_data['id'])
    #     if not deployed_model:
    #         raise DoesNotExistException(message="The Deployed Model does not exist.", status_code=status.HTTP_404_NOT_FOUND)

    #     if deployed_model.name != request_data['name']:
    #         raise GeneralException(message="Name can not be updated.", status_code=status.HTTP_400_BAD_REQUEST)

    #     updated_deployed_model = self.deployed_model_dao.update_deployed_model(deployed_model, user, request_data)
    #     transformed_deployed_model = DeployedModelDTO(updated_deployed_model)
    #     return transformed_deployed_model

    # def get_deployed_model_detail(self, user, id):
    #     deployed_model = self.deployed_model_dao.get_deployed_model_by_id(id)
    #     if not deployed_model:
    #         raise DoesNotExistException(message="The Deployement Model does not exist.", status_code=status.HTTP_404_NOT_FOUND)
    #     transformed_deployed_model = DeployedModelDTO(deployed_model)
    #     return transformed_deployed_model
