from api.controllers.ml_model.model_job_controller import ModelJobController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.ml_model import model_job_schema
from api.serializers.ml_model import model_job_serializer
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
model_job_controller = ModelJobController()


@router.get(
    "/{job_id}/details",
    status_code=status.HTTP_200_OK,
    response_model=model_job_serializer.ModelJobSerializer,
)
@authenticate_user
async def get_model_job_detail(
    request: Request,
    job_id: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the base models supported by Co.dx.\n
    Will take optional query parameters as search parameter and pagination parameters\n
    If pagination parameters will created paginated response.
    Returns:
        _type_: {list of base_models and pagination detail}
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return model_job_controller.get_model_job_detail(user, {"id": job_id})


@router.post(
    "/jobs",
    status_code=status.HTTP_201_CREATED,
    response_model=model_job_serializer.ModelJobSerializer,
)
@authenticate_user
async def create_model_job(
    request: Request,
    request_data: model_job_schema.ModelJobSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Model Job.\n

    Returns: \n
        json: {Model Job}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return model_job_controller.create_model_job(user, request_data)


@router.put(
    "/jobs",
    status_code=status.HTTP_201_CREATED,
    response_model=model_job_serializer.ModelJobSerializer,
)
@authenticate_user
async def update_model_job(
    request: Request,
    request_data: model_job_schema.ModelJobUpdateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update Model Job.\n

    Returns: \n
        json: {Model Job}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return model_job_controller.update_model_job(user, request_data)


@router.get(
    "/{job_id}/status",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def get_model_job_live_status(
    request: Request,
    job_id,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will stream the live status of a job from the server.\n
    Will take url parameters as job id parameter.
    Returns:
        data: {details}
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await model_job_controller.get_live_model_job_status(user, job_id)


@router.get(
    "/{job_id}/events",
    response_model=model_job_serializer.ModelJobEventDetailSerializer,
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def get_model_job_event(
    request: Request,
    job_id: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get event related detail.
    Returns:
        data: {details}
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return model_job_controller.get_model_job_event(user, job_id)


@router.post(
    "/{job_id}/events",
    response_model=model_job_serializer.ModelJobEventSerializer,
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def create_model_job_event(
    request: Request,
    job_id: str,
    request_data: model_job_schema.ModelJobEvent,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Model Job Event.
    Returns:
        data: {details}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return model_job_controller.create_model_job_event(user, job_id, request_data)


@router.put(
    "/{job_id}/events",
    response_model=model_job_serializer.ModelJobEventSerializer,
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def update_model_job_event(
    request: Request,
    job_id: str,
    request_data: model_job_schema.ModelJobEvent,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update Model Job Event.
    Returns:
        data: {details}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return model_job_controller.update_model_job_event(user, job_id, request_data)


@router.delete(
    "/{job_id}/events",
    response_model=model_job_serializer.ModelJobEventSerializer,
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def delete_model_job_event(
    request: Request,
    job_id: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete Model Job Event.
    Returns:
        data: {details}
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return model_job_controller.delete_model_job_event(user, job_id)
