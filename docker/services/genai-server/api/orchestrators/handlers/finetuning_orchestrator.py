import asyncio
import concurrent.futures
import logging

from api.constants.variables import ApprovalStatus, JobStatus
from api.orchestrators.executors.finetuning_executor import (
    execute_delete_finetuning_runtime,
    execute_finetuning_model,
)
from api.services.utils.ml_model.base_model_utility_service import (
    BaseModelUtilityService,
)
from api.services.utils.ml_model.finetuned_model_utility_service import (
    FinetunedModelUtilityService,
)
from api.services.utils.ml_model.model_job_utility_service import ModelJobUtilityService
from fastapi import status


async def deploy_finetuning_runtime(user, job_id, finetuned_model_id) -> dict:
    """
    Summary: Deploys a FineTuning Runtime on K8 and starts it to create a fientuned model.

    Description:
    Used for running finetuning of a supported model as specificed in the finetuning config

    Args:
    user: The user who accepts/approves the Finetuning JOB.
    job_id (int): Job ID associated with the Finetuning Model.
    supported_model_id (int): Model ID associated with the Finetuning Job. This is the base model ID which will be finetuned.

    Returns:
    acceptance (dict): A Dictionary containing information about the Creation of the Finetuning Runtime.

    """
    response = {
        "message": "Fine Tuning intialization failed.",
        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        "job_id": None,
        "finetuned_model_id": None,
    }

    model_job = ModelJobUtilityService().get_model_job_detail(user, {"id": job_id}, serialize_data=True)
    context_user = {"id": model_job["user_id"]}

    finetuned_model = FinetunedModelUtilityService().get_finetuned_model_detail(
        context_user, finetuned_model_id, serialize_data=True
    )

    base_model = BaseModelUtilityService().get_base_model_detail(
        context_user, finetuned_model["parent_model_id"], serialize_data=True
    )

    if model_job["approval_status"] == ApprovalStatus.PENDING.value:
        if finetuned_model["is_submitted"] is True:
            if model_job["status"] == JobStatus.CREATED.value:
                # Job Update
                ModelJobUtilityService().update_model_job(
                    user,
                    {"id": job_id, "approval_status": ApprovalStatus.APPROVED.value},
                    serialize_data=False,
                )

                # run the orchestration
                try:
                    # create an executor with Threadpool
                    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
                    loop = asyncio.get_event_loop()

                    # run the orchestration in a separate thread
                    loop.run_in_executor(
                        executor,
                        execute_finetuneing_model_wrapper,
                        finetuned_model,
                        base_model,
                        context_user,
                    )
                    # Sucess
                    response["message"] = "Finetuning Infra Provisioning started successfully."
                    response["status_code"] = status.HTTP_200_OK
                    response["job_id"] = str(finetuned_model["job_id"])
                    response["finetuned_model_id"] = finetuned_model["id"]
                except Exception as e:
                    logging.debug(e)
            else:
                response["message"] = "Bad request, reach out to NucliOS POC."
                response["status_code"] = status.HTTP_400_BAD_REQUEST
        else:
            response["message"] = "The deployement job has not submitted properly."
            response["status_code"] = status.HTTP_400_BAD_REQUEST
    else:
        response["message"] = f"The deployement job has already been processed to {model_job['approval_status']}."
        response["status_code"] = status.HTTP_400_BAD_REQUEST
    return response

    # finally:
    #     # Wait for the Future object to complete and get the result
    #     result = await object
    #     # Wait for the executor to complete
    #     executor.shutdown()
    #     # closing loop
    #     loop.close


def execute_finetuneing_model_wrapper(finetuned_model, base_model, context_user):
    asyncio.run(execute_finetuning_model(finetuned_model, base_model, context_user))


def delete_finetuning_runtime(user, finetuned_model):
    execute_delete_finetuning_runtime(user, finetuned_model)
