import asyncio
import logging

import httpx
from api.configs.settings import get_app_settings
from api.constants.variables import JobStatus
from api.services.utils.ml_model.deployed_model_utility_service import (
    DeployedModelUtilityService,
)
from api.services.utils.ml_model.model_job_utility_service import (
    ModelJobEventUtilityService,
    ModelJobUtilityService,
)
from infra_manager import initialize
from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.deployment_manager.deployment import Deployment
from infra_manager.k8_manager.ingress_manager.ingress import Ingress
from infra_manager.k8_manager.service_manager.kube_service import k8Service
from infra_manager.utils.deployment_utils import generate_deployment_spec
from infra_manager.utils.ingress_utils import generate_agic_path_spec
from infra_manager.utils.kube_service_utils import generate_k8_service_spec
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


async def execute_deploy_model(deployed_model, user):
    """
    Summary: Deploys the model with sepcified name and config

    Description:
    Used for deploymeny of model as specificed in the model config

    Returns:
    acceptance: Indicates the orchestration job acceptance status

    """
    # Segregating Variable to be used:
    job_utility_service = ModelJobUtilityService()
    job_id = str(deployed_model["job_id"])
    current_event_data = {
        "progress": 0,
        "message": "Job Created",
        "status": JobStatus.CREATED.value,
    }
    handle_event(
        current_event_data,
        10,
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
            30,
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
                "mount_path": "/data",
                "sub_path": str(deployed_model.get("original_model_id")) + "/",
            },
            {
                "volume_name": "azure",
                "mount_path": "/config",
                "sub_path": str(deployed_model.get("original_model_id"))
                + "/deployments/"
                + str(deployed_model.get("id")),
            },
        ]

        volumes_spec = [{"volume_name": "azure", "pvc_name": "model-repository-pvc"}]

        (
            volume_mounts,
            volume_spec,
        ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

        # Create a deployment
        pool_name = "testpool"
        image_url = "mathcodex.azurecr.io/aks-genai-inference:cuda-latest"
        if "type" in deployed_model and deployed_model["type"] is not None:
            if deployed_model.get("type").lower() == "cpu":
                pool_name = "llmpool"
                image_url = "mathcodex.azurecr.io/aks-genai-inference:latest"
        deployment_spec = generate_deployment_spec(
            deployment_name=deployed_model["name"],
            container_name=deployed_model["name"] + "-container",
            image_url=image_url,
            nodepool_name=pool_name,
            replicas=1,
            pv_spec={"volumes": volume_spec, "volume_mounts": volume_mounts},
            container_port=5000,
        )

        deployment_manager.create_deployment(
            deployment_spec=deployment_spec, namespace=app_settings.DEPLOYMENT_NAMESPACE
        )

        handle_event(
            current_event_data,
            50,
            "Deployment started successfully",
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
            logging.info(f"Getting deployment Status Loop# {current_loop}")
            deployment_status = deployment_manager.track_deployment_status(
                deployment_name=deployed_model["name"],
                namespace=app_settings.DEPLOYMENT_NAMESPACE,
            )
            current_loop += 1
            if deployment_status.conditions[1].status:
                deployment_completed = True

                handle_event(
                    current_event_data,
                    70,
                    "Deployment Completed successfully",
                    JobStatus.INPROGRESS.value,
                    job_utility_service,
                    job_id,
                    user,
                )

        # STEP 3: Setup Ingress
        logging.info(f"Setting Up Ingress for deployment {deployed_model['name']}")

        k8_service = k8Service(kube_connection)
        # Createing Cluster IP Service
        service_spec = generate_k8_service_spec(
            service_type="ClusterIP",
            port=80,
            target_port=5000,
            name=deployed_model["name"] + "-service",
            selector=deployed_model["name"],  # + "-deployment",
        )
        namespace_kube_service = k8_service.create_k8_service(
            namespace=app_settings.DEPLOYMENT_NAMESPACE, k8_service_spec=service_spec
        )
        logging.info(f"Kube Service: {namespace_kube_service.metadata.name}")
        # Creating Ingress Mannager:
        ingress_manager = Ingress(kube_connection)
        path_spec = generate_agic_path_spec(
            "/deployment/" + deployed_model["name"] + "/*",
            deployed_model["name"] + "-service",
            80,
        )
        ingress_status = ingress_manager.bind_new_service(
            "ingress-genai-server", path_spec, app_settings.DEPLOYMENT_NAMESPACE
        )
        logging.info(f"Ingress Service Status: {ingress_status}")
        logging.info(f"Ingress Setup Completed for deployment {deployed_model['name']}")

        handle_event(
            current_event_data,
            80,
            "Ingress Setup successful. Warming Up",
            JobStatus.INPROGRESS.value,
            job_utility_service,
            job_id,
            user,
        )
        logging.info("Waiting for 10 Mins.")
        await asyncio.sleep(900)
        handle_event(
            current_event_data,
            90,
            "Completed successfully",
            JobStatus.INPROGRESS.value,
            job_utility_service,
            job_id,
            user,
        )
        # GET THE URL OF THE NEW LLM DEPLOYED
        ingress_details = ingress_manager.get_ingress_details(
            app_settings.INGRESS_SERVER_NAME, app_settings.DEPLOYMENT_NAMESPACE
        )
        logging.info("Ingress Object Created: %s", str(ingress_details))

        # STep 4: PING TEST GENAI_GATEWAY_BASE_URL

        # base_url was "http://52.188.218.220"
        base_url = app_settings.GENAI_GATEWAY_BASE_URL
        healthcheck_url = base_url + ingress_details.spec.rules[0].http.paths[-1].path[:-1]
        healthcheck_success_status = False

        max_loops = 30
        current_loop = 0

        # req = requests.get(healthcheck_url, verify=app_settings.CERTIFICATE_PATH)
        # req = requests.get(healthcheck_url, verify=False)
        # Replace this code with verify = cert from app_settings.CERTIFICATE
        async with httpx.AsyncClient(verify=app_settings.CERT_PATH) as client:
            while not healthcheck_success_status and current_loop < max_loops:
                logging.info(
                    f"For Loop# {current_loop}: Performing Health Check for {deployed_model['name']} at URL: {healthcheck_url}"
                )
                response = await client.get(healthcheck_url)
                # response = await client.get(healthcheck_url, verify=False)
                logging.info(f"For Loop# {current_loop} Current Request Status {response.status_code}")
                current_loop += 1
                if response.status_code == 200:
                    healthcheck_success_status = True
                    handle_event(
                        current_event_data,
                        100,
                        "Completed successfully",
                        JobStatus.SUCCESS.value,
                        job_utility_service,
                        job_id,
                        user,
                        deployed_model={
                            **deployed_model,
                            "endpoint": healthcheck_url,
                        },
                    )
                    break
                await asyncio.sleep(300)

    except Exception as e:
        logging.info(str(e))
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


def handle_event(
    current_event_data,
    progress,
    message,
    status,
    job_utility_service,
    job_id,
    user,
    deployed_model=None,
):
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

    if deployed_model is not None and "endpoint" in deployed_model:
        update_deployed_model(user, deployed_model)

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


def update_deployed_model(user, validated_data, serialize_data=True):
    DeployedModelUtilityService().update_deployed_model(
        user, validated_data, serialize_data=serialize_data, validate_schema=True
    )


def trigger_event(job_id, user, event_type, event_data):
    # get event_utility_service
    event_utility_service = ModelJobEventUtilityService()

    # detail = {}
    # detail["progress"] = event_data.get("progress")
    # detail["message"] = event_data.get("message")
    # detail["status"] = event_data.get("status")

    if event_type == JobStatus.CREATED.value:
        event_utility_service.create_model_job_event(user, job_id=job_id, detail=event_data, is_set=True)
    else:
        event_utility_service.update_model_job_event(user, job_id=job_id, detail=event_data, is_set=True)


def execute_delete_deploy_model(user, deployed_model):
    logging.info(f"Deployed Model Name: {deployed_model.get('name', 'NONE')}, ID: {deployed_model.get('id', 'NONE')}")
    logging.info(f"Deletion Initiated By: {user.get('id', 'NONE')}")
    deployed_model_name = deployed_model["name"]
    # Initialize kube config
    initialize(
        is_cloud=True,
        cloud_provider="azure",
        cloud_settings=cloud_settings,
    )
    # Get Kube connection
    kube_connection = KubeConnection()
    logging.info("Initialized Kube connection")

    # Delete deployment
    deployment_manager = Deployment(kube_connection)
    try:
        logging.info(f"Deleting Deployment - {deployed_model_name}")

        deployment_manager.delete_deployment(deployed_model_name, app_settings.DEPLOYMENT_NAMESPACE)
        logging.info(f"Deleted Deployment - {deployed_model_name}")

    except Exception as e:
        logging.info(str(e))

    # Delete k8 service
    try:
        logging.info(f"Deleted K8 Service for - {deployed_model_name}")

        k8_service = k8Service(kube_connection)
        k8_service.delete_k8_service(
            service_name=deployed_model_name + "-service",
            namespace=app_settings.DEPLOYMENT_NAMESPACE,
        )
        logging.info(f"Deleted K8 Service - {deployed_model_name}-service")

    except Exception as e:
        logging.info(str(e))

    # Delete ingres
    try:
        logging.info(f"Deleted Ingress Service for - {deployed_model_name}")

        ingress_manager = Ingress(kube_connection)
        ingress_manager.remove_ingres_path(
            app_settings.INGRESS_SERVER_NAME,
            "/deployment/" + deployed_model_name + "/*",
            namespace=app_settings.DEPLOYMENT_NAMESPACE,
        )
        logging.info(f"Deleted Ingress Service - /deployment/{deployed_model_name}/*")

    except Exception as e:
        logging.info(str(e))
