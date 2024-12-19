import json
from typing import List, Union

from api.controllers.llm_workbench.experiment_controller import LLMExperimentController
from api.middlewares.auth_middleware import authenticate_user, super_user_required
from api.middlewares.error_middleware import GeneralException
from api.schemas.llm_workbench import experiment_schema
from api.serializers.llm_workbench import experiment_serializer
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
llm_experiment_controller = LLMExperimentController()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=Union[
        experiment_serializer.PaginatedLLMExperimentSerializer,
        List[experiment_serializer.LLMExperimentSerializer],
    ],
)
@authenticate_user
async def get_llm_experiments(
    request: Request,
    page: int = None,
    size: int = None,
    search: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the finetuned models(Experiments) available on LLM Workbench.
    Will take input as search parameters and pagination parameters
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_experiment_controller.get_llm_experiments(user, page, size, search)


@router.get(
    "/statuses",
    status_code=status.HTTP_200_OK,
    response_model=List[experiment_serializer.LLMExperimentsStatusSerializer],
)
@authenticate_user
async def get_llm_experiments_status(
    request: Request,
    ids: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the finetuned models(Multiple Experiments) status only for listing.
    ids parameter is query parameter(Experiment IDs) which is of type string(comma separated ids)
    """
    try:
        llm_experiments = [int(x) for x in ids.split(",")]
    except Exception:
        raise GeneralException(
            message="Parameters are not valid, please check!",
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_experiment_controller.get_llm_experiments_status(user, llm_experiments)


@router.get(
    "/{id}/result",
    status_code=status.HTTP_200_OK,
    # response_model=experiment_serializer.LLMExperimentResultSerializer,
)
@authenticate_user
async def get_llm_experiment_result(
    request: Request,
    id: int = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the finetuned model{Experiment} result.
    id is query parameter(Experiment ID) which is of type of int.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_experiment_controller.get_llm_experiment_result(user, id)


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=experiment_serializer.LLMExperimentSerializer,
)
@authenticate_user
async def get_llm_experiment_detail(
    request: Request,
    id: int = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the finetuned model(Experiment) Detail.
    id is query parameter(Experiment ID) which is of type of int.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_experiment_controller.get_llm_experiment_detail(user, id)


@router.get(
    "/{id}/stream-status",
    status_code=status.HTTP_200_OK,
    response_model=experiment_serializer.LLMExperimentStreamStatusSerializer,
)
@authenticate_user
async def get_llm_experiment_live_status(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will stream the live status of a experiment from the server.\n
    Will take url parameters as experiment id parameter.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await llm_experiment_controller.get_llm_experiment_live_status(user, id)


@router.get(
    "/{id}/status",
    status_code=status.HTTP_200_OK,
    response_model=experiment_serializer.LLMExperimentStatusSerializer,
)
@authenticate_user
async def get_llm_experiment_status(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will status(including logs) of a experiment from the server.\n
    Will take url parameters as experiment id parameter.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_experiment_controller.get_llm_experiment_status(user, id)


@router.get(
    "/{id}/training_result",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def get_llm_experiment_training_result(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will status(including logs) of a experiment from the server.\n
    Will take url parameters as experiment id parameter.
    """
    user = request.state.user.__dict__
    return llm_experiment_controller.get_llm_experiment_training_result(user, id)


@router.get(
    "/{id}/checkpoints/{checkpoint_id}/train-results",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def get_llm_experiment_checkpoint_by_id(
    request: Request,
    id: int,
    checkpoint_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return status(including logs) of a experiment from the server.\n
    Will take url parameters as experiment id parameter.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_experiment_controller.get_llm_experiment_checkpoint_result(user, id, checkpoint_id)


@router.get(
    "/{id}/checkpoints/{checkpoint_name}/evaluation-result",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def get_llm_experiment_checkpoint_evaluation_result(
    request: Request,
    id: int,
    checkpoint_name: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return result of a experiment checkpoint evaluation from the server.\n
    Will take url parameters as experiment id and checkpoint name parameter.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_experiment_controller.get_llm_experiment_checkpoint_evaluation_result(user, id, checkpoint_name)


@router.get(
    "/{id}/checkpoints-evaluation-statuses",
    status_code=status.HTTP_200_OK,
    response_model=List[experiment_serializer.LLMExperimentsStatusSerializer],
)
@authenticate_user
async def get_llm_experiment_checkpoints_evaluation_status(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return status of a experiment checkpoint evaluation from the server.\n
    Will take url parameters as experiment id parameter.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_experiment_controller.get_llm_experiment_checkpoints_evaluation_status(user, id)


@router.get(
    "/{id}/stream-evaluation-status",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def get_llm_experiment_checkpoint_evaluation_live_status(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will stream the live status of a experiment from the server.\n
    Will take url parameters as experiment id parameter.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await llm_experiment_controller.get_llm_experiment_checkpoint_evaluation_live_status(user, id)


@router.delete(
    "/{id}/stop-fintuning",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def terminate_finetuning(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will stop the finetuning process
    """
    user = request.state.user.__dict__
    return llm_experiment_controller.stop_experiment_finetuning(user, id)


@router.post(
    "/validate",
    status_code=status.HTTP_200_OK,
    response_model=experiment_serializer.LLMExperimentValidateResponseSerializer,
)
@authenticate_user
async def validate_create_llm_experiment(
    request: Request,
    request_data: experiment_schema.LLMExperimentValidateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to validatrd Finetuned Model details.\n

    Returns: \n
        json: {message}
    """
    request_data = json.loads(
        json.dumps(request_data, default=lambda o: o.__dict__)
    )  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_experiment_controller.validate_llm_experiment_name(user, request_data)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=experiment_serializer.LLMExperimentCreateSerializer,
)
@authenticate_user
@super_user_required
async def create_llm_experiment(
    request: Request,
    request_data: experiment_schema.LLMExperimentCreateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Finetuned Model(Experiments).\n
    """
    request_data = json.loads(
        json.dumps(request_data, default=lambda o: o.__dict__)
    )  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await llm_experiment_controller.create_llm_experiment(user, request_data)


@router.post(
    "/{id}/checkpoints/{checkpoint_name}/evaluate",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def evaluate_experiment_checkpoint(
    request: Request,
    id: int,
    checkpoint_name: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will start Checkpoint Evaluation Process for the Experiment.\n
    Will take url parameters as experiment id and checkpoint name parameter.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await llm_experiment_controller.evaluate_experiment_checkpoint(user, id, checkpoint_name)
