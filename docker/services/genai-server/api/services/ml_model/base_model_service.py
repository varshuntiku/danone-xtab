from api.daos.ml_model.base_model_dao import BaseModelDao
from api.dtos.ml_model.base_model_dto import BaseModelDTO


class BaseModelService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.base_model_dao = BaseModelDao()

    def get_paginated_base_models(self, user, page, page_size, search):
        # Paginated Query and Total without pagination
        (
            ml_models,
            total_available_ml_models,
        ) = self.base_model_dao.get_paginated_base_models(user, page, page_size, search)
        # Converting into DTO objects
        transformed_ml_models = [BaseModelDTO(ml_model) for ml_model in ml_models]
        return transformed_ml_models, total_available_ml_models

    def get_base_models(self, user, search):
        ml_models = self.base_model_dao.get_base_models(user, search)
        # Converting into DTO objects
        transformed_ml_models = [BaseModelDTO(ml_model) for ml_model in ml_models]
        return transformed_ml_models
