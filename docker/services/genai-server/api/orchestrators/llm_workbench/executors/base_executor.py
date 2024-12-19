import logging

from api.configs.settings import get_app_settings
from api.constants.variables import DeploymentType
from api.middlewares.error_middleware import GeneralException
from api.services.llm_workbench.deployment_service import LLMDeploymentService
from api.services.llm_workbench.experiment_service import LLMExperimentService
from api.services.utils.azure.fileshare_service import (
    AzureFileShareService,
    delete_local_file_reference_to_upload_file,
)
from api.services.utils.llm_workbench.llm_workbench_event_utility_service import (
    LLMWorkbenchEventUtilityService,
)
from infra_manager import initialize
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

    def __init__(self, user, execution_model, model_registry, checkpoint=None, type=None, deployed_model=None) -> None:
        self.user = user
        self.deployed_model = deployed_model
        self.execution_model = execution_model
        self.model_registry = model_registry
        self.type = type
        self.checkpoint = checkpoint
        self.volume_mounts = None
        self.volume_spec = None
        self.kube_connection = None
        self.deployment_manager = None
        self.ingress_manager = None
        self.llm_experiments_service = LLMExperimentService()
        self.llm_deployment_service = LLMDeploymentService()
        self.llm_workbench_event = LLMWorkbenchEventUtilityService()

    def update_execution_model_status(self, status):
        # Update Execution Model Status
        updated_execution_model = self.llm_experiments_service.update_llm_experiment(
            self.user,
            {"id": self.execution_model["id"], "name": self.execution_model["name"], "status": status},
            serialize_data=True,
            validate_schema=True,
        )
        return updated_execution_model

    def update_checkpoint_evaluation_status(self, status):
        # Update Checkpoint Status
        updated_checkpoint = self.llm_experiments_service.update_llm_experiment_checkpoint(
            self.user,
            {"experiment_id": self.execution_model["id"], "name": self.checkpoint["name"], "eval_status": status},
            serialize_data=True,
        )
        return updated_checkpoint

    def update_deployed_model_status(self, status, progress, endpoint=None):
        # Update Execution Model Status
        updated_execution_model = self.llm_deployment_service.update_llm_deployed_model(
            self.user,
            {
                "id": self.deployed_model["id"],
                "name": self.deployed_model["name"],
                "status": status,
                "progress": progress,
                "endpoint": endpoint,
            },
            serialize_data=True,
        )
        return updated_execution_model

    def update_event_status(self, *args, **kwargs):
        """
        Implement as per need in the child class.
        """
        pass

    def handle_status_update(self, status, **kwargs):
        if self.type == "finetune":
            # Event and DB updates are handled
            self.llm_workbench_event.update_event(
                self.user,
                self.execution_model["id"],
                detail=self.update_event_status(status, message=kwargs.get("message", None)),
                is_set=True,
            )
            self.update_execution_model_status(status)

        elif self.type == "checkpoint_evaluation":
            # Event and DB updates are handled
            self.llm_workbench_event.update_event(
                self.user,
                self.execution_model["id"],
                detail=self.update_event_status(status),
                is_set=True,
            )
            self.update_checkpoint_evaluation_status(status)

        elif self.type == "untrained_evaluation":
            # Only Event updates are handled
            self.llm_workbench_event.update_event(
                self.user,
                self.execution_model["id"],
                detail=self.update_event_status(status),
                is_set=True,
            )
        elif self.type == "deployment":
            # Event and DB updates are handled
            self.llm_workbench_event.update_event(
                self.user,
                f"{self.deployed_model['id']}-{self.deployed_model['name']}",
                detail=self.update_event_status(
                    status, message=kwargs.get("message", None), progress=kwargs.get("progress", None)
                ),
                is_set=True,
            )
            self.update_deployed_model_status(status, kwargs.get("progress", None), kwargs.get("endpoint", None))

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

        self.handle_status_update("Setting up Infra", message="Setting up Infra.", progress=20)

    def set_execution_model_volume_mounts_and_spec(self):
        # Generate Volume Mount Specification
        volume_mount_spec = [
            {
                "volume_name": "azure-train",
                "mount_path": "/train",  # Train Fileshare
                "sub_path": f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower(),
            },
            {
                "volume_name": "azure-dataset",
                "mount_path": "/dataset",  # Dataset Fileshare
                "sub_path": f"{str(self.execution_model['dataset']['dataset_folder'].replace(f'/{self.dataset_share_name}/', ''))}/",
            },
        ]

        volumes_spec = [
            {
                "volume_name": "azure-train",
                "pvc_name": "train-repository-pvc",
            },
            {
                "volume_name": "azure-dataset",
                "pvc_name": "dataset-repository-pvc",
            },
        ]

        (
            self.volume_mounts,
            self.volume_spec,
        ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

    def set_checkpoint_evaluation_volume_mounts_and_spec(self):
        # Generate Volume Mount Specification
        volume_mount_spec = [
            {
                "volume_name": "azure-train",
                "mount_path": "/train",  # Train Fileshare
                "sub_path": f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower(),
            },
            {
                "volume_name": "azure-train",
                "mount_path": "/eval",  # Train Fileshare
                "sub_path": f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower()
                + self.checkpoint["name"],
            },
        ]

        volumes_spec = [
            {
                "volume_name": "azure-train",
                "pvc_name": "train-repository-pvc",
            },
        ]

        (
            self.volume_mounts,
            self.volume_spec,
        ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

    def set_untrained_model_evaluation_volume_mounts_and_spec(self):
        # Generate Volume Mount Specification
        volume_mount_spec = [
            {
                "volume_name": "azure-train",
                "mount_path": "/train",  # Train Fileshare
                "sub_path": f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower(),
            },
        ]

        volumes_spec = [
            {
                "volume_name": "azure-train",
                "pvc_name": "train-repository-pvc",
            },
        ]

        (
            self.volume_mounts,
            self.volume_spec,
        ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

    def set_deployment_model_volume_mounts_and_spec(self):
        folder_path = (
            f"base-{self.deployed_model['name']}_{self.deployed_model['id']}_{self.model_registry['name']}/".lower()
            if self.deployed_model["deployment_type"] == DeploymentType.BASEMODEL.value
            else f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower()
        )

        sub_path = f"{folder_path}/"
        if self.deployed_model["deployment_type"] == DeploymentType.EXPERIMENT.value:
            sub_path = f"{folder_path}/evaluate/"
        if self.deployed_model["deployment_type"] == DeploymentType.CHECKPOINT.value:
            sub_path = f"{folder_path}/{self.checkpoint['name']}/"

        # Generate Volume Mount Specification
        volume_mount_spec = [
            {
                "volume_name": "azure-deployment"
                if self.deployed_model["deployment_type"] == DeploymentType.BASEMODEL.value
                else "azure-train",
                "mount_path": "/eval",  # Train Fileshare
                "sub_path": sub_path.lower(),
            },
        ]

        volumes_spec = [
            {
                "volume_name": "azure-deployment"
                if self.deployed_model["deployment_type"] == DeploymentType.BASEMODEL.value
                else "azure-train",
                "pvc_name": "deployment-repository-pvc"
                if self.deployed_model["deployment_type"] == DeploymentType.BASEMODEL.value
                else "train-repository-pvc",
            },
        ]

        (
            self.volume_mounts,
            self.volume_spec,
        ) = generate_volume_mounts_and_volumes(volume_mounts=volume_mount_spec, volumes=volumes_spec)

    def intialize_deployment(self, pool_name, image_url, deployment_name, container_name, env=[]):
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
            env=env,
        )

        logging.info(f"Deployment Specs ==>>: {deployment_spec}")

        self.deployment_manager.create_deployment(
            deployment_spec=deployment_spec,
            namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
        )

        self.handle_status_update("In-progress", message="Deployment creation successful.", progress=50)

    def intialize_deployment_using_job(self, pool_name, image_url, job_name, container_name):
        # Instantiate Deployment Manager
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

        self.handle_status_update(
            "In-progress", message="Deployment creation successful using Job Deployment.", progress=50
        )

    def delete_deployment(self, name, namespace):
        # Delete deployment
        status = self.deployment_manager.delete_deployment(deployment_name=name, namespace=namespace)
        logging.info(f"Delete Status: {status}")

    def get_or_create_node_pool(self, node_pool_details: dict):
        node_pool_manager = NodePool()
        node_pool = node_pool_manager.get_node_pool_details(node_pool_details["nodepool_name"])
        if node_pool is not None:
            return node_pool
        new_node_pool = node_pool_manager.create_node_pool(**node_pool_details)
        return new_node_pool

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
            AzureFileShareService().create_sub_directory(share_name, f"{str(path)}", str(sub_path))
        else:
            # Create folder in Parent directory
            AzureFileShareService().create_directory(share_name, f"{str(path)}")

    def upload_trainer_log_file(self, share_name, directory_path):
        # Creating Temporary File in Local.
        config_file = open("trainer_log.jsonl", "w", encoding="utf-8")
        config_file.close()

        file_location = "./trainer_log.jsonl"

        # Uploading File to File Share(File upload will override file on reuploading same file).
        upload_response = AzureFileShareService().upload_file_to_specific_path(
            share_name,
            directory_path + "trainer_log.jsonl",
            file_location,
        )
        # Deleting Temporary File
        delete_local_file_reference_to_upload_file(file_location)
        if upload_response["status"] != "success":
            self.handle_status_update(
                "Failed", message="Deployment initialization failed while creating trainer_log.jsonl"
            )
            raise GeneralException(
                message="Deployment initialization failed while creating trainer_log.jsonl", status_code=500
            )

    def upload_trainer_log_ui_file(self, share_name, directory_path):
        # Creating Temporary File in Local.
        config_file = open("trainer_log_ui.jsonl", "w", encoding="utf-8")
        config_file.close()

        file_location = "./trainer_log_ui.jsonl"

        # Uploading File to File Share(File upload will override file on reuploading same file).
        upload_response = AzureFileShareService().upload_file_to_specific_path(
            share_name,
            directory_path + "trainer_log_ui.jsonl",
            file_location,
        )
        # Deleting Temporary File
        delete_local_file_reference_to_upload_file(file_location)
        if upload_response["status"] != "success":
            self.handle_status_update(
                "Failed", message="Deployment initialization failed while creating trainer_log_ui.jsonl"
            )
            raise GeneralException(
                message="Deployment initialization failed while creating trainer_log_ui.jsonl", status_code=500
            )

    def upload_checkpoint_log_file(self, share_name, directory_path):
        # Creating Temporary File in Local.
        config_file = open("checkpoint_log.jsonl", "w", encoding="utf-8")
        config_file.close()

        file_location = "./checkpoint_log.jsonl"

        # Uploading File to File Share(File upload will override file on reuploading same file).
        upload_response = AzureFileShareService().upload_file_to_specific_path(
            share_name,
            directory_path + "checkpoint_log.jsonl",
            file_location,
        )
        # Deleting Temporary File
        delete_local_file_reference_to_upload_file(file_location)
        if upload_response["status"] != "success":
            self.handle_status_update(
                "Failed", message="Deployment initialization failed while creating checkpoint_log.jsonl"
            )
            raise GeneralException(
                message="Deployment initialization failed while creating checkpoint_log.jsonl", status_code=500
            )

    def upload_config_on_fileshare(self, config, share_name, directory_path, file_name="config.json"):
        # Creating Temporary File in Local.
        config_file = open(file_name, "w", encoding="utf-8")
        config_file.write(config)
        config_file.close()

        file_location = f"./{file_name}"

        # Uploading File to File Share(File upload will override file on reuploading same file).
        upload_response = AzureFileShareService().upload_file_to_specific_path(
            share_name,
            directory_path + file_name,
            file_location,
        )

        # Deleting Temporary File
        delete_local_file_reference_to_upload_file(file_location)
        if upload_response["status"] != "success":
            self.handle_status_update("Failed", message="Deployment initialization failed while creating config file.")
            raise GeneralException(
                message="Deployment initialization failed while creating config file.", status_code=500
            )

    def get_deployment_name(self):
        if self.deployed_model["deployment_type"] == DeploymentType.EXPERIMENT.value:
            return f"{self.deployed_model['name']}-{self.deployed_model['id']}-{self.execution_model['id']}-{DeploymentType.EXPERIMENT.value}".lower()
        elif self.deployed_model["deployment_type"] == DeploymentType.CHECKPOINT.value:
            return f"{self.deployed_model['name']}-{self.deployed_model['id']}-{self.execution_model['id']}-{self.checkpoint['name']}".lower()
        else:
            return f"{self.deployed_model['name']}-{self.deployed_model['id']}-{self.model_registry['id']}".lower()

    def setup_ingress(self, model):
        logging.info(f"Setting Up Ingress for deployment -> {self.get_deployment_name()}")
        # Setup Ingress
        k8_service = k8Service(self.kube_connection)

        # Createing Cluster IP Service
        service_spec = generate_k8_service_spec(
            service_type="ClusterIP",
            port=80,
            target_port=8000,
            name=f"{model['name']}-{model['id']}-service",
            selector=self.get_deployment_name(),
        )
        namespace_kube_service = k8_service.create_k8_service(
            namespace=OrchestratorExecutionBase.app_settings.DEPLOYMENT_NAMESPACE,
            k8_service_spec=service_spec,
        )
        logging.info(f"Kube Service: {namespace_kube_service.metadata.name}")
        # Creating Ingress Mannager:
        self.ingress_manager = Ingress(self.kube_connection)
        path_spec = generate_agic_path_spec(
            f"/deployment/{model['name']}-{model['id']}/*",
            f"{model['name']}-{model['id']}-service",
            80,
        )
        ingress_status = self.ingress_manager.bind_new_service(
            "ingress-genai-server",
            path_spec,
            OrchestratorExecutionBase.app_settings.DEPLOYMENT_NAMESPACE,
        )
        logging.info(f"Ingress Service Status: {ingress_status}")
        logging.info(f"Ingress Setup Completed for deployment -> {self.get_deployment_name()}")

        # Handle Event Ingress Setup successful. Warming Up
