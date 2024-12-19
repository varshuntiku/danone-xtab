# from api.daos.ml_model.ml_model_dao import MLModelDao
from api.constants.ml_model.table_configuration import get_table_configuration
from api.constants.variables import ModelType
from api.middlewares.error_middleware import DoesNotExistException
from fastapi import status


class ConfigurationService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        # self.ml_model_dao = MLModelDao()
        pass

    def get_table_configurations(self, user, table_name):
        values = [member.value for member in ModelType]
        if table_name not in values:
            raise DoesNotExistException(
                message="Given table_name does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        table_configuration = get_table_configuration(table_name)
        return table_configuration
