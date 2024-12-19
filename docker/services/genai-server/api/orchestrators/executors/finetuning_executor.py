import asyncio
import logging

from api.configs.settings import get_app_settings
from api.constants.variables import JobStatus
from api.services.utils.ml_model.model_job_utility_service import (
    ModelJobEventUtilityService,
    ModelJobUtilityService,
)
from infra_manager import initialize
from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.deployment_manager.deployment import Deployment
from infra_manager.utils.deployment_utils import generate_deployment_spec
from infra_manager.utils.pvc_utils import generate_volume_mounts_and_volumes

app_settings = get_app_settings()
cloud_settings = {
    "AD_CLIENT_ID": app_settings.AD_CLIENT_ID,
    "AD_CLIENT_SECRET": app_settings.AD_CLIENT_SECRET,
    "TENANT_ID": app_settings.TENANT_ID,
    "RESOURCE_GROUP": app_settings.RESOURCE_GROUP,
    "CLUSTER_NAME": app_settings.CLUSTER_NAME,
    "SUBSCRIPTION_ID": app_settings.SUBSCRIPTION_ID,
}


async def execute_finetuning_model(finetuned_model, base_model, user):
    """
    Summary: Deploys the model with sepcified name and config

    Description:
    Used for deploymeny of model as specificed in the model config

    Returns:
    acceptance: Indicates the orchestration job acceptance status

    """
    # Segregating Variable to be used:
    job_utility_service = ModelJobUtilityService()
    job_id = str(finetuned_model["job_id"])
    current_event_data = {
        "progress": 0,
        "message": "Job Created",
        "status": JobStatus.CREATED.value,
    }
    handle_event(
        current_event_data,
        5,
        "Job Created",
        JobStatus.CREATED.value,
        job_utility_service,
        job_id,
        user,
    )
    try:
        # Step 1: Initialize kube config
        initialize(
            is_cloud=True,
            cloud_provider="azure",
            cloud_settings=cloud_settings,
        )

        # Get the kube connection
        kube_connection = KubeConnection()
        handle_event(
            current_event_data,
            7,
            "Connection Intialized",
            JobStatus.INPROGRESS.value,
            job_utility_service,
            job_id,
            user,
        )

        # STEP 2: Instantiate Deployment Manager
        deployment_manager = Deployment(kube_connection)

        # Generate Volume Mount Specification
        volume_mount_spec = [
            {
                "volume_name": "azure",
                "mount_path": "/base",
                "sub_path": str(base_model.get("id")) + "/",
            },
            {
                "volume_name": "azure",
                "mount_path": "/finetuned",
                "sub_path": str(finetuned_model.get("id")) + "/",
            },
        ]

        volumes_spec = [{"volume_name": "azure", "pvc_name": "model-repository-pvc"}]

        (
            volume_mounts,
            volume_spec,
        ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

        # Create a deployment
        pool_name = "llmpool"
        image_url = app_settings.FINETUNING_IMAGE_ACR_PATH

        deployment_spec = generate_deployment_spec(
            deployment_name=finetuned_model["name"],
            container_name=finetuned_model["name"] + "-container",
            image_url=image_url,
            nodepool_name=pool_name,
            replicas=1,
            pv_spec={"volumes": volume_spec, "volume_mounts": volume_mounts},
            container_port=5000,
        )

        deployment_manager.create_deployment(
            deployment_spec=deployment_spec, namespace=app_settings.FINETUNING_NAMESPACE
        )

        handle_event(
            current_event_data,
            8,
            "FINETUNING PIPELINE INITIALIZED",
            JobStatus.INPROGRESS.value,
            job_utility_service,
            job_id,
            user,
        )

        # wait for the deployment to complete
        deployment_completed = False
        max_loops = 5
        current_loop = 0
        while not deployment_completed and current_loop < max_loops:
            await asyncio.sleep(600)
            logging.info(f"Getting FINETUNING PIPELINE DEPLOYMENT Status Loop# {current_loop}")
            deployment_status = deployment_manager.track_deployment_status(
                deployment_name=finetuned_model["name"],
                namespace=app_settings.DEPLOYMENT_NAMESPACE,
            )
            current_loop += 1
            if deployment_status.conditions[1].status:
                deployment_completed = True

                handle_event(
                    current_event_data,
                    10,
                    "FINETUNING PIPELINE RUNNING",
                    JobStatus.INPROGRESS.value,
                    job_utility_service,
                    job_id,
                    user,
                )

    except Exception as e:
        logging.error(str(e))
        handle_event(
            current_event_data,
            current_event_data.get("progress"),
            "Job Error",
            JobStatus.FAILED.value,
            job_utility_service,
            job_id,
            user,
        )

    # return deployment_status


def handle_event(current_event_data, progress, message, status, job_utility_service, job_id, user):
    # current_event_data["progress"] = 50
    # current_event_data["message"] = "Deployment started successfully"
    # current_event_data["status"] = JobStatus.INPROGRESS.value
    current_event_data["progress"] = progress
    current_event_data["message"] = message
    current_event_data["status"] = status
    update_model_job(
        job_utility_service,
        job_id,
        current_event_data.get("progress"),
        current_event_data.get("status"),
        user,
    )

    trigger_event(
        job_id,
        user,
        event_type=status,
        event_data=current_event_data,
    )


def update_model_job(
    job_util_service: ModelJobUtilityService,
    job_id: str,
    progress: int,
    status: str,
    user,
):
    job_util_service.update_model_job(
        user,
        {"id": job_id, "status": status, "progress": progress},
        serialize_data=True,
    )


def trigger_event(job_id, user, event_type, event_data):
    # get event_utility_service
    event_utility_service = ModelJobEventUtilityService()

    if event_type == JobStatus.CREATED.value:
        event_utility_service.create_model_job_event(user, job_id=job_id, detail=event_data, is_set=True)
    else:
        event_utility_service.update_model_job_event(user, job_id=job_id, detail=event_data, is_set=True)


def execute_delete_finetuning_runtime(user, finetuned_model):
    logging.info(f"FINETUNED Model Name: {finetuned_model.name}, ID: {finetuned_model.id}")
    logging.info(f"Deletion Initiated By: {user.get('id', 'NONE')}")
    finetuned_model_name = finetuned_model.name
    # Initialize kube config
    initialize(
        is_cloud=True,
        cloud_provider="azure",
        cloud_settings=cloud_settings,
    )
    # Get Kube connection
    kube_connection = KubeConnection()
    logging.debug("Initialized Kube connection")

    # Delete deployment
    deployment_manager = Deployment(kube_connection)
    try:
        logging.debug(f"Deleting FineTuning Deployment - {finetuned_model_name}")

        deployment_manager.delete_deployment(finetuned_model_name, app_settings.FINETUNING_NAMESPACE)
        logging.debug(f"Deleted FineTuning Deployment - {finetuned_model_name}")

    except Exception as e:
        logging.debug(str(e))
