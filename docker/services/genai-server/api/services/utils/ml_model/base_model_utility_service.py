from api.daos.ml_model.base_model_dao import BaseModelDao
from api.dtos.ml_model.base_model_dto import BaseModelDTO
from api.middlewares.error_middleware import DoesNotExistException
from api.serializers.ml_model import base_model_serializer
from fastapi import status


class BaseModelUtilityService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.base_model_dao = BaseModelDao()

    # Get Base Model
    def get_base_model_detail(self, user, id, serialize_data=False):
        base_model = self.base_model_dao.get_base_model_by_id(id)
        if not base_model:
            raise DoesNotExistException(message="The Base Model does not exist.", status_code=status.HTTP_404_NOT_FOUND)
        transformed_base_model = BaseModelDTO(base_model)
        if serialize_data:
            return dict(base_model_serializer.BaseModelSerializer(**transformed_base_model.__dict__))
        return transformed_base_model
