import logging
import time

from api.configs.settings import get_app_settings
from api.constants.execution_environment.variables import ExecutionEnvironmentCategory
from api.middlewares.error_middleware import GeneralException
from api.services.utils.execution_environment.execution_environment_event_utility_service import (
    ExecutionEnvironmentEventUtilityService,
)
from infra_manager import initialize
from infra_manager.core.cloud.azure.fileshare_service import FileShareService
from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.deployment_manager.deployment import Deployment
from infra_manager.k8_manager.ingress_manager.ingress import Ingress
from infra_manager.k8_manager.job_manager.job import Job
from infra_manager.k8_manager.nodepool_manager.nodepool import NodePool
from infra_manager.k8_manager.service_manager.kube_service import k8Service
from infra_manager.utils.deployment_utils import generate_deployment_spec
from infra_manager.utils.ingress_utils import generate_agic_path_spec
from infra_manager.utils.job_utils import generate_job_spec
from infra_manager.utils.kube_service_utils import generate_k8_service_spec
from infra_manager.utils.pvc_utils import generate_volume_mounts_and_volumes

settings = get_app_settings()
# from datetime import datetime


def fetch_tag_name(execution_model):
    try:
        if "endpoint" in execution_model and execution_model["endpoint"]:
            if execution_model.get("env_category") == ExecutionEnvironmentCategory.DS_WORKBENCH.value:
                if execution_model["name"] in execution_model["endpoint"]:
                    return (execution_model["endpoint"].split("/")[-1].split(":")[0]).replace(
                        execution_model["name"] + "-", ""
                    )
                return f"{str(execution_model['id'])}"
            elif execution_model.get("env_category") == ExecutionEnvironmentCategory.UIAC_EXECUTOR.value:
                if execution_model["name"] in execution_model["endpoint"]:
                    return (str(execution_model["endpoint"]).rsplit("/", 2)[1]).replace(
                        execution_model["name"] + "-", ""
                    )
                return f"{str(execution_model['id'])}"
            return execution_model["endpoint"]
    except Exception as e:
        logging.info(f"Error occured while fetching tag name {e}")
    return f"{str(execution_model['id'])}"
    # -{datetime.now().microsecond}"


