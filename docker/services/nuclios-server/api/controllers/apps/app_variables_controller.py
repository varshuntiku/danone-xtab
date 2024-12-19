from api.controllers.base_controller import BaseController
from api.schemas.apps.app_variables_schema import (
    AddAppVariableRequestSchema,
    AddAppVariableResponseSchema,
    GetAppVariableKeyResponseSchema,
    GetAppVariableValueResponseSchema,
    UpdateAppVariableResponseSchema,
)
from api.services.apps.app_variables_service import AppVariableService


class AdminController(BaseController):
    def get_app_variable_keys(self, app_id: int) -> GetAppVariableKeyResponseSchema:
        with AppVariableService() as app_variables:
            app_keys = app_variables.get_app_variable_keys(app_id)
            return app_keys

    def add_app_variables(
        self, app_id: int, key: str, request_data: AddAppVariableRequestSchema
    ) -> AddAppVariableResponseSchema:
        with AppVariableService() as app_variables:
            return app_variables.add_app_variables(app_id, key, request_data)

    def update_app_variables(
        self, app_id: int, key: str, request_data: AddAppVariableRequestSchema
    ) -> UpdateAppVariableResponseSchema:
        with AppVariableService() as app_variables:
            return app_variables.update_app_variables(app_id, key, request_data)

    def delete_app_variable_value(self, app_id: int, key: str) -> UpdateAppVariableResponseSchema:
        with AppVariableService() as app_variables:
            return app_variables.delete_app_variable_value(app_id, key)

    def get_app_variable_value(self, app_id: int, key: str) -> GetAppVariableValueResponseSchema:
        with AppVariableService() as app_variables:
            return app_variables.get_app_variable_value(app_id, key)
