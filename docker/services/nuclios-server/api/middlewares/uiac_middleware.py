import ast
import json
from functools import wraps

from api.configs.settings import get_app_settings
from api.constants.error_messages import GeneralErrors
from api.helpers.uiac.uiac_validation_helper import UiacError, validate_uiac_code
from api.middlewares.error_middleware import GeneralException
from api.schemas.apps.screen_filters_schema import SaveScreenFiltersRequestSchema
from fastapi import status

settings = get_app_settings()


def validate_uiac(func):
    """
    Validates uiac imports
    """

    @wraps(func)
    async def wrapper(request, *args, **kwargs):
        try:
            request_data: SaveScreenFiltersRequestSchema = json.loads(await request.body())

            code = None

            if request_data.get("code_string", None):
                code = ast.parse(request_data.get("code_string", None))

            if request_data.get("code", None):
                code = ast.parse(request_data.get("code", None))

            if code:
                validate_uiac_code(code)

            return await func(request, *args, **kwargs)
        except UiacError as e:
            raise GeneralException(
                message={
                    "status": "failed",
                    "message": GeneralErrors.UIAC_VALIDATION_ERROR.value,
                    "errors": e.error,
                    "warnings": e.warning,
                },
                status_code=status.HTTP_200_OK,
            )

    return wrapper
