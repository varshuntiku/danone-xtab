from typing import List, Union

from api.constants.ml_model.table_configuration import get_form_configuration
from api.constants.variables import ModelType
from api.controllers.ml_model.finetuned_model_controller import FinetunedModelController
from api.middlewares.auth_middleware import (
    authenticate_user,
    specific_user_required,
    super_user_required,
)
from api.schemas.ml_model import finetuned_model_schema
from api.serializers.ml_model import finetuned_model_serializer
from fastapi import APIRouter, Form, Request, Security, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
finetuned_model_controller = FinetunedModelController()


@router.get(
    "/form-configurations",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
@super_user_required
async def get_finetuned_models_form_configurations(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the form configuration for Deployed Models.\n
    Will take path parameter as table.\n
    Returns:
        json: [table configurations]
    """
    return get_form_configuration(ModelType.FINETUNED.value)


@router.get(
    "/models",
    status_code=status.HTTP_200_OK,
    response_model=Union[
        finetuned_model_serializer.PaginatedFinetunedModelSerializer,
        List[finetuned_model_serializer.FinetunedModelSerializer],
    ],
)
@authenticate_user
async def get_finetuned_models(
    request: Request,
    page: int = None,
    size: int = None,
    search: str = None,
    is_pending: bool = False,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """API will return the finetuned models available on Co.dx.
    Will take input as search parameters and pagination parameters
    create the models for payload and response in models folder under ml_models folder
    Returns:
        _type_: _description_
    """
    return finetuned_model_controller.get_finetuned_models(request.state.user, page, size, search, is_pending)


@router.post(
    "/models",
    status_code=status.HTTP_201_CREATED,
    response_model=finetuned_model_serializer.FinetunedModelSerializer,
)
@authenticate_user
@super_user_required
async def create_finetuned_model(
    request: Request,
    request_data: finetuned_model_schema.FinetunedModelSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Finetuned Model.\n

    Returns: \n
        json: {Finetuned Model}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return finetuned_model_controller.create_finetuned_model(user, request_data)


@router.post(
    "/models/upload-data-set",
    status_code=status.HTTP_201_CREATED,
    response_model=finetuned_model_serializer.FinetunedFileUploadSerializer,
)
@authenticate_user
@super_user_required
async def upload_finetuned_data_set(
    request: Request,
    file: UploadFile,
    finetuned_model_id: int = Form(...),
    is_validation_data: bool = Form(...),
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Finetuned Model.\n

    Returns: \n
        json: {Finetuned Model}
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    request_data = {
        "finetuned_model_id": finetuned_model_id,
        "is_validation_data": is_validation_data,
    }
    return finetuned_model_controller.upload_finetuned_data_set(user, file, request_data)


@router.post(
    "/models/upload-fintuning-config",
    status_code=status.HTTP_201_CREATED,
    response_model=finetuned_model_serializer.FinetunedFileUploadSerializer,
)
@authenticate_user
@super_user_required
async def upload_finetuned_config(
    request: Request,
    request_data: finetuned_model_schema.FinetunedModelConfigSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Finetuned Model.\n

    Returns: \n
        json: {Finetuned Model}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return finetuned_model_controller.upload_finetuned_config(user, request_data)


@router.post(
    "/{finetuned_model_id}",
    status_code=status.HTTP_201_CREATED,
    response_model=finetuned_model_serializer.FinetunedSubmitSerializer,
)
@authenticate_user
@super_user_required
async def submit_finetuned_model(
    request: Request,
    finetuned_model_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Finetuned Model.\n

    Returns: \n
        json: {Finetuned Model}
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return finetuned_model_controller.submit_finetuned_model(user, finetuned_model_id)


@router.patch(
    "/job",
    status_code=status.HTTP_201_CREATED,
    response_model=finetuned_model_serializer.FinetunedModelExecuteSerializer,
)
@authenticate_user
@super_user_required
@specific_user_required
async def execute_finetuned_model(
    request: Request,
    request_data: finetuned_model_schema.FinetunedModelExecuteSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to execute Finetuned Model.\n
    Execution options - approved/rejected

    Returns: \n
        json: {Finetuned Model}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await finetuned_model_controller.execute_finetuned_model(user, request_data)


@router.delete(
    "/{finetuned_model_id}",
    status_code=status.HTTP_200_OK,
    response_model=finetuned_model_serializer.FinetunedModelDeleteSerializer,
)
@authenticate_user
@super_user_required
async def delete_finetuned_model(
    request: Request,
    finetuned_model_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will delete the finetuned model.
    Returns:
        _type_: _description_
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return finetuned_model_controller.delete_finetuned_model(user, finetuned_model_id)


@router.get(
    "/{finetuned_model_id}",
    status_code=status.HTTP_200_OK,
    response_model=finetuned_model_serializer.FinetunedModelSerializer,
)
@authenticate_user
@super_user_required
async def get_finetuned_model(
    request: Request,
    finetuned_model_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will delete the finetuned model.
    Returns:
        _type_: _description_
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return finetuned_model_controller.get_finetuned_model_detail(user, finetuned_model_id)
