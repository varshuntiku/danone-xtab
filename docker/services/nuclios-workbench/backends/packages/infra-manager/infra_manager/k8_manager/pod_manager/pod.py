import logging

from infra_manager.constants.pod_constants import POD_ERRORS
from infra_manager.core.k8.kube_connection import KubeConnection

logger = logging.getLogger(__name__)


class Pod:
    def __init__(self, conn_manager: KubeConnection):
        self.v1 = conn_manager.get_core_v1_api()

    def get_pods(self, namespace="default", label_selector: str = None):
        try:
            return self.v1.list_namespaced_pod(namespace=namespace, label_selector=label_selector)
        except Exception as e:
            logger.error(f"Failed to list pods in namespace {namespace}: {e}")
            raise

    def create_pod(self, pod_spec, namespace="default"):
        """
        Summary: Creates a new pod in the K8 Cluster namespace

        Description:
        Creates a new cluster within the k8 cluster namespace

        Args:
            pod_spec (V1PodSpec): A kubernetes.client.V1PodSpec object representing the pod to be created

        returns:
            V1Pod: A kubernetes.client.V1Pod object representing the created pod
        """
        if not isinstance(pod_spec, dict):
            logger.error("Invalid pod manifest provided")
            raise Exception(POD_ERRORS.get("pod_spec_empty"))

        try:
            self.v1.delete_namespaced_pod()
            return self.v1.create_namespaced_pod(body=pod_spec, namespace=namespace)
        except Exception as e:
            logger.error(f"Failed to create pod in namespace {namespace}: {e}")
            raise Exception(e)

    def update_pod(self, pod_name, pod_manifest, namespace="default"):
        if not pod_name or not isinstance(pod_manifest, dict):
            logger.error("Invalid parameters for updating a pod")
            return None

        try:
            return self.v1.patch_namespaced_pod(pod_name, body=pod_manifest, namespace=namespace)
        except Exception as e:
            logger.error(f"Failed to update pod {pod_name} in namespace {namespace}: {e}")
            raise

    def get_pod_logs(self, pod_name: str, namespace: str = "default") -> str:
        """
        Summary:
        Fetches logs from the specific pod.

        Description:
        Fetches the Std Out Logs for the specified pod

        Args:
            pod_name (str): The name of the pod to fetch logs for.
            namespace (str): The Kubernetes Namespace where the job is located.

        Returns:
            dict: A dictionary where keys are pod names (IDs) and values are the logs for each pod.
        """

        if not pod_name:
            raise ValueError("pod_name is required to retrieve logs")

        try:
            print("PodName", pod_name)
            pod_logs = self.v1.read_namespaced_pod_log(pod_name, namespace)
            return pod_logs
        except Exception as e:
            raise Exception(e)

    def delete_pod(self, pod_name: str, namespace: str = "default"):
        """
        Summary:
            Deletes a pod in a specified Kubernetes namespace using the Kubernetes API.

        Description:
            This method utilizes the Kubernetes Python client to delete a pod identified by its name in a given namespace.
            It ensures that the pod name is provided, otherwise raises a ValueError.
            If the Kubernetes API call fails, an exception is raised with the error details.

        Args:
            pod_name (str): The name of the pod to delete.
            namespace (str): The Kubernetes namespace where the pod is located. Defaults to "default".

        Returns:
            kubernetes.client.V1Status: The response from the Kubernetes API upon successfully deleting the pod,
            which includes the status of the delete operation.

        Raises:
            ValueError: If 'pod_name' is not provided.
            Exception: If an error occurs during the deletion process, an exception is raised with the error details.
        """
        if not pod_name:
            raise ValueError("pod_name is required")

        try:
            return self.v1.delete_namespaced_pod(name=pod_name, namespace=namespace)
        except Exception as e:
            raise Exception(e)
