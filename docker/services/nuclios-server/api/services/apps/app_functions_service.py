import json
from time import time
from typing import List

from api.configs.settings import AppSettings
from api.constants.apps.app_error_messages import AppErrors
from api.constants.apps.app_functions_error_messages import AppFunctionsErrors
from api.constants.apps.app_functions_success_messages import AppFunctionsSuccess
from api.daos.apps.app_dao import AppDao
from api.dtos.apps.app_function_dto import AppFunctionDTO, TestAppFunctionDTO
from api.middlewares.error_middleware import GeneralException
from api.schemas.apps.app_functions_schema import (
    AddAppFunctionRequestSchema,
    AddAppFunctionResponseSchema,
    GetAppFunctionsListResponseSchema,
    TestAppFunctionRequestSchema,
    UpdateAppFunctionResponseSchema,
)
from api.services.base_service import BaseService
from api.utils.app import app
from cryptography.fernet import Fernet
from fastapi import Request, status


class AppFunctionService(BaseService):
    def __init__(self):
        super().__init__()
        self.app_dao = AppDao(self.db_session)
        self.app_settings = AppSettings()

    def get_app_functions_list(self, app_id: int) -> List[GetAppFunctionsListResponseSchema]:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        if app_info.function_defns:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            response_app_funcs = []
            for app_func in decoded_app_funcs:
                response_app_funcs.append({"key": app_func["key"], "desc": app_func["desc"]})
            return response_app_funcs
        else:
            return []

    def add_app_functions_value(
        self, app_id: int, key: str, request_data: AddAppFunctionRequestSchema
    ) -> AddAppFunctionResponseSchema:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        if app_info.function_defns:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
        else:
            decoded_app_funcs = []

        for item in decoded_app_funcs:
            if item["key"] == key:
                raise GeneralException(
                    status.HTTP_409_CONFLICT,
                    message={"error": AppFunctionsErrors.ALREADY_EXISTS_KEY_ERROR.value},
                )
        decoded_app_funcs.append(
            {
                "key": key,
                "value": request_data.value,
                "desc": request_data.desc,
                "test": request_data.test,
            }
        )
        function_defns = fernet.encrypt(json.dumps(decoded_app_funcs).encode()).decode()
        self.app_dao.add_app_functions(function_defns, app_id)
        return {"status": "success"}

    def update_app_function_value(
        self, app_id: int, key: str, request_data: AddAppFunctionRequestSchema
    ) -> UpdateAppFunctionResponseSchema:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        if app_info.function_defns is not None:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            keys = [item["key"] for item in decoded_app_funcs]
            if key not in keys:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": AppFunctionsErrors.KEY_NOT_FOUND_ERROR.value},
                )
            func = next((func for func in decoded_app_funcs if func["key"] == key), None)
            func["value"] = request_data.value or ""
            func["desc"] = request_data.desc
            func["test"] = request_data.test
            function_defns = fernet.encrypt(json.dumps(decoded_app_funcs).encode()).decode()
            self.app_dao.add_app_functions(function_defns, app_id)
            return {"message": AppFunctionsSuccess.APP_FUNCTION_UPDATED_SUCCESS.value}
        else:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppFunctionsErrors.UPDATE_APP_FUNCTION_ERROR.value},
            )

    def delete_app_function_value(self, app_id: int, key: str) -> UpdateAppFunctionResponseSchema:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        if app_info.function_defns is not None:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            keys = [item["key"] for item in decoded_app_funcs]
            if key not in keys:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": AppFunctionsErrors.KEY_NOT_FOUND_ERROR.value},
                )
            decoded_app_funcs = [func for func in decoded_app_funcs if not (func["key"] == key)]
            function_defns = fernet.encrypt(json.dumps(decoded_app_funcs).encode()).decode()
            self.app_dao.add_app_functions(function_defns, app_id)
            return {"message": AppFunctionsSuccess.APP_FUNCTION_DELETED_SUCCESS.value}
        else:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppFunctionsErrors.DELETE_APP_FUNCTION_ERROR.value},
            )

    def get_app_function_value(self, app_id: int, key: str) -> AppFunctionDTO:
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        if app_info.function_defns is not None:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            keys = [item["key"] for item in decoded_app_funcs]
            if key not in keys:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": AppFunctionsErrors.KEY_NOT_FOUND_ERROR.value},
                )
            func = next((func for func in decoded_app_funcs if func["key"] == key), None)
            if func:
                return AppFunctionDTO(key, func)
            else:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": AppFunctionsErrors.GET_APP_FUNCTION_ERROR.value},
                )

        else:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppFunctionsErrors.GET_APP_FUNCTION_ERROR.value},
            )

    def test_app_function_value(
        self, access_token: str, app_id: int, key: str, request_data: TestAppFunctionRequestSchema, request: Request
    ) -> TestAppFunctionDTO:
        test_code = (
            request_data.test
            + """
if 'dynamic_outputs' in locals():
    code_outputs = dynamic_outputs
            """
        )
        start_time = time()
        app_info = self.app_dao.get_app_by_id(app_id)
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        if not app_info:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
            )
        new_func = {"key": key, "value": request_data.value}
        if app_info.function_defns:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode()) or []
            index = next(
                (index for (index, func) in enumerate(decoded_app_funcs) if func["key"] == key),
                None,
            )
            if index:
                decoded_app_funcs[index] = new_func
            else:
                decoded_app_funcs.append(new_func)
        else:
            decoded_app_funcs = [new_func]
        state = request.state
        file_prefix = f"test_app_function_{app_id}_{state.logged_in_email}_"
        code_string_response = app.execute_code_string(
            app_id=app_id,
            code_string=test_code,
            injected_vars={},
            access_token=access_token,
            app_functions=decoded_app_funcs,
            file_prefix=file_prefix,
        )

        end_time = time()
        code_outputs = code_string_response["code_string_output"].get("code_outputs", "")
        return TestAppFunctionDTO("success", end_time, start_time, code_outputs, code_string_response)
