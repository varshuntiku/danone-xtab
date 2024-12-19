from fastapi import APIRouter

from ...models.ml_models.models_route_schemas import CreateJobResponse
from ...utils.constants import JobStatus

# from app.databases.dependencies import get_db
# from sqlalchemy.orm import Session


def validate_user() -> dict:
    """Will be implemented in the middleware.

    Returns:
        dict: user information upon successful validation
    """
    return {}


model_router = APIRouter(prefix="/models")

# Ignore this route below. It shows how dependencies are used in FastAPI.
# TODO: Remove
# @model_router.get("/deployed-model")
# async def get_deployed_models(
#     db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
# ):
#     db
#     user_info
#     return NotImplementedError()


@model_router.get("/deployed-model")
async def get_deployed_models():
    """API will return the deployed models on Co.dx.
    Will take input as search parameters and pagination parameters
    create the models for payload and response in models folder under ml_models folder
    Returns:
        _type_: _description_
    """
    # TODO: Implement this.
    return NotImplementedError()


@model_router.get("/base-model")
async def get_base_models():
    """API will return the base models supported by Co.dx.
    Will take input as search parameters and pagination parameters
    create the models for payload and response in models folder under ml_models folder
    Returns:
        _type_: _description_
    """
    # TODO: Implement this.
    return NotImplementedError()


@model_router.get("/finetuned-model")
async def get_finetuned_models():
    """API will return the finetuned models available on Co.dx.
    Will take input as search parameters and pagination parameters
    create the models for payload and response in models folder under ml_models folder
    Returns:
        _type_: _description_
    """
    # TODO: Implement this.
    return NotImplementedError()


@model_router.post("/deployed-model")
async def create_model_deployment():
    """Allows a user with valid permissions to create a new deployment job.
    This job will deploy the selected model once it runs.
    This API will just create the job, and trigger the job using the orchestrator.

    It return the status of the Deployment Job Creation. And the Job UUID.
    A different API will be used to provide the JOB Status.

    Returns:
        reponse: CreateDeploymentJobResponse
    """
    # TODO: Implement this. Below is dummy code. but the original code should have a similar logic.
    job_created = False
    status = JobStatus.CREATED
    if status == JobStatus.CREATED:
        job_created = True
    # Call controller method and pass the job_type and other info as needed.
    return CreateJobResponse(job_created=job_created, job_uuid="The JOB ID")
    # return NotImplementedError()


@model_router.post("/finetuned-model")
async def create_finetuned_model():
    """Allows a user with valid permissions to create a model finetuning job.
    This API will create an entry in the supported models table as a finetuned model
    This API will create the finetuning job, and trigger the job using the orchestrator.

    It returns the status of the Deployment Job Creation. And the Job UUID.
    It returns the model ID of newly created model.
    A different API will be used to provide the JOB Status.

    Returns:
        reponse: CreateDeploymentJobResponse
    """
    # TODO: Implement this later.
    return CreateJobResponse(job_created=True, job_uuid="The JOB ID")


# from below we have API methods for importing Model from external sources into Co.dx Ecosystem.
# Two POST Methods are available for importing models into Co.dx.


@model_router.post("/base-model")
@model_router.post("/import-hugginface-model")
@model_router.post("/import-local-model")
async def create_base_model():
    """Allows a user with valid permissions to create a new base model import job.
    This API will create an entry in the supported models table as a base model.
    This API will just create the job, and trigger the job using the orchestrator.

    It return the status of the Deployment Job Creation. And the Job UUID.
    A different API will be used to provide the JOB Status.

    Returns:
        reponse: CreateDeploymentJobResponse
    """
    # TODO: Implement this later.
    return CreateJobResponse(job_created=True, job_uuid="The JOB ID")


# 1 Get Methods is available for exploring models available in external Sources Supported: HuggingFace.
@model_router.get("/explore-huggingface-models")
async def explore_huggingface_models():
    """An API that will call Huggingface Search API to get the available models based on the search criteria.
    Refer the HuggingsFace Folder in the project repository for more information.
    Alternatively, you can connect with Anshul and Dileep.

    Raises:
        NotImplementedError: _description_
    """
    # TODO: Implement this later.
    raise NotImplementedError()


# 1 Get Methods is available for exploring details about models available in external Sources Supported: HuggingFace.
@model_router.post("/huggingface-model-details")
async def get_hf_model_details():
    """An API that will call Huggingface Search API to get more info on the selected model.
    Information about the selected model like Size, Usage, Description will be returned.
    Refer the HuggingsFace Folder in the project repository for more information.
    Alternatively, you can connect with Anshul and Dileep.

    Raises:
        NotImplementedError: _description_
    """
    # TODO: Implement this later.
    raise NotImplementedError()
