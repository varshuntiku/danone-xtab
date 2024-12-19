from infra_manager.core.k8.kube_connection import KubeConnection
from kubernetes.client.rest import ApiException


class Namespace:
    def __init__(self, kube_connection: KubeConnection):
        self.v1_api = kube_connection.get_core_v1_api()

    def get_all_namespaces(self):
        """
        Returns all namespaces within the cluster
        """
        namspaces = self.v1_api.list_namespace()
        return namspaces.items

    def create_namespace(self, namespace_spec):
        """
        Summary:
        Creates a new namespace

        Description:
        Creates a new namespace and returns the details

        Args:
            namespace_spec (V1Spec): Kubernetes Namespace specification
        Returns:
            namspace_object: Namespace object
        """
        if not namespace_spec:
            raise ValueError("Namespace spec is required")
        try:
            namespace = self.v1_api.create_namespace(body=namespace_spec)
            return namespace
        except Exception as e:
            raise Exception(e)

    def get_namespace_details(self, name: str):
        """
        Summary:
        Get details of a specific namespace

        Description:
        Returns the details of a specific namespace

        Args:
            name (str): Kubernetes Namespace name
        Returns:
            namspace_object: Namespace object
        """
        if name is None:
            raise ValueError("namspace name is required")
        try:
            namespace = self.v1_api.read_namespace(name=name)
            return namespace
        except Exception as e:
            raise Exception(e)

    def namspace_exists(self, name: str):
        """
        Check if namespace exists

        Returns:
            Bool: Indicating if namespace exists or not
        """
        try:
            self.v1_api.read_namespace(name=name)
            return True
        except ApiException as api_exception:
            if api_exception.status == 404:
                return False
        except Exception as e:
            raise Exception(e)
