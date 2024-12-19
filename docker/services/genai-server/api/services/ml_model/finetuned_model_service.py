from api.daos.ml_model.finetuned_model_dao import FinetunedModelDao
from api.dtos.ml_model.finetuned_model_dto import FinetunedModelDTO


class FinetunedModelService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.finetuned_model_dao = FinetunedModelDao()

    def get_paginated_finetuned_models(self, user, page, page_size, search, is_pending):
        # Paginated Query and Total without pagination
        (
            ml_models,
            total_available_ml_models,
        ) = self.finetuned_model_dao.get_paginated_finetuned_models(user, page, page_size, search, is_pending)
        # Converting into DTO objects
        transformed_ml_models = [FinetunedModelDTO(ml_model) for ml_model in ml_models]
        return transformed_ml_models, total_available_ml_models

    def get_finetuned_models(self, user, search, is_pending):
        ml_models = self.finetuned_model_dao.get_finetuned_models(user, search, is_pending)
        # Converting into DTO objects
        transformed_ml_models = [FinetunedModelDTO(ml_model) for ml_model in ml_models]
        return transformed_ml_models
