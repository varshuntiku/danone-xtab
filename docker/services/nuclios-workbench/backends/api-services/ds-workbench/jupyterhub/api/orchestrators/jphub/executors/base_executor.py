import logging

from api.configs.settings import get_app_settings
from infra_manager import initialize
from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.pod_manager.pod import Pod


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

    def __init__(self, user, project_id) -> None:
        self.user = user
        self.volume_mounts = None
        self.volume_spec = None
        self.kube_connection = None
        self.project_id = project_id
        self.ingress_manager = None

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

    def delete_k8_pod(self, name, namespace):
        # Instantiate Pod Manager
        pod = Pod(self.kube_connection)
        # Get Pod
        # selected_pod = pod.get_pods(label_selector=f"hub.jupyter.org/username:{self.project_id}", namespace=namespace)
        # if selected_pod:
        # Delete Pod
        status = pod.v1.delete_namespaced_pod(name=name, namespace=namespace)
        logging.info(f"Delete Status: {status}")
        return status
        # else:
        #     logging.info("Pod not found.")
        #     return None