class OrchestratorExecutionBase:
    # Class Variables
    app_settings = get_app_settings()

    cloud_settings = {
        "AD_CLIENT_ID": app_settings.AD_CLIENT_ID,
        "AD_CLIENT_SECRET": app_settings.AD_CLIENT_SECRET,
        "TENANT_ID": app_settings.TENANT_ID,
        "RESOURCE_GROUP": app_settings.RESOURCE_GROUP,
        "CLUSTER_NAME": app_settings.CLUSTER_NAME,
        "SUBSCRIPTION_ID": app_settings.SUBSCRIPTION_ID,
    }

    def __init__(self, user, execution_model) -> None:
        self.user = user
        self.execution_model = execution_model
        self.volume_mounts = None
        self.volume_spec = None
        self.kube_connection = None
        self.deployment_manager = None
        self.ingress_manager = None
        self.tag_name = fetch_tag_name(execution_model)
        self.env_fileshare_directory = f"{self.execution_model['name']}-{self.execution_model['id']}".lower()
        self.execution_environment_event = ExecutionEnvironmentEventUtilityService()
        logging.info("User object in base executor")

    def update_execution_model_status(self, user, status, endpoint):
        # Update Execution Model Status
        """
        Implement as per need in the child class.
        """
        pass

    def update_event_status(self, user, *args, **kwargs):
        """
        Implement as per need in the child class.
        """
        pass

    def handle_status_update(self, status, **kwargs):
        # Event and DB updates are handled
        self.execution_environment_event.update_event(
            self.user,
            self.execution_model["id"],
            detail=self.update_event_status(
                self.user, status, message=kwargs.get("message", None), endpoint=kwargs.get("endpoint", None)
            ),
            is_set=True,
        )
        self.update_execution_model_status(self.user, status, endpoint=kwargs.get("endpoint", None))

    def intialize_kube_connection(self):
        # Initialize kube config
        initialize(
            is_cloud=True,
            cloud_provider="azure",
            cloud_settings=self.cloud_settings,
        )
        # Get the kube connection
        self.kube_connection = KubeConnection()
        logging.info("Kube Connection Successfull.")

    def set_execution_environment_model_volume_mounts_and_spec(self, is_image_creation=False):
        # Generate Volume Mount Specification
        volume_mount_spec = [
            {
                "volume_name": "azure",
                "mount_path": "/workspace",
                "sub_path": f"exec-envs/{self.env_fileshare_directory}/",
            },
        ]

        if is_image_creation:
            volume_mount_spec.append(
                {
                    "volume_name": "docker-config",
                    "mount_path": "/kaniko/.docker/",
                }
            )

        volumes_spec = [
            {
                "volume_name": "azure",
                "pvc_name": "exec-env-repository-pvc",
            },
        ]

        if is_image_creation:
            volumes_spec.append(
                {
                    "volume_name": "docker-config",
                    "secret": {
                        "secret_name": "kanikopushsecret",
                        "secret_key_paths": [
                            {
                                "key": self.app_settings.KANIKO_SECRET_KEY_NAME,
                                "path": "config.json",
                            }
                        ],
                    },
                }
            )

        (
            self.volume_mounts,
            self.volume_spec,
        ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

    def intialize_deployment(self, pool_name, image_url, deployment_name, container_name, tolerations=[]):
        # Instantiate Deployment Manager
        self.deployment_manager = Deployment(self.kube_connection)

        # Create a deployment
        deployment_spec = generate_deployment_spec(
            deployment_name=deployment_name,
            container_name=container_name,
            image_url=image_url,
            nodepool_name=pool_name,
            replicas=1,
            pv_spec={"volumes": self.volume_spec, "volume_mounts": self.volume_mounts},
            container_port=80,
            tolerations=tolerations,
        )

        logging.info(f"Deployment Specs ==>>: {deployment_spec}")

        deployment_response = self.deployment_manager.create_deployment(
            deployment_spec=deployment_spec,
            namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
        )

        # self.handle_status_update("In-progress", message="Deployment creation successful.", progress=50)

        return deployment_response

    def intialize_deployment_using_job(self, pool_name, image_url, job_name, container_name):
        # Instantiate Job Manager
        self.job_manager = Job(self.kube_connection)

        # Create a Job spec deployment
        deployment_spec = generate_job_spec(
            job_name=job_name,
            container_name=container_name,
            image_url=image_url,
            nodepool_name=pool_name,
            pv_spec={"volumes": self.volume_spec, "volume_mounts": self.volume_mounts},
            container_port=80,
        )

        logging.info(f"Deployment Specs using Job ==>>: {deployment_spec}")

        self.job_manager.create_job(
            job_spec=deployment_spec,
            namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
        )

        # self.handle_status_update(
        #     "In-progress", message="Deployment creation successful using Job Deployment.", progress=50
        # )

    def intialize_update_deployment(self, pool_name, image_url, deployment_name, container_name, tolerations=[]):
        # Instantiate Deployment Manager
        self.deployment_manager = Deployment(self.kube_connection)

        # Create a deployment
        deployment_spec = generate_deployment_spec(
            deployment_name=deployment_name,
            container_name=container_name,
            image_url=image_url,
            nodepool_name=pool_name,
            replicas=1,
            container_port=80,
            tolerations=tolerations,
        )

        logging.info(f"Deployment Specs ==>>: {deployment_spec}")

        deployment_response = self.deployment_manager.update_deployment(
            deployment_name=deployment_name,
            deployment_spec=deployment_spec,
            namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
        )

        return deployment_response

    def scale_deployment(self, pool_name, image_url, deployment_name, container_name, tolerations=[], replicas=1):
        # Instantiate Deployment Manager
        self.deployment_manager = Deployment(self.kube_connection)

        # Create a deployment
        deployment_spec = generate_deployment_spec(
            deployment_name=deployment_name,
            container_name=container_name,
            image_url=image_url,
            nodepool_name=pool_name,
            replicas=replicas,
            container_port=80,
            tolerations=tolerations,
        )

        deployment_response = self.deployment_manager.update_deployment(
            deployment_name=deployment_name,
            deployment_spec=deployment_spec,
            namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
        )

        return deployment_response

    def delete_deployment(self, name, namespace):
        # Instantiate Deployment Manager
        self.deployment_manager = Deployment(self.kube_connection)
        # Delete deployment
        status = self.deployment_manager.delete_deployment(deployment_name=name, namespace=namespace)
        logging.info(f"Delete Status: {status}")

    def delete_k8_service(self, exec_env_short_name, namespace):
        # Instantiate K8 service Manager
        try:
            self.k8_service = k8Service(self.kube_connection)
            # Delete service
            status = self.k8_service.delete_k8_service(
                service_name=f"{exec_env_short_name}-service",
                namespace=namespace,
            )
            logging.info(f"Delete Service: {status}")
        except Exception as e:
            logging.info(f"Error occured while deleting service {e}")

    def remove_ingres_path(self, exec_env_short_name, namespace):
        # Instantiate K8 service Manager
        try:
            self.ingress_manager = Ingress(self.kube_connection)
            # Delete service
            status = self.ingress_manager.remove_ingres_path(
                self.app_settings.INGRESS_SERVER_NAME,
                f"/deployment/{exec_env_short_name}/*",
                namespace=namespace,
            )
            logging.info(f"Remove Ingress path: {status}")
        except Exception as e:
            logging.info(f"Error occured while removing ingress path {e}")

    def get_or_create_node_pool(self, node_pool_details: dict):
        node_pool_manager = NodePool()
        try:
            node_pool = node_pool_manager.get_node_pool_details(node_pool_details["nodepool_name"])
        except Exception:
            node_pool = None
        if node_pool is not None:
            return "exists", node_pool
        try:
            new_node_pool = node_pool_manager.create_node_pool(**node_pool_details)
            return "create", new_node_pool
        except Exception as e:
            logging.info(f"Issue occured while creating node pool which is {e}.")
            self.handle_status_update("Failed", message="Deployment is failed due to node pool creation failed.")
            raise GeneralException(
                message="Deployment initialization failed while creating node pool.", status_code=500
            )

    def delete_node_pool(self, node_pool_name):
        node_pool_manager = NodePool()
        try:
            status = node_pool_manager.delete_node_pool(node_pool_name)
            return status
        except Exception as e:
            logging.info(f"Issue occured while deleting node pool which is {e}.")
            self.handle_status_update("Failed", message="Deletion of node pool is failed.")
            raise GeneralException(message="Deletion of node pool is failed.", status_code=500)

    def track_node_pool_creation(self, poller):
        while True:
            status = poller.status()
            if poller.done():
                yield status
                break
                # return status
            else:
                yield status
                time.sleep(30)
                # continue
        # node_pool_manager = NodePool()
        # status_poller = node_pool_manager.monitor_progress(poller, interval=30)
        # for status in status_poller:
        #     if status:
        #         yield status

    def get_node_pool(self, node_pool_details: dict):
        try:
            node_pool_manager = NodePool()
            node_pool = node_pool_manager.get_node_pool_details(node_pool_details["nodepool_name"])
            return node_pool
        except Exception as e:
            logging.info(f"Issue occured while getting node pool which is {e}.")
            # Update Execution Model
            self.handle_status_update("Failed", message="Deployment is failed due to node pool is not available.")
            raise GeneralException(message="Deployment initialization failed while getting node pool.", status_code=500)

    def create_fileshare_directory(self, share_name, path, sub_path=None):
        if sub_path is not None:
            FileShareService(settings.AZURE_FILE_SHARE_CONNECTION_STRING, None, None).create_sub_directory(
                share_name, f"{str(path)}", str(sub_path)
            )
        else:
            # Create folder in Parent directory
            FileShareService(settings.AZURE_FILE_SHARE_CONNECTION_STRING, None, None).create_directory(
                share_name, f"{str(path)}"
            )

    def setup_ingress(self, exec_env_short_name):
        logging.info(f"Setting Up Ingress for deployment -> {exec_env_short_name}")
        # Setup Ingress
        k8_service = k8Service(self.kube_connection)

        # Createing Cluster IP Service
        service_spec = generate_k8_service_spec(
            service_type="ClusterIP",
            port=80,
            target_port=80,
            name=f"{exec_env_short_name}-service",
            selector=f"{exec_env_short_name}-deployment",
        )
        namespace_kube_service = k8_service.create_k8_service(
            namespace=OrchestratorExecutionBase.app_settings.DEPLOYMENT_NAMESPACE,
            k8_service_spec=service_spec,
        )
        logging.info(f"Kube Service: {namespace_kube_service.metadata.name}")
        # Creating Ingress Mannager:
        self.ingress_manager = Ingress(self.kube_connection)
        path_spec = generate_agic_path_spec(
            f"/deployment/{exec_env_short_name}/*",
            f"{exec_env_short_name}-service",
            80,
        )
        ingress_status = self.ingress_manager.bind_new_service(
            self.app_settings.INGRESS_SERVER_NAME,
            path_spec,
            OrchestratorExecutionBase.app_settings.DEPLOYMENT_NAMESPACE,
        )
        logging.info(f"Ingress Service Status: {ingress_status}")
        logging.info(f"Ingress Setup Completed for deployment -> {self.execution_model['name']}")

        # Handle Event Ingress Setup successful. Warming Up
