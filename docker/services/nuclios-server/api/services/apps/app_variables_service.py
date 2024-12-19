import json

from api.configs.settings import AppSettings
from api.constants.apps.app_error_messages import AppErrors
from api.constants.apps.app_variable_success_messages import AppVariablesSuccess
from api.constants.apps.app_variables_error_messages import AppVariablesErrors
from api.daos.apps.app_dao import AppDao
from api.middlewares.error_middleware import GeneralException
from api.schemas.apps.app_variables_schema import (
    AddAppVariableRequestSchema,
    AddAppVariableResponseSchema,
    GetAppVariableKeyResponseSchema,
    GetAppVariableValueResponseSchema,
    UpdateAppVariableResponseSchema,
)
from api.services.base_service import BaseService
from cryptography.fernet import Fernet
from fastapi import status


class AppVariableService(BaseService):
    def __init__(self) -> None:
        super().__init__()
        self.app_dao = AppDao(self.db_session)
        self.app_settings = AppSettings()

    def get_app_variable_keys(self, app_id: int) -> GetAppVariableKeyResponseSchema:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        if app_info.variables is not None:
            decoded_app_vars = json.loads(fernet.decrypt(app_info.variables.encode()).decode())
            app_var_keys = list(decoded_app_vars.keys())
            return {"keys": app_var_keys}
        else:
            return {"keys": []}

    def add_app_variables(
        self, app_id: int, key: str, request_data: AddAppVariableRequestSchema
    ) -> AddAppVariableResponseSchema:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        decoded_app_vars = (
            json.loads(fernet.decrypt(app_info.variables.encode()).decode()) if app_info.variables is not None else {}
        )
        decoded_app_vars[key] = request_data.value
        variables = fernet.encrypt(json.dumps(decoded_app_vars).encode()).decode()
        self.app_dao.add_app_variables(variables, app_id)
        return {"status": "success"}

    def update_app_variables(
        self, app_id: int, key: str, request_data: AddAppVariableRequestSchema
    ) -> UpdateAppVariableResponseSchema:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        if app_info.variables is not None:
            decoded_app_vars = json.loads(fernet.decrypt(app_info.variables.encode()).decode())
            if key in decoded_app_vars:
                decoded_app_vars[key] = request_data.value
                variables = fernet.encrypt(json.dumps(decoded_app_vars).encode()).decode()
                self.app_dao.add_app_variables(variables, app_id)
                return {"message": AppVariablesSuccess.APP_VARIABLES_UPDATED_SUCCESS.value}
            else:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": AppVariablesErrors.UPDATE_APP_VARIABLE_ERROR.value},
                )
        else:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppVariablesErrors.UPDATE_APP_VARIABLE_ERROR.value},
            )

    def delete_app_variable_value(self, app_id: int, key: str) -> UpdateAppVariableResponseSchema:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        if app_info.variables is not None:
            decoded_app_vars = json.loads(fernet.decrypt(app_info.variables.encode()).decode())
            if key in decoded_app_vars:
                del decoded_app_vars[key]
                variables = fernet.encrypt(json.dumps(decoded_app_vars).encode()).decode()
                self.app_dao.add_app_variables(variables, app_id)
                return {"message": AppVariablesSuccess.APP_VARIABLES_DELETED_SUCCESS.value}
            else:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": AppVariablesErrors.DELETE_APP_VARIABLE_ERROR.value},
                )
        else:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppVariablesErrors.DELETE_APP_VARIABLE_ERROR.value},
            )

    def get_app_variable_value(self, app_id: int, key: str) -> GetAppVariableValueResponseSchema:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        if app_info.variables is not None:
            decoded_app_vars = json.loads(fernet.decrypt(app_info.variables.encode()).decode())
            if key in decoded_app_vars:
                return {"key": key, "value": decoded_app_vars[key]}
            else:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": AppVariablesErrors.GET_APP_VARIABLE_VALUE_ERROR.value},
                )
        else:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppVariablesErrors.GET_APP_VARIABLE_VALUE_ERROR.value},
            )
