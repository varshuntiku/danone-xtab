import asyncio
import concurrent.futures
import logging

from api.constants.variables import ApprovalStatus, JobStatus, ModelStatus
from api.orchestrators.executors.deploy_executor import (
    execute_delete_deploy_model,
    execute_deploy_model,
)
from api.services.utils.ml_model.deployed_model_utility_service import (
    DeployedModelUtilityService,
)
from api.services.utils.ml_model.model_job_utility_service import ModelJobUtilityService
from fastapi import status


async def deploy_model(user, job_id, deployed_model_id):
    """
    Summary: Deploys the model with sepcified name and config

    Description:
    Used for deploymeny of model as specificed in the model config

    Args:
    name (str): Name of the model
    model_confg (dict): Configuration object to the model

    Returns:
    acceptance: Indicates the orchestration job acceptance status

    """
    response = {
        "message": "Deployment intialization failed.",
        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        "job_id": None,
        "deployed_model_id": None,
    }

    model_job = ModelJobUtilityService().get_model_job_detail(user, {"id": job_id}, serialize_data=True)

    context_user = {"id": model_job["user_id"]}

    if model_job["approval_status"] == ApprovalStatus.PENDING.value:
        if model_job["status"] == JobStatus.CREATED.value:
            # Update the model job to approved
            deployed_model = DeployedModelUtilityService().get_deployed_model_detail(
                context_user, deployed_model_id, serialize_data=True
            )

            # Job Update
            ModelJobUtilityService().update_model_job(
                user,
                {"id": job_id, "approval_status": ApprovalStatus.APPROVED.value},
                serialize_data=False,
            )

            # run the orchestration
            if deployed_model["status"] == ModelStatus.ACTIVE.value:
                try:
                    # create an executor with Threadpool
                    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
                    loop = asyncio.get_event_loop()

                    # run the orchestration in a separate thread
                    loop.run_in_executor(
                        executor,
                        execute_deploy_model_wrapper,
                        deployed_model,
                        context_user,
                    )

                except Exception as e:
                    logging.debug(e)
            # Sucess
            response["message"] = "Deployment started successfully."
            response["status_code"] = status.HTTP_200_OK
            response["job_id"] = str(deployed_model["job_id"])
            response["deployed_model_id"] = deployed_model["id"]
        # Failed
        else:
            response["message"] = "Bad request, reach out to NucliOS POC."
            response["status_code"] = status.HTTP_400_BAD_REQUEST
    # Failed
    else:
        response["message"] = f"The deployement job has been processed to {model_job['approval_status']}."
        response["status_code"] = status.HTTP_400_BAD_REQUEST
    return response

    # finally:
    #     # Wait for the Future object to complete and get the result
    #     result = await object
    #     # Wait for the executor to complete
    #     executor.shutdown()
    #     # closing loop
    #     loop.close


def execute_deploy_model_wrapper(deployed_model, context_user):
    asyncio.run(execute_deploy_model(deployed_model, context_user))


async def deploy_inference(inference_image: str):
    """
    Summary: Deploys the base inference or the inference

    Description:
    Deploys the base inference or the inference using the base inference image

    Args:
    inference_image (str): Name of the inference image

    """
    pass


def delete_deployment(user, deployed_model):
    execute_delete_deploy_model(user, deployed_model)
